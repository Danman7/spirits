import { FC } from 'react'
import { PlayCard } from 'src/modules/duel/components'
import { CardStack, Player, StackConfiguration } from 'src/modules/duel'

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
    data-testid={config.testId}
    isOnTop={isOnTop}
    onClick={config.onClickStack}
  >
    {player[stack].map((cardId) => (
      <PlayCard
        key={`${stack}-${cardId}`}
        stack={stack}
        playerId={player.id}
        cardId={cardId}
        isOnTop={isOnTop}
      />
    ))}
  </config.component>
)
