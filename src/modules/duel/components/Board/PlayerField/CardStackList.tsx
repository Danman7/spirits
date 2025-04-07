import {
  boardLabel,
  deckLabel,
  discardLabel,
  handLabel,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.messages'
import { StackLabel } from 'src/modules/duel/components/Board/PlayerField/PlayerField.styles'
import type { StackConfiguration } from 'src/modules/duel/components/Board/PlayerField/PlayerField.types'
import type { Player } from 'src/modules/duel/duel.types'
import type { CardStack } from 'src/modules/duel/state'

export const stackMessageMap: Record<CardStack, string> = {
  deck: deckLabel,
  board: boardLabel,
  hand: handLabel,
  discard: discardLabel,
}

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
    $isOnTop={isOnTop}
    onClick={config.onClickStack}
  >
    {config.showStackCount && player[stack].length ? (
      <StackLabel>
        {stackMessageMap[stack]} ({player[stack].length})
      </StackLabel>
    ) : null}
  </config.component>
)
