import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Noto Serif', serif;
  }

  P {
    padding: 16px 0;
  }
`

export const Lead = styled.div`
  font-size: 1.25em;
`

export const PositiveText = styled.span`
  color: ${({ theme }) => theme.colors.positive};
  text-shadow: 1px 1px 1px #000;
`

export const NegativeText = styled.span`
  color: ${({ theme }) => theme.colors.negative};
  text-shadow: 1px 1px 1px #000;
`
