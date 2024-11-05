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
import { DuelAgent, DuelCard } from 'src/features/cards/types'
import { createDuelCard } from 'src/features/cards/utils'
import { MockPlayerTurnState } from 'src/features/duel/__mocks__'
import { moveCardToBoard, playCard, updateAgent } from 'src/features/duel/slice'
import { DuelState, PlayerCardAction } from 'src/features/duel/types'

let mockAction: PlayerCardAction
let mockDuelState: DuelState
let cardId: DuelCard['id']

const [playerId, opponentId] = MockPlayerTurnState.playerOrder

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
  const card = createDuelCard(BrotherSachelman) as DuelAgent

  beforeEach(() => {
    cardId = card.id

    mockAction = {
      type: playCard.type,
      payload: { cardId, playerId },
    }
  })

  it('should boost alied Hammerite cards on board with lower strength', () => {
    const novice = createDuelCard(HammeriteNovice) as DuelAgent

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
      updateAgent({
        cardId: novice.id,
        playerId,
        update: {
          strength: novice.strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
        },
      }),
    )
  })

  it('should not boost hammerites with equal higher strength or opponent hammerites', () => {
    const templeGuard = createDuelCard(TempleGuard)
    const novice = createDuelCard(HammeriteNovice)

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

    const novice = createDuelCard(HammeriteNovice)

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
  const card = createDuelCard(HammeriteNovice) as DuelAgent

  beforeEach(() => {
    cardId = card.id

    mockAction = {
      type: playCard.type,
      payload: { cardId, playerId },
    }
  })

  it('should not play Hammerite Novice if there are no Hammerites in play on your side', () => {
    const novice = createDuelCard(HammeriteNovice)

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
    const novice = createDuelCard(HammeriteNovice)
    const guard = createDuelCard(TempleGuard)

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
      moveCardToBoard({
        cardId: novice.id,
        playerId,
      }),
    )
  })

  it('should not play self or Hammerite Novice copies from deck if you have another Hammerite in play', () => {
    const novice = createDuelCard(HammeriteNovice)
    const guard = createDuelCard(TempleGuard)

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
