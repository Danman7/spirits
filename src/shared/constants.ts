export const FACTION_COLOR_MAP = {
  Order: 'var(--order-faction-color)',
  Chaos: 'var(--chaos-faction-color)',
  Shadow: 'var(--shadow-faction-color)',
}

export const QUICK_ANIMATION_TIME = process.env.NODE_ENV === 'test' ? 10 : 200

export const PHASE_MODAL_TIMEOUT = process.env.NODE_ENV === 'test' ? 10 : 2000
