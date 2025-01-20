import { Effect } from 'src/app/listenerMiddleware'
import { getPlayAllCopiesEffect } from 'src/features/duel/utils'
import { HammeriteNovice } from 'src/shared/CardBases'

export const PlayAllHammeriteNoviceCopies: Effect = (action, listenerApi) =>
  getPlayAllCopiesEffect(action, listenerApi, HammeriteNovice)
