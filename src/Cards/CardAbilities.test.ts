import {
  BrotherSachelmanOnPlay,
  HammeriteNoviceOnPlay,
  NecromancerOnPlay
} from 'src/Cards/CardAbilities'
import {
  AzaranTheCruel,
  BrotherSachelman,
  HammeriteNovice,
  TempleGuard,
  ViktoriaThiefPawn,
  Zombie
} from 'src/Cards/CardPrototypes'
import { PlayCard } from 'src/Cards/CardTypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/Game/constants'
import { initialState } from 'src/shared/redux/reducers/GameReducer'
import {
  GamePhase,
  GameState,
  Player,
  PlayerIndex
} from 'src/shared/redux/StateTypes'

const baseMockGameState: GameState = {
  turn: 1,
  phase: GamePhase.PLAYER_TURN,
  players: [
    {
      ...EMPTY_PLAYER,
      name: 'Player',
      coins: DEFAULT_COINS_AMOUNT
    },
    {
      ...EMPTY_PLAYER,
      name: 'Player 2',
      coins: DEFAULT_COINS_AMOUNT
    }
  ],
  loggedInPlayerId: initialState.loggedInPlayerId
}

let state: GameState
let playerPlayingCard: Player
let opponent: Player
let playerIndex: PlayerIndex

beforeEach(() => {
  state = { ...baseMockGameState }
  playerPlayingCard = state.players[0]
  opponent = state.players[1]
  playerIndex = 0
})

describe(BrotherSachelman.name, () => {
  let playedCard: PlayCard

  beforeEach(() => {
    playedCard = createPlayCardFromPrototype(BrotherSachelman)
  })

  it('should boost alied Hammerite cards on board with lower strength', () => {
    state.players[0].board = [createPlayCardFromPrototype(HammeriteNovice)]

    BrotherSachelmanOnPlay({
      state,
      playedCard,
      playerIndex
    })

    expect(playerPlayingCard.board[0].strength).toBe(
      playerPlayingCard.board[0].prototype.strength + BROTHER_SACHELMAN_BOOST
    )
  })

  it('should not boost opponent Hammerite cards on board', () => {
    opponent.board = [createPlayCardFromPrototype(HammeriteNovice)]

    BrotherSachelmanOnPlay({
      state,
      playedCard,
      playerIndex
    })

    expect(opponent.board[0].strength).toBe(
      opponent.board[0].prototype.strength
    )
  })

  it('should not boost non-Hammerite or Hammerite cards with equal or higher strength', () => {
    playerPlayingCard.board = [
      createPlayCardFromPrototype(TempleGuard),
      createPlayCardFromPrototype(ViktoriaThiefPawn)
    ]

    BrotherSachelmanOnPlay({
      state,
      playedCard,
      playerIndex
    })

    playerPlayingCard.board.forEach(({ strength, prototype }) =>
      expect(strength).toEqual(prototype.strength)
    )
  })
})

describe(HammeriteNovice.name, () => {
  let playedCard: PlayCard

  beforeEach(() => {
    playedCard = createPlayCardFromPrototype(HammeriteNovice)
  })

  it('should summon all copies from deck if there is a Hammerite on the allied board', () => {
    const hammeriteNoviceInDeck = createPlayCardFromPrototype(HammeriteNovice)

    playerPlayingCard.board = [createPlayCardFromPrototype(TempleGuard)]
    playerPlayingCard.deck = [hammeriteNoviceInDeck]

    HammeriteNoviceOnPlay({
      state,
      playedCard,
      playerIndex
    })

    expect(playerPlayingCard.board).toHaveLength(2)
    expect(playerPlayingCard.board).toContain(hammeriteNoviceInDeck)
  })

  it('should summon all copies from hand if there is a Hammerite on the allied board', () => {
    const hammeriteNoviceInHand = createPlayCardFromPrototype(HammeriteNovice)

    playerPlayingCard.board = [createPlayCardFromPrototype(TempleGuard)]
    playerPlayingCard.hand = [hammeriteNoviceInHand]

    HammeriteNoviceOnPlay({
      state,
      playedCard,
      playerIndex
    })

    expect(playerPlayingCard.board).toHaveLength(2)
    expect(playerPlayingCard.board).toContain(hammeriteNoviceInHand)
  })

  it('should not summon copies if there is no Hammerite in play', () => {
    const hammeriteNoviceInHand = createPlayCardFromPrototype(HammeriteNovice)

    playerPlayingCard.board = [createPlayCardFromPrototype(ViktoriaThiefPawn)]
    playerPlayingCard.hand = [hammeriteNoviceInHand]

    HammeriteNoviceOnPlay({
      state,
      playedCard,
      playerIndex
    })

    expect(playerPlayingCard.board).toHaveLength(1)
    expect(playerPlayingCard.board).not.toContain(hammeriteNoviceInHand)
  })
})

describe(Zombie.name, () => {
  let playedCard: PlayCard

  beforeEach(() => {
    playedCard = createPlayCardFromPrototype(AzaranTheCruel)
  })

  it('should summon all copies from discard is Necromancer is played', () => {
    const zombieInDiscard = createPlayCardFromPrototype(Zombie)

    playerPlayingCard.discard = [zombieInDiscard]

    NecromancerOnPlay({
      state,
      playedCard,
      playerIndex
    })

    expect(playerPlayingCard.board).toContain(zombieInDiscard)
  })
})
