import { paperMixin } from 'src/shared/styles/mixins'
import styled from 'styled-components'

export const StyledBoard = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${paperMixin}
`
