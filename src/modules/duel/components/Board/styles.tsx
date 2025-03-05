import styled from 'styled-components'

export const StyledBoard = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`

export const LeftPanelsWrapper = styled.div`
  position: absolute;
  left: 0px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
  justify-content: flex-end;
  padding: 1em;
`
