import { Predicate } from 'src/app/listenerMiddleware'
import { playCard } from 'src/modules/duel/slice'

export const OnPlay: Predicate = (action) => playCard.match(action)
