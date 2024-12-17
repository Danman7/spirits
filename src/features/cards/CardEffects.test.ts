import { ListenerEffectAPI } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/app/store'
import {
  BookOfAsh,
  BrotherSachelman,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  ViktoriaThiefPawn,
  Zombie,
} from 'src/features/cards/CardBases'
import {
  BookOfAshEffect,
  BrotherSachelmanOnPlayEffect,
  HammeriteNoviceOnPlayEffect,
} from 'src/features/cards/CardEffects'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import {
  addNewCards,
  moveCardToBoard,
  playCard,
  updateCard,
} from 'src/features/duel/slice'
import { DuelState, PlayerStacks } from 'src/features/duel/types'
import { MockPlayerTurnState } from 'src/shared/__mocks__'
import { normalizePlayerCards } from 'src/features/duel/utils'

let mockDuelState: DuelState

const [playerId] = MockPlayerTurnState.playerOrder

const mockDispatch = jest.fn()

const listenerApi: ListenerEffectAPI<RootState, AppDispatch> = {
  getState: jest.fn(() => ({ duel: { ...MockPlayerTurnState } })),
  dispatch: mockDispatch,
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

const getPlayCardAction = (normalizedCards: PlayerStacks) => ({
  type: playCard.type,
  payload: { cardId: normalizedCards.hand[0], playerId },
})

beforeEach(() => {
  mockDuelState = { ...MockPlayerTurnState }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe(BrotherSachelman.name, () => {
  it('should boost alied Hammerite cards on board with lower strength', () => {
    const normalizedCards = normalizePlayerCards({
      board: [HammeriteNovice],
      hand: [BrotherSachelman],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BrotherSachelmanOnPlayEffect(
      getPlayCardAction(normalizedCards),
      listenerApi,
    )

    expect(listenerApi.dispatch).toHaveBeenCalledWith(
      updateCard({
        cardId: normalizedCards.board[0],
        playerId,
        update: {
          strength:
            (HammeriteNovice.strength as number) +
            HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
        },
      }),
    )
  })

  it('should not boost hammerites with equal higher strength or opponent hammerites', () => {
    const normalizedCards = normalizePlayerCards({
      board: [TempleGuard],
      hand: [BrotherSachelman],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BrotherSachelmanOnPlayEffect(
      getPlayCardAction(normalizedCards),
      listenerApi,
    )

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })

  it('should boost hammerites accordingly if is damaged', () => {
    const normalizedCards = normalizePlayerCards({
      board: [HammeriteNovice],
      hand: [
        {
          ...BrotherSachelman,
          strength: (HammeriteNovice.strength as number) - 1,
        },
      ],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BrotherSachelmanOnPlayEffect(
      getPlayCardAction(normalizedCards),
      listenerApi,
    )

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })
})

describe(HammeriteNovice.name, () => {
  it('should not play Hammerite Novice if there are no Hammerites in play on your side', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [HammeriteNovice, HammeriteNovice],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    HammeriteNoviceOnPlayEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })

  it('should play all Hammerite Novice copies from your hand if you have another Hammerite in play', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [HammeriteNovice, HammeriteNovice],
      board: [TempleGuard],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    HammeriteNoviceOnPlayEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledWith(
      moveCardToBoard({
        cardId: normalizedCards.hand[1],
        playerId,
      }),
    )
  })

  it('should not play Hammerite Novice copies from deck', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [HammeriteNovice],
      deck: [HammeriteNovice],
      board: [TempleGuard],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    HammeriteNoviceOnPlayEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })
})

describe(BookOfAsh.name, () => {
  it('should spawn two copies if a non-unique card is at the top of the discard', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [BookOfAsh],
      discard: [Haunt, Zombie],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BookOfAshEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(3)
    expect(listenerApi.dispatch).toHaveBeenNthCalledWith(
      1,
      addNewCards(
        expect.objectContaining({
          playerId,
        }),
      ),
    )

    expect(
      Object.values(mockDispatch.mock.calls[0][0].payload.cards),
    ).toContainEqual(
      expect.objectContaining({
        name: 'Zombie',
      }),
    )

    expect(listenerApi.dispatch).toHaveBeenNthCalledWith(
      2,
      moveCardToBoard({
        playerId,
        cardId: expect.any(String),
      }),
    )
  })

  it('should spawn two copies of top non-unique agent in discard even if a unique card is at the top', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [BookOfAsh],
      discard: [Zombie, Haunt, ViktoriaThiefPawn],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BookOfAshEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(
      Object.values(mockDispatch.mock.calls[0][0].payload.cards),
    ).toContainEqual(
      expect.objectContaining({
        name: 'Haunt',
      }),
    )
  })

  it('should not spawn anything if there is only unique cards in the discard', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [BookOfAsh],
      discard: [ViktoriaThiefPawn],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    listenerApi.getState = jest.fn(() => ({
      duel: mockDuelState,
    }))

    BookOfAshEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })

  it('should not spawn anything if there are no cards in the discard', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [BookOfAsh],
      discard: [],
    })

    mockDuelState.players[playerId] = {
      ...mockDuelState.players[playerId],
      ...normalizedCards,
    }

    BookOfAshEffect(getPlayCardAction(normalizedCards), listenerApi)

    expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  })
})
