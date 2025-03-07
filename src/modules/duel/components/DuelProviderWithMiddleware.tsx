import { useEffect, useReducer, useState } from 'react'
import { DuelContext } from 'src/modules/duel/state/DuelContext'
import { duelMiddleware } from 'src/modules/duel/state/duelMiddleware'
import { duelReducer, initialState } from 'src/modules/duel/state/duelReducer'
import { DuelAction, DuelState } from 'src/modules/duel/DuelTypes'

export interface DuelProps {
  children: React.ReactNode
  preloadedState?: DuelState
}

export const DuelProviderWithMiddleware: React.FC<DuelProps> = ({
  children,
  preloadedState,
}) => {
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

    duelMiddleware(state, actionList[0], dispatchWithMiddleware)

    setActionList((prev) => prev.slice(1))
  }, [state, actionList])

  return (
    <DuelContext.Provider value={{ state, dispatch: dispatchWithMiddleware }}>
      {children}
    </DuelContext.Provider>
  )
}
