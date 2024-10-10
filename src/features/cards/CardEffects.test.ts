import { ListenerEffectAPI } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/app/store'
import {
  BrotherSachelmanOnPlayEffect,
  HammeriteNoviceOnPlayEffect,
} from 'src/features/cards/CardEffects'
import {
  BrotherSachelman,
  HammeriteNovice,
  TempleGuard,
} from 'src/features/cards/CardPrototypes'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'
import { MockPlayerTurnState } from 'src/features/duel/__mocks__'
import { playCardFromHand, updateCard } from 'src/features/duel/slice'
import { DuelState, PlayCardFromHandAction } from 'src/features/duel/types'
import { PlayCard } from 'src/features/cards/types'

let mockAction: PlayCardFromHandAction
let mockDuelState: DuelState
let card: PlayCard
let cardId: PlayCard['id']

const playerId = MockPlayerTurnState.playerOrder[1]
const opponentId = MockPlayerTurnState.playerOrder[0]

const listenerApi: ListenerEffectAPI<RootState, AppDispatch> = {
  getState: jest.fn(() => ({ duel: { ...MockPlayerTurnState } })),
  dispatch: jest.fn(),
  getOriginalState: jest.fn(),
  unsubscribe: jest.fn(),
  subscribe: jest.fn(),
  condition: jest.fn(),
  take: jest.fn(),
  cancelActiveListeners: jest.fn(),
  cancel: jest.fn(),
  throwIfCancelled: jest.fn(),
  delay: jest.fn(),
  fork: jest.fn(),
  pause: jest.fn(),
  signal: {
    aborted: false,
    onabort: jest.fn(),
    reason: jest.fn(),
    throwIfAborted: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    any: jest.fn(),
  },
  extra: undefined,
}

beforeEach(() => {
  mockDuelState = { ...MockPlayerTurnState }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(BrotherSachelman.name, () => {
  beforeEach(() => {
    card = createPlayCardFromPrototype(BrotherSachelman)
    cardId = card.id

    mockAction = {
      type: playCardFromHand.type,
      payload: { cardId, playerId },
    }
  })

  it('should boost alied Hammerite cards on board with lower strength', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockDuelState.players[playerId].cards = {
      [cardId]: card,
      [novice.id]: novice,
    }

    mockDuelState.players[playerId].hand = [cardId]
    mockDuelState.players[playerId].board = [novice.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BrotherSachelmanOnPlayEffect(mockAction, listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledWith(
      updateCard({
        cardId: novice.id,
        playerId,
        update: {
          strength: novice.strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
        },
      }),
    )
  })

  it('should not boost hammerites with equal higher strength or opponent hammerites', () => {
    const templeGuard = createPlayCardFromPrototype(TempleGuard)
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockDuelState.players[playerId].cards = {
      [cardId]: card,
      [templeGuard.id]: templeGuard,
    }

    mockDuelState.players[playerId].hand = [cardId]
    mockDuelState.players[playerId].board = [templeGuard.id]

    mockDuelState.players[opponentId].cards = {
      [novice.id]: novice,
    }

    mockDuelState.players[opponentId].board = [novice.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BrotherSachelmanOnPlayEffect(mockAction, listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })

  it('should boost hammerites accordingly if is damaged', () => {
    card.strength = card.strength - 2

    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockDuelState.players[playerId].cards = {
      [cardId]: card,
      [novice.id]: novice,
    }

    mockDuelState.players[playerId].hand = [cardId]
    mockDuelState.players[playerId].board = [novice.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BrotherSachelmanOnPlayEffect(mockAction, listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })
})

describe(HammeriteNovice.name, () => {
  beforeEach(() => {
    card = createPlayCardFromPrototype(HammeriteNovice)
    cardId = card.id

    mockAction = {
      type: playCardFromHand.type,
      payload: { cardId, playerId },
    }
  })

  it('should not play Hammerite Novice if there are no Hammerites in play on your side', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockDuelState.players[playerId].cards = {
      [cardId]: card,
      [novice.id]: novice,
    }

    mockDuelState.players[playerId].hand = [cardId, novice.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    HammeriteNoviceOnPlayEffect(mockAction, listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })

  it('should play all Hammerite Novice copies from your hand if you have another Hammerite in play', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const guard = createPlayCardFromPrototype(TempleGuard)

    mockDuelState.players[playerId].cards = {
      [cardId]: card,
      [novice.id]: novice,
      [guard.id]: guard,
    }
    mockDuelState.players[playerId].hand = [cardId, novice.id]
    mockDuelState.players[playerId].board = [guard.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    HammeriteNoviceOnPlayEffect(mockAction, listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledWith(
      playCardFromHand({
        cardId: novice.id,
        playerId,
      }),
    )
  })

  it('should not play self or Hammerite Novice copies from deck if you have another Hammerite in play', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const guard = createPlayCardFromPrototype(TempleGuard)

    mockDuelState.players[playerId].cards = {
      [cardId]: card,
      [novice.id]: novice,
      [guard.id]: guard,
    }

    mockDuelState.players[playerId].hand = [cardId]
    mockDuelState.players[playerId].deck = [novice.id]
    mockDuelState.players[playerId].board = [guard.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    HammeriteNoviceOnPlayEffect(mockAction, listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })
})
