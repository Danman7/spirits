import anime from 'animejs/lib/anime.es.js'
import { DefaultTheme } from 'styled-components/dist/types'

export const numberChangeAnimation = (
  element: HTMLElement | null,
  theme: DefaultTheme
) =>
  anime({
    targets: element,
    scale: [1, 1.5],
    color: (element: HTMLElement) => [
      window.getComputedStyle(element).color,
      theme.colors.hilight
    ],
    direction: 'alternate',
    duration: 250,
    autoplay: false
  })

export const boostCardAnimation = (element: HTMLElement | null) =>
  anime({
    targets: element,
    scale: [1, 1.1, 1],
    autoplay: false
  })

export const playableCardAnimation = (
  element: HTMLElement | null,
  theme: DefaultTheme
) =>
  anime({
    targets: element,
    boxShadow: [
      `0 0 2px 2px ${theme.colors.positive}`,
      `0 0 4px 4px ${theme.colors.positive}`,
      `0 0 2px 2px ${theme.colors.positive}`
    ],
    duration: theme.slowAnimationDuration,
    loop: true,
    autoplay: false
  })
