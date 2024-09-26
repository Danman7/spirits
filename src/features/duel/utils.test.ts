import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage,
} from 'src/features/duel/messages'
import {
  getPlayerTurnModalContent,
  getPlayableCardIds,
  normalizeArrayOfPlayers,
  normalizeArrayOfCards,
} from 'src/features/duel/utils'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/features/duel/constants'
import { Player } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'

import {
  HammeriteNovice,
  Haunt,
  TempleGuard,
} from 'src/features/cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'

test('return the correct overlay message for new player turn', () => {
  expect(getPlayerTurnModalContent(true, true)).toBe(playerFirstMessage)
  expect(getPlayerTurnModalContent(false, true)).toBe(opponentFirstMessage)
  expect(getPlayerTurnModalContent(true, false)).toBe(yourTurnMessage)
  expect(getPlayerTurnModalContent(false, false)).toBe(opponentTurnMessage)
})

test('return all playable cards for a given player', () => {
  const guard = createPlayCardFromPrototype(TempleGuard)
  const novice = createPlayCardFromPrototype(HammeriteNovice)

  const mockBudgetPlayer: Player = {
    ...EMPTY_PLAYER,
    id: 'player3',
    name: 'Hume',
    coins: DEFAULT_COINS_AMOUNT,
    cards: {
      [guard.id]: guard,
      [novice.id]: novice,
    },
    hand: [guard.id, novice.id],
  }

  expect(getPlayableCardIds(mockBudgetPlayer)).toHaveLength(2)
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 3 })).toHaveLength(1)
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 3 })).toEqual([
    mockBudgetPlayer.hand[1],
  ])
  expect(getPlayableCardIds({ ...mockBudgetPlayer, coins: 0 })).toHaveLength(0)
})

it('should normalize an array of players', () => {
  const normalizedPlayers = normalizeArrayOfPlayers([MockPlayer1, MockPlayer2])

  expect(normalizedPlayers).toEqual({
    [MockPlayer1.id]: MockPlayer1,
    [MockPlayer2.id]: MockPlayer2,
  })
})

it('should normalize an array of cards', () => {
  const hammerite = createPlayCardFromPrototype(HammeriteNovice)
  const haunt = createPlayCardFromPrototype(Haunt)

  const normalizedPlayers = normalizeArrayOfCards([hammerite, haunt])

  expect(normalizedPlayers).toEqual({
    [hammerite.id]: hammerite,
    [haunt.id]: haunt,
  })
})
