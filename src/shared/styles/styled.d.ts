import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string
    padding: string
    transitionTime: string
    pulsationTime: string
    colors: {
      primary: string
      hilight: string
      action: string
      background: string
      text: string
      accent: string
      orderFaction: string
      chaosFaction: string
      shadowFaction: string
    }
    boxShadow: {
      level1: string
      level2: string
      level3: string
    }
  }
}
