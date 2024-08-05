import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string
    quickAnimationDuration: string
    slowAnimationDuration: string
    spacing: number

    cardWidth: number
    cardHeight: number

    colors: {
      main: string
      active: string
      line: string
      pale: string
      background: string
      shadow: string
    }
  }
}
