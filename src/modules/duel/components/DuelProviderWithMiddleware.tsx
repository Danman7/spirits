import { useEffect, useReducer, useState } from 'react'
import {
  DuelAction,
  DuelContext,
  duelMiddleware,
  duelReducer,
  DuelState,
  initialState,
} from 'src/modules/duel'

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

  const [lastAction, setLastAction] = useState<DuelAction | null>(null)

  const dispatchWithMiddleware = (action: DuelAction) => {
    dispatch(action)
    setLastAction(action)
  }

  useEffect(() => {
    if (!lastAction) return

    duelMiddleware(state, lastAction, dispatch, setLastAction)
  }, [lastAction])

  return (
    <DuelContext.Provider value={{ state, dispatch: dispatchWithMiddleware }}>
      {children}
    </DuelContext.Provider>
  )
}
