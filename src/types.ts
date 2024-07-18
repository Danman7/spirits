import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string
    animationDuration: string
    spacing: number

    cardWidth: number
    cardHeight: number

    colors: {
      main: string
      line: string
      pale: string
      background: string
    }
  }
}
