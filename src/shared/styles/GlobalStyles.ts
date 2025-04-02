import styled, { createGlobalStyle, keyframes } from 'styled-components'

import { animationMixin } from 'src/shared/styles/mixins'

export const GlobalStyles = createGlobalStyle`
  body *,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2,
h3,
h4,
h5,
p {
  margin: 0;
}

body {
  min-height: 100vh;
  font-family: 'Noto Serif', serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

small {
  display: block;
  font-size: 0.8em;
}

input,
button,
textarea,
select {
  font: inherit;
}

@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`

export const Box = styled.div`
  ${animationMixin()}
  text-align: center;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.level3};
  border-radius: ${({ theme }) => theme.spacing}px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`

export const FadeIn = keyframes`
  from {
    opacity: 0;
  }
  

  to {
    opacity: 1;
  }
`

export const FadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`

export const SlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-3rem);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const SlideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0);
  }

  to {
    opacity: 0;
    transform: translateX(3rem);
  }
`

export const Pop = keyframes`
from {
    scale: 1;
  }

  to {
    scale: 2;
  }
`

export const Separator = styled.div`
  opacity: 0.2;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.text};
`

export const AccentText = styled.small`
  display: block;
  font-style: italic;
  color: ${({ theme }) => theme.colors.accent};
`
