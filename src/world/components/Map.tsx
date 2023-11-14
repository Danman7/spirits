import { FC, PropsWithChildren } from 'react'
import { RegionTypes, Region } from 'src/world'

interface MapProps {
  width: number
  height: number
  regions: RegionTypes.Region[]
}

export const Map: FC<PropsWithChildren<MapProps>> = ({
  width,
  height,
  regions
}) => (
  <svg width={width} height={height}>
    {regions.map(region => (
      <Region key={region.id} {...region} />
    ))}
  </svg>
)
