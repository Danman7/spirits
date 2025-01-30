import { FC } from 'react'
import { PlayCard } from 'src/modules/duel/components'
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
  <div
    data-testid={config.testId}
    className={config.className}
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
  </div>
)
