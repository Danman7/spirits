import * as commonTriggers from 'src/modules/duel/state/triggers/common'
import * as orderTriggers from 'src/modules/duel/state/triggers/Order'

export const duelTriggers = [
  ...Object.values(commonTriggers),
  ...Object.values(orderTriggers),
]
