import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    spacing: number
    transitionTime: number
    card: { width: number; height: number }
    colors: {
      primary: string
      hilight: string
      action: string
      background: string
      text: string
      accent: string
      elite: string
      orderFaction: string
      chaosFaction: string
      shadowFaction: string
    }
    boxShadow: { level1: string; level2: string; level3: string }
  }
}
