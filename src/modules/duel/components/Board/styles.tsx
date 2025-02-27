import styled from 'styled-components'

export const StyledBoard = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`
