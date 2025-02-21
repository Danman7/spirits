import { FC } from 'react'
import { DuelCardComponent } from 'src/modules/duel/components/DuelCard'
import { CardStack, Player, StackConfiguration } from 'src/modules/duel/types'

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
