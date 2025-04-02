import { useContext } from 'react'

import { duelContext } from 'src/modules/duel/components/DuelProvider/duelContext'
import { duelContextError } from 'src/modules/duel/components/DuelProvider/DuelProvider.messages'

export const useDuel = () => {
  const context = useContext(duelContext)
  if (!context) throw new Error(duelContextError)
  return context
}
