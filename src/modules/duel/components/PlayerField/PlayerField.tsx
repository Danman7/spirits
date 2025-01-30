import { useAppDispatch, useAppSelector } from 'src/app/store'
import { BotController, CardStackList } from 'src/modules/duel/components'
import { CARD_STACKS } from 'src/modules/duel/constants'
import { getActivePlayerId, getPlayers } from 'src/modules/duel/selectors'
import { setBrowsedStack, setIsBrowsingStack } from 'src/modules/duel/slice'
import { CardStack, StackConfiguration } from 'src/modules/duel/types'
import { AnimatedNumber } from 'src/shared/components'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
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
} from 'src/shared/testIds'

const getStackConfiguration = (
  stack: CardStack,
  isOnTop: boolean,
  browseStack: (stack: CardStack) => void,
): StackConfiguration => {
  const stackConfigs: Record<CardStack, StackConfiguration> = {
    board: {
      testId: isOnTop ? OPPONENT_BOARD_ID : PLAYER_BOARD_ID,
      className: isOnTop
        ? components.topPlayerBoard
        : components.bottomPlayerBoard,
    },
    deck: {
      testId: isOnTop ? OPPONENT_DECK_ID : PLAYER_DECK_ID,
      className: isOnTop
        ? components.topPlayerDeck
        : components.bottomPlayerDeck,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    discard: {
      testId: isOnTop ? OPPONENT_DISCARD_ID : PLAYER_DISCARD_ID,
      className: isOnTop
        ? components.topPlayerDiscard
        : components.bottomPlayerDiscard,
      onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
    },
    hand: {
      testId: isOnTop ? OPPONENT_HAND_ID : PLAYER_HAND_ID,
      className: isOnTop
        ? components.topPlayerHand
        : components.bottomPlayerHand,
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
  const dispatch = useAppDispatch()
  const players = useAppSelector(getPlayers)
  const activePlayerId = useAppSelector(getActivePlayerId)

  const player = players[playerId]
  const { id, name, coins, income, isBot } = player
  const isActive = playerId === activePlayerId

  const browseStack = (stack: CardStack) => {
    dispatch(setBrowsedStack(stack))
    dispatch(setIsBrowsingStack(true))
  }

  return (
    <div
      className={
        isOnTop ? components.topPlayerField : components.bottomPlayerField
      }
    >
      <h2
        data-testid={isOnTop ? OPPONENT_INFO_ID : PLAYER_INFO_ID}
        className={`${isOnTop ? components.topPlayerInfo : components.bottomPlayerInfo}${isActive ? ` ${components.activePlayerInfo} ${animations.pop}` : ''}`}
      >
        <span>{name}</span> /{' '}
        <AnimatedNumber value={coins} uniqueId={playerId} />
        {income ? <span> (+{income})</span> : null}
      </h2>

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
    </div>
  )
}
