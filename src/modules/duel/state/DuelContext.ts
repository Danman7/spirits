import { createContext, useContext } from 'react'
import { duelContextError } from 'src/modules/duel/state/DuelStateMessages'
import { DuelAction, DuelState } from 'src/modules/duel/DuelTypes'

export const DuelContext = createContext<
  { state: DuelState; dispatch: (action: DuelAction) => void } | undefined
>(undefined)

export const useDuel = () => {
  const context = useContext(DuelContext)
  if (!context) throw new Error(duelContextError)
  return context
}
