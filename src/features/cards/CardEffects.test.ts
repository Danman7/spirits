import { ListenerEffectAPI } from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/app/store'
import { boostHammeritesWithLessStrength } from 'src/features/cards/CardEffects'
import {
  BrotherSachelman,
  HammeriteNovice,
  // TempleGuard
} from 'src/features/cards/CardPrototypes'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'
import { MockPlayerTurnState } from 'src/features/duel/__mocks__'
import { playCardFromHand, updateCard } from 'src/features/duel/slice'
import { DuelState, PlayCardFromHandAction } from 'src/features/duel/types'

let mockAction: PlayCardFromHandAction
let mockduelState: DuelState

const playerId = MockPlayerTurnState.playerOrder[1]
// const opponentId = MockPlayerTurnState.playerOrder[0]

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
  mockduelState = { ...MockPlayerTurnState }
})

describe('boostHammeritesWithLessStrength', () => {
  beforeEach(() => {
    const card = createPlayCardFromPrototype(BrotherSachelman)

    mockAction = {
      type: playCardFromHand.type,
      payload: { card, playerId },
    }
  })

  test('should boost alied Hammerite cards on board with lower strength', () => {
    const brother = createPlayCardFromPrototype(BrotherSachelman)
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockduelState.players[playerId].cards = {
      [brother.id]: brother,
      [novice.id]: novice,
    }

    mockduelState.players[playerId].hand = [brother.id]
    mockduelState.players[playerId].board = [novice.id]

    listenerApi.getState = jest.fn(() => ({
      duel: mockduelState,
    }))

    boostHammeritesWithLessStrength(mockAction, listenerApi)

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

  // test('should not boost hammerites with equal higher strength or opponent hammerites', () => {
  //   const brother = createPlayCardFromPrototype(BrotherSachelman)
  //   const templeGuard = createPlayCardFromPrototype(TempleGuard)
  //   const novice = createPlayCardFromPrototype(HammeriteNovice)

  //   mockduelState.players[playerId].cards = {
  //     [brother.id]: brother,
  //     [templeGuard.id]: templeGuard
  //   }

  //   mockduelState.players[playerId].hand = [brother.id]
  //   mockduelState.players[playerId].board = [templeGuard.id]

  //   mockduelState.players[opponentId].cards = {
  //     [novice.id]: novice
  //   }

  //   mockduelState.players[opponentId].board = [novice.id]

  //   listenerApi.getState = jest.fn(() => ({
  //     duel: mockduelState
  //   }))

  //   boostHammeritesWithLessStrength(mockAction, listenerApi)

  //   expect(listenerApi.dispatch).toHaveBeenCalledTimes(0)
  // })
})
