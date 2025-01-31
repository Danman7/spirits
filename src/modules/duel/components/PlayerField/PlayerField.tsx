import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  BotController,
  CardStackList,
  PlayerBoard,
  PlayerDeck,
  PlayerDiscard,
  PlayerHand,
  PlayerInfo,
  StyledPlayerField,
} from 'src/modules/duel/components'
import { CARD_STACKS } from 'src/modules/duel/constants'
import { getActivePlayerId, getPlayers } from 'src/modules/duel/selectors'
import { setBrowsedStack, setIsBrowsingStack } from 'src/modules/duel/slice'
import { CardStack, StackConfiguration } from 'src/modules/duel/types'
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
} from 'src/shared/testIds'

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
    <StyledPlayerField isOnTop={isOnTop}>
      <PlayerInfo
        isActive={isActive}
        isOnTop={isOnTop}
        data-testid={isOnTop ? OPPONENT_INFO_ID : PLAYER_INFO_ID}
      >
        <span>{name}</span> /{' '}
        <AnimatedNumber value={coins} uniqueId={playerId} />
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
    </StyledPlayerField>
  )
}
