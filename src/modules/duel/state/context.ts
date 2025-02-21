import { createContext, useContext } from 'react'
import { DuelAction, DuelState } from 'src/modules/duel'

export const DuelContext = createContext<
  { state: DuelState; dispatch: (action: DuelAction) => void } | undefined
>(undefined)

export const useDuel = () => {
  const context = useContext(DuelContext)
  if (!context) throw new Error('useDuel must be used within a DuelProvider')
  return context
}
