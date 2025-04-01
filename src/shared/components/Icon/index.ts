export * from 'src/shared/components/Icon/Icon'

import Scroll from 'src/shared/components/Icon/assets/scroll.svg?react'
import Coins from 'src/shared/components/Icon/assets/coins.svg?react'
import Hourglass from 'src/shared/components/Icon/assets/hourglass.svg?react'
import retaliates from 'src/shared/components/Icon/assets/sword.svg?react'
import deck from 'src/shared/components/Icon/assets/deck.svg?react'
import discard from 'src/shared/components/Icon/assets/discard.svg?react'

export const Icons = { Scroll, Coins, Hourglass, retaliates, deck, discard }

export type IconName = keyof typeof Icons
