import { DefaultTheme } from 'styled-components'
import { SLOW_ANIMATION_DURATION } from './Game/constants'

export const defaultTheme: DefaultTheme = {
  borderRadius: '4px',
  quickAnimationDuration: '0.1s',
  slowAnimationDuration: `${SLOW_ANIMATION_DURATION}ms`,
  spacing: 8,

  cardWidth: 250,
  cardHeight: 350,

  colors: {
    main: '#e81c4f',
    line: '#999',
    pale: '#ccc',
    background: '#fff'
  }
}
