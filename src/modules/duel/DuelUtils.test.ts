import {
  opponentId,
  opponentMock,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/__mocks__/duelMocks'
import {
  CARD_STACKS,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/duelConstants'
import {
  getPlayableCardIds,
  normalizeStateCards,
  sortPlayerIdsForBoard,
} from 'src/modules/duel/duelUtils'
import { UsersStartingDuel } from 'src/modules/duel/state/duelActionTypes'
import { setupPlayersFromUsers } from 'src/modules/duel/state/duelStateUtils'

it('should get all playable card ids for a given player with getPlayableCardIds', () => {
  const { players, cards } = normalizeStateCards(stackedDuelStateMock, {
    [playerId]: {
      hand: ['TempleGuard', 'HammeriteNovice'],
    },
  })

  const player = players[playerId]

  expect(getPlayableCardIds(player, cards)).toHaveLength(2)
  expect(getPlayableCardIds({ ...player, coins: 3 }, cards)).toHaveLength(1)
  expect(getPlayableCardIds({ ...player, coins: 3 }, cards)).toEqual([
    player.hand[1],
  ])
  expect(getPlayableCardIds({ ...player, coins: 0 }, cards)).toHaveLength(0)
})

it('should normalize players cards into all possible stacks with normalizePlayerCards', () => {
  const { cards, players } = normalizeStateCards(stackedDuelStateMock, {
    [playerId]: {
      board: ['TempleGuard'],
      hand: ['HammeriteNovice'],
      deck: ['Haunt'],
      discard: ['Zombie'],
    },
    [opponentId]: {
      deck: ['BookOfAsh'],
      hand: ['Haunt'],
      board: ['Zombie'],
      discard: ['AzaranTheCruel'],
    },
  })

  CARD_STACKS.forEach((stack) => {
    expect(players[playerId][stack]).toHaveLength(1)
  })

  expect(Object.keys(cards)).toHaveLength(8)
})

it("should normalize a player's cards into some stacks with normalizePlayerCards", () => {
  const { players } = normalizeStateCards(stackedDuelStateMock, {
    [playerId]: {
      board: ['TempleGuard'],
    },
  })

  const player = players[playerId]

  expect(player.deck).toHaveLength(0)
  expect(player.hand).toHaveLength(0)
  expect(player.discard).toHaveLength(0)
})

it('should setup setup initial duel players from users', () => {
  const users = [userMock, opponentMock] as UsersStartingDuel
  const { players, cards } = setupPlayersFromUsers(users)

  Object.values(players).forEach((player, index) => {
    expect(player).toMatchObject({
      name: users[index].name,
      id: users[index].id,
      coins: STARTING_COINS_IN_DUEL,
      hand: [],
      board: [],
      discard: [],
      hasPerformedAction: false,
      income: 0,
    })

    expect(player.deck).toHaveLength(users[index].deck.length)
  })

  expect(Object.keys(cards)).toHaveLength(
    userMock.deck.length + opponentMock.deck.length,
  )
})

it('should sort duel players so logged in user is second', () => {
  expect(sortPlayerIdsForBoard(stackedDuelStateMock.players, playerId)).toEqual(
    [opponentId, playerId],
  )
})
