import type { StackConfiguration } from 'src/modules/duel/components/Board/PlayerField/PlayerField.types'
import type { Player } from 'src/modules/duel/duel.types'
import type { CardStack } from 'src/modules/duel/state'

interface CardStackListProps {
  stack: CardStack
  config: StackConfiguration
  player: Player
  isOnTop?: boolean
}

export const CardStackList: React.FC<CardStackListProps> = ({
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
