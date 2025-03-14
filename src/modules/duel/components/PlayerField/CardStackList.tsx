import { FC } from 'react'
import { StackConfiguration } from 'src/modules/duel/components/duelComponentTypes'
import { Player } from 'src/modules/duel/playerTypes'
import { CardStack } from 'src/modules/duel/state/duelStateTypes'

interface CardStackListProps {
  stack: CardStack
  config: StackConfiguration
  player: Player
  isOnTop?: boolean
}

export const CardStackList: FC<CardStackListProps> = ({
  stack,
  config,
  player,
  isOnTop,
}) => (
  <config.component
    id={`${player.id}-${stack}`}
    data-testid={`${player.id}-${stack}`}
    $isOnTop={isOnTop}
    onClick={config.onClickStack}
  />
)
