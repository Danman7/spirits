import { createContext, useContext } from 'react'
import { duelContextError } from 'src/modules/duel/state/messages'
import { DuelAction, DuelState } from 'src/modules/duel/types'

export const DuelContext = createContext<
  { state: DuelState; dispatch: (action: DuelAction) => void } | undefined
>(undefined)

export const useDuel = () => {
  const context = useContext(DuelContext)
  if (!context) throw new Error(duelContextError)
  return context
}
