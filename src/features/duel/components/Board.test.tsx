import { clearAllListeners } from '@reduxjs/toolkit'
import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'

import { addAppListener } from 'src/app/listenerMiddleware'
import { RootState } from 'src/app/store'
import { ElevatedAcolyte } from 'src/features/cards/CardBases'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import {
  CardEffectName,
  CardEffectPredicateName,
} from 'src/features/cards/types'
import Board from 'src/features/duel/components/Board'
import { EMPTY_PLAYER } from 'src/features/duel/constants'
import {
  opponentDecidingMessage,
  victoryMessage,
} from 'src/features/duel/messages'
import { playCard, startInitialCardDraw } from 'src/features/duel/slice'
import { stackedPlayerMock, stackedDuelState } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { OVERLAY_TEST_ID } from 'src/shared/testIds'
import { normalizePlayerCards } from 'src/features/duel/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = { duel: { ...stackedDuelState } }
})

it('should add card effect listeners on mount', () => {
  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  const cardWithTrigger = stackedPlayerMock.cards[stackedPlayerMock.deck[0]]

  expect(dispatchSpy).toHaveBeenCalledWith(clearAllListeners())
  expect(dispatchSpy).toHaveBeenCalledWith(
    addAppListener({
      predicate:
        CardEffectPredicates[
          cardWithTrigger.trigger?.predicate as CardEffectPredicateName
        ],
      effect: CardEffects[cardWithTrigger.trigger?.effect as CardEffectName],
    }),
  )
})

it('should initiate card drawing', async () => {
  preloadedState.duel.phase = 'Pre-duel'

  const { getByTestId, dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
  })

  await act(async () => {
    await new Promise((r) => setTimeout(r, 2500))
  })

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  expect(dispatchSpy).toHaveBeenCalledWith(startInitialCardDraw())
})

it('should show if player is victorious', () => {
  preloadedState.duel.players[stackedPlayerMock.id].coins = 0

  const { getByText } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(
    getByText(
      `${stackedDuelState.players[stackedDuelState.playerOrder[0]].name} ${victoryMessage}`,
    ),
  ).toBeInTheDocument()
})

it('should show if opponent is victorious', () => {
  preloadedState.duel.players[stackedDuelState.playerOrder[0]].coins = 0

  const { getByText } = renderWithProviders(<Board />, {
    preloadedState,
  })

  expect(
    getByText(
      `${stackedDuelState.players[stackedPlayerMock.id].name} ${victoryMessage}`,
    ),
  ).toBeInTheDocument()
})

it('should play CPU turn', async () => {
  const CPUId = 'cpu-player'
  const CPUPlayer = {
    ...EMPTY_PLAYER,
    ...normalizePlayerCards({
      hand: [ElevatedAcolyte],
    }),
    id: CPUId,
    isCPU: true,
    coins: 20,
  }

  preloadedState.duel.activePlayerId = CPUId
  preloadedState.duel.playerOrder = [CPUId, stackedPlayerMock.id]
  preloadedState.duel.players = {
    [stackedPlayerMock.id]: stackedPlayerMock,
    [CPUId]: CPUPlayer,
  }

  const { getByText, getByTestId, dispatchSpy } = renderWithProviders(
    <Board />,
    { preloadedState },
  )

  await act(async () => {
    await new Promise((r) => setTimeout(r, 2500))
  })

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  await waitFor(() =>
    expect(getByText(opponentDecidingMessage)).toBeInTheDocument(),
  )

  expect(dispatchSpy).toHaveBeenCalledWith(
    playCard({
      cardId: CPUPlayer.hand[0],
      playerId: CPUId,
    }),
  )
})
