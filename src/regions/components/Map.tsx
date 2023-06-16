import { FC, PropsWithChildren } from 'react'

interface MapProps {
  width: number
  height: number
}

export const Map: FC<PropsWithChildren<MapProps>> = ({
  width,
  height,
  children
}) => (
  <svg width={width} height={height}>
    {children}
  </svg>
)
