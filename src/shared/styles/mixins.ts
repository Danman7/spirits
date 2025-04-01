import { css } from 'styled-components'

export const animationMixin = (durationMultiplier?: number) => css`
  animation-duration: ${({ theme }) =>
    theme.transitionTime * (durationMultiplier || 1)}ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
`

export const transitionMixin = css`
  transition-duration: ${({ theme }) => theme.transitionTime}ms;
  transition-timing-function: ease-in-out;
`

export const paperMixin = css`
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
`
