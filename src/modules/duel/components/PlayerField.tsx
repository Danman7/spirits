import { useState } from 'react'
import {
  CARD_STACKS,
  CardStack,
  Player,
  StackConfiguration,
} from 'src/modules/duel'
import {
  BotController,
  CardStackList,
  PlayerBoard,
  PlayerDeck,
  PlayerDiscard,
  PlayerHand,
  PlayerInfo,
  StackBrowseModal,
  StyledPlayerField,
} from 'src/modules/duel/components'
import { AnimatedNumber } from 'src/shared/components'
import {
  OPPONENT_BOARD_ID,
  OPPONENT_DECK_ID,
  OPPONENT_DISCARD_ID,
  OPPONENT_HAND_ID,
  OPPONENT_INFO_ID,
  PLAYER_BOARD_ID,
  PLAYER_DECK_ID,
  PLAYER_DISCARD_ID,
  PLAYER_HAND_ID,
  PLAYER_INFO_ID,
} from 'src/shared/test'

const getStackConfiguration = (
  stack: CardStack,
  isOnTop: boolean,
  browseStack: (stack: CardStack) => void,
): StackConfiguration => {
  const stackConfigs: Record<CardStack, StackConfiguration> = {
    board: {
      testId: isOnTop ? OPPONENT_BOARD_ID : PLAYER_BOARD_ID,
      component: PlayerBoard,
    },
    deck: {
      testId: isOnTop ? OPPONENT_DECK_ID : PLAYER_DECK_ID,
      component: PlayerDeck,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    discard: {
      testId: isOnTop ? OPPONENT_DISCARD_ID : PLAYER_DISCARD_ID,
      component: PlayerDiscard,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    hand: {
      testId: isOnTop ? OPPONENT_HAND_ID : PLAYER_HAND_ID,
      component: PlayerHand,
    },
  }

  return stackConfigs[stack]
}

interface PlayerFieldProps {
  player: Player
  isActive: boolean
  isOnTop?: boolean
}

export const PlayerField: React.FC<PlayerFieldProps> = ({
  player,
  isActive,
  isOnTop = false,
}) => {
  const { id, name, coins, income, isBot, cards } = player

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
        $isActive={isActive}
        $isOnTop={isOnTop}
        data-testid={isOnTop ? OPPONENT_INFO_ID : PLAYER_INFO_ID}
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
    </StyledPlayerField>
  )
}
