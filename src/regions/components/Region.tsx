import { FC } from 'react'
import { RegionTypes } from 'src/regions'
import { RegionBorder, RegionName } from 'src/regions/components/styles'

export const Region: FC<RegionTypes.Region> = ({ name, namePath, border }) => (
  <g>
    <RegionBorder d={border} />
    <path id={`${name}-name-path`} fill="none" d={namePath} />
    <RegionName>
      <textPath
        href={`#${name}-name-path`}
        startOffset="50%"
        textAnchor="middle"
        fontSize={24}
      >
        {name}
      </textPath>
    </RegionName>
  </g>
)
