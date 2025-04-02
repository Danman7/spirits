import * as commonTriggers from 'src/modules/duel/state/triggers/triggers.common'
import * as orderTriggers from 'src/modules/duel/state/triggers/triggers.order'

export const duelTriggers = [
  ...Object.values(commonTriggers),
  ...Object.values(orderTriggers),
]
