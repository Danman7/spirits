import * as baseOrderTriggers from 'src/modules/duel/state/triggers/baseOrderTriggers'
import * as commonTriggers from 'src/modules/duel/state/triggers/commonTriggers'
import * as eliteOrderTriggers from 'src/modules/duel/state/triggers/eliteOrderTriggers'

export const duelTriggers = [
  ...Object.values(commonTriggers),
  ...Object.values(baseOrderTriggers),
  ...Object.values(eliteOrderTriggers),
]
