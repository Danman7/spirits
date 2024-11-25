import { clearAllListeners } from '@reduxjs/toolkit'

import { addAppListener } from 'src/app/listenerMiddleware'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import {
  CardEffectName,
  CardEffectPredicateName,
} from 'src/features/cards/types'
import {
  mockStackedPlayer,
  stackedPreloadedState as preloadedState,
} from 'src/features/duel/__mocks__'
import Board from 'src/features/duel/components/Board'
import { renderWithProviders } from 'src/shared/test-utils'

it('should add card effect listeners on mount', () => {
  const { dispatchSpy } = renderWithProviders(<Board />, {
    preloadedState,
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
