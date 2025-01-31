import { DefaultTheme } from 'styled-components'

export const defaultTheme: DefaultTheme = {
  borderRadius: '6px',
  padding: '0.5em',
  transitionTime: '0.2s',
  pulsationTime: '0.5s',
  boxShadow: {
    level1:
      '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
    level2:
      '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
    level3:
      '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  },
  colors: {
    primary: '#e63b19',
    hilight: '#477deb',
    action: '#19e6a2',
    background: '#fafaf9',
    text: '#3d2c29',
    accent: '#996f66',
    orderFaction: '#731e0d',
    chaosFaction: '#0d7351',
    shadowFaction: '#1241a1',
  },
}
