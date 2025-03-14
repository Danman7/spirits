import { createContext, useContext } from 'react'
import { DuelAction } from 'src/modules/duel/state/duelActionTypes'
import { duelContextError } from 'src/modules/duel/state/duelStateMessages'
import { DuelState } from 'src/modules/duel/state/duelStateTypes'

export const DuelContext = createContext<
  { state: DuelState; dispatch: (action: DuelAction) => void } | undefined
>(undefined)

export const useDuel = () => {
  const context = useContext(DuelContext)
  if (!context) throw new Error(duelContextError)
  return context
}
