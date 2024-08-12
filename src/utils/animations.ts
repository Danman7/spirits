import anime from 'animejs'
import { DefaultTheme } from 'styled-components'

export const numberChangeAnimation = (
  element: HTMLElement | null,
  theme: DefaultTheme
) =>
  anime({
    targets: element,
    scale: 1.5,
    color: theme.colors.hilight,
    direction: 'alternate',
    duration: 250,
    autoplay: false
  })

export const boostCardAnimation = (
  element: HTMLElement | null,
  theme: DefaultTheme
) =>
  anime({
    targets: element,
    scale: 1.1,
    boxShadow: [
      `0 0 0 0 ${theme.colors.hilight}`,
      `0 0 5px 5px ${theme.colors.hilight}`
    ],
    duration: 250,
    direction: 'alternate',
    loop: 2,
    autoplay: false
  })

export const playableCardAnimation = (
  element: HTMLElement | null,
  theme: DefaultTheme,
  isPlayable?: boolean
) =>
  isPlayable && !!anime
    ? anime({
        targets: element,
        boxShadow: [
          `0 0 0 0 ${theme.colors.positive}`,
          `0 0 5px 5px ${theme.colors.positive}`
        ],
        direction: 'alternate',
        easing: 'linear',
        loop: true
      })
    : anime.remove(element)
