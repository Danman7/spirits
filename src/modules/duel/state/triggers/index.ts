import * as commonTriggers from 'src/modules/duel/state/triggers/CommonTriggers'
import * as orderTriggers from 'src/modules/duel/state/triggers/OrderTriggers'

export const duelTriggers = [
  ...Object.values(commonTriggers),
  ...Object.values(orderTriggers),
]
