import { MutableRefObject, useEffect, useRef } from 'react'

export const usePrevious = <T>(value: T): MutableRefObject<T>['current'] => {
  const ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  })

  return ref.current as MutableRefObject<T>['current']
}
