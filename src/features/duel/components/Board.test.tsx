import '@testing-library/jest-dom'
import { clearAllListeners } from '@reduxjs/toolkit'
import { fireEvent, waitFor } from '@testing-library/dom'

import { addAppListener } from 'src/app/listenerMiddleware'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import {
  CardEffectName,
  CardEffectPredicateName,
} from 'src/features/cards/types'
import Board from 'src/features/duel/components/Board'
import { opponentDecidingMessage } from 'src/features/duel/messages'
import { playCard } from 'src/features/duel/slice'
import { mockStackedPlayer, stackedDuelState } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { MODAL_TEST_ID } from 'src/shared/testIds'
import { normalizePlayerCards } from 'src/shared/utils'
import { ElevatedAcolyte } from 'src/features/cards/CardBases'
import { EMPTY_PLAYER } from 'src/features/duel/constants'

it('should add card effect listeners on mount', () => {
  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState: {
      duel: stackedDuelState,
    },
  })

  const cardWithTrigger = mockStackedPlayer.cards[mockStackedPlayer.deck[0]]

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

  const { getByText, getByTestId, dispatchSpy } = renderWithProviders(
    <Board />,
    {
      preloadedState: {
        duel: {
          ...stackedDuelState,
          playerOrder: [CPUId, mockStackedPlayer.id],
          players: {
            [mockStackedPlayer.id]: mockStackedPlayer,
            [CPUId]: CPUPlayer,
          },
          activePlayerId: CPUId,
        },
      },
    },
  )

  fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))

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
