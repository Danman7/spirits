import { styled } from 'styled-components'

export const RegionBorder = styled.path`
  stroke: black;
  stroke-width: 2;
  fill: none;
  pointer-events: all;
  stroke-linejoin: round;

  &:hover {
    stroke: gold;
  }
`

export const RegionName = styled.text`
  pointer-events: none;
  letter-spacing: 5px;
`
