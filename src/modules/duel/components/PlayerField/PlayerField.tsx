import { useState } from 'react'
import { DuelCardComponent } from 'src/modules/duel/components/DuelCard'
import { StackConfiguration } from 'src/modules/duel/components/duelComponentTypes'
import { BotController } from 'src/modules/duel/components/PlayerField/BotController'
import { CardStackList } from 'src/modules/duel/components/PlayerField/CardStackList'
import {
  PlayerBoard,
  PlayerDeck,
  PlayerDiscard,
  PlayerHand,
  PlayerInfo,
  StyledPlayerField,
} from 'src/modules/duel/components/PlayerField/PlayerFieldStyles'
import { StackBrowseModal } from 'src/modules/duel/components/PlayerField/StackBrowseModal'
import { CARD_STACKS } from 'src/modules/duel/duelConstants'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { CardStack } from 'src/modules/duel/state/duelStateTypes'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'

const getStackConfiguration = (
  stack: CardStack,
  isOnTop: boolean,
  browseStack: (stack: CardStack) => void,
): StackConfiguration => {
  const stackConfigs: Record<CardStack, StackConfiguration> = {
    board: {
      component: PlayerBoard,
    },
    deck: {
      component: PlayerDeck,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    discard: {
      component: PlayerDiscard,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    hand: {
      component: PlayerHand,
    },
  }

  return stackConfigs[stack]
}

interface PlayerFieldProps {
  playerId: string
  isOnTop?: boolean
}

export const PlayerField: React.FC<PlayerFieldProps> = ({
  playerId,
  isOnTop = false,
}) => {
  const {
    state: {
      players,
      playerOrder: [activePlayerId],
      cards,
    },
  } = useDuel()

  const player = players[playerId]
  const { id, name, coins, income, isBot, deck, discard, board, hand } =
    players[playerId]

  const [isBrowsingStack, setIsBrowsingStack] = useState(false)
  const [browsedStack, setBrowsedStack] = useState<CardStack>('deck')

  const browseStack = (stack: CardStack) => {
    setBrowsedStack(stack)
    setIsBrowsingStack(true)
  }

  const onCloseBrowseStackModal = () => setIsBrowsingStack(false)

  return (
    <StyledPlayerField $isOnTop={isOnTop}>
      <PlayerInfo
        $isActive={playerId === activePlayerId}
        $isOnTop={isOnTop}
        data-testid={`${playerId}-info`}
      >
        <span>{name}</span> / <AnimatedNumber value={coins} uniqueId={id} />
        {income ? <span> (+{income})</span> : null}
      </PlayerInfo>

      {CARD_STACKS.map((stack) => (
        <CardStackList
          key={`${id}-${stack}`}
          config={getStackConfiguration(stack, isOnTop, browseStack)}
          stack={stack}
          player={player}
          isOnTop={isOnTop}
        />
      ))}

      {isBot ? <BotController playerId={id} /> : null}

      <StackBrowseModal
        browsedCards={Object.fromEntries(
          Object.entries(cards).filter(([id]) =>
            player[browsedStack].includes(id),
          ),
        )}
        browsedStack={browsedStack}
        isOpen={isBrowsingStack}
        onClose={onCloseBrowseStackModal}
      />

      {[...deck, ...discard, ...board, ...hand].map((cardId) => (
        <DuelCardComponent
          key={cardId}
          playerId={player.id}
          cardId={cardId}
          isOnTop={isOnTop}
        />
      ))}
    </StyledPlayerField>
  )
}
