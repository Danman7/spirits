import { addAppListener, startAppListening } from 'src/app/listenerMiddleware'
import { beginPlay } from 'src/features/duel/slice'
import * as CardEffects from 'src/features/cards/CardEffects'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'

// Add listeners for card effects
startAppListening({
  actionCreator: beginPlay,
  effect: (_, listenerApi) => {
    const { players } = listenerApi.getState().duel

    const addedListeners: string[] = []

    Object.values(players).forEach(({ cards }) =>
      Object.keys(cards).forEach((cardId) => {
        const { trigger, name } = cards[cardId]

        if (trigger && !addedListeners.includes(name)) {
          const { predicate, effect } = trigger

          listenerApi.dispatch(
            addAppListener({
              predicate: CardEffectPredicates[predicate],
              effect: CardEffects[effect],
            }),
          )

          addedListeners.push(name)
        }
      }),
    )
  },
})
