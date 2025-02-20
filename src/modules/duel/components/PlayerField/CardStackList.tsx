import { FC } from 'react'
import { CardStack, Player, StackConfiguration } from 'src/modules/duel'
import { DuelCardComponent } from 'src/modules/duel/components'

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
    data-testid={`${player.id}-${stack}`}
    $isOnTop={isOnTop}
    onClick={config.onClickStack}
  >
    {player[stack].map((cardId) => (
      <DuelCardComponent
        key={`${stack}-${cardId}`}
        playerId={player.id}
        cardId={cardId}
        isOnTop={isOnTop}
      />
    ))}
  </config.component>
)
