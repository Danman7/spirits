import { useEffect, useReducer, useState } from 'react'

import { duelContext } from 'src/modules/duel/components/DuelProvider/duelContext'
import { duelProviderMiddleware } from 'src/modules/duel/components/DuelProvider/DuelProvider.middleware'
import { duelReducer, initialState } from 'src/modules/duel/state'
import type { DuelAction, DuelState } from 'src/modules/duel/state'

export const DuelProvider: React.FC<{
  children: React.ReactNode
  preloadedState?: DuelState
}> = ({ children, preloadedState }) => {
  const [state, dispatch] = useReducer(
    duelReducer,
    preloadedState || initialState,
  )

  const [actionList, setActionList] = useState<DuelAction[]>([])

  const dispatchWithMiddleware = (action: DuelAction) => {
    dispatch(action)
    setActionList((prev) => [...prev, action])
  }

  useEffect(() => {
    if (!actionList.length) return

    duelProviderMiddleware(state, actionList[0], dispatchWithMiddleware)

    setActionList((prev) => prev.slice(1))
  }, [state, actionList])

  return (
    <duelContext.Provider value={{ state, dispatch: dispatchWithMiddleware }}>
      {children}
    </duelContext.Provider>
  )
}
