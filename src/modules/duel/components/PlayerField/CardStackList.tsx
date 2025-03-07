import { FC } from 'react'
import {
  CardStack,
  Player,
  StackConfiguration,
} from 'src/modules/duel/DuelTypes'

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
