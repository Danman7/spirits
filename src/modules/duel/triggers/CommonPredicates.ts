import { Predicate } from 'src/app'
import { playCard } from 'src/modules/duel'

export const OnPlay: Predicate = (action) => playCard.match(action)
