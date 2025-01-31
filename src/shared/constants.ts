import { defaultTheme } from 'src/shared/styles'

export const ACTION_WAIT_TIMEOUT = 1000
export const PHASE_MODAL_TIMEOUT = 2500

const { orderFaction, chaosFaction, shadowFaction } = defaultTheme.colors

export const FACTION_COLOR_MAP = {
  Order: orderFaction,
  Chaos: chaosFaction,
  Shadow: shadowFaction,
}
