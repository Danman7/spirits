import { createContext } from 'react'

import type { DuelAction, DuelState } from 'src/modules/duel/state'

export const duelContext = createContext<
  { state: DuelState; dispatch: (action: DuelAction) => void } | undefined
>(undefined)
