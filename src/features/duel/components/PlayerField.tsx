import { useAppDispatch } from 'src/app/store'
import { BotController } from 'src/features/duel/components/BotController'
import { PlayCard } from 'src/features/duel/components/PlayCard'
import { CARD_STACKS } from 'src/features/duel/constants'
import { setBrowsedStack, setIsBrowsingStack } from 'src/features/duel/slice'
import { CardStack, Player } from 'src/features/duel/types'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'
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

interface StackConfiguration {
  className: string
  testId: string
  isSmall?: boolean
  isFaceDown?: boolean
  onClickStack?: React.MouseEventHandler<HTMLDivElement>
}

export interface PlayerFieldProps {
  player: Player
  isOnTop: boolean
  isActive: boolean
}

const PlayerField: React.FC<PlayerFieldProps> = ({
  player,
  isOnTop,
  isActive,
}) => {
  const { name, coins, income, cards, isBot } = player

  const dispatch = useAppDispatch()
  const browseStack = (stack: CardStack) => {
    dispatch(setBrowsedStack(stack))
    dispatch(setIsBrowsingStack(true))
  }

  const getStackConfiguration = (stack: CardStack): StackConfiguration => {
    const stackConfigs: Record<CardStack, StackConfiguration> = {
      board: {
        testId: isOnTop ? OPPONENT_BOARD_ID : PLAYER_BOARD_ID,
        className: isOnTop
          ? components.topPlayerBoard
          : components.bottomPlayerBoard,
        isSmall: true,
      },
      deck: {
        testId: isOnTop ? OPPONENT_DECK_ID : PLAYER_DECK_ID,
        className: isOnTop
          ? components.topPlayerDeck
          : components.bottomPlayerDeck,
        onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
        isFaceDown: true,
        isSmall: true,
      },
      discard: {
        testId: isOnTop ? OPPONENT_DISCARD_ID : PLAYER_DISCARD_ID,
        className: isOnTop
          ? components.topPlayerDiscard
          : components.bottomPlayerDiscard,
        onClickStack: !isOnTop ? () => browseStack(stack) : undefined,
        isFaceDown: true,
        isSmall: true,
      },
      hand: {
        testId: isOnTop ? OPPONENT_HAND_ID : PLAYER_HAND_ID,
        className: isOnTop
          ? components.topPlayerHand
          : components.bottomPlayerHand,
        isFaceDown: isOnTop,
      },
    }

    return stackConfigs[stack]
  }

  return (
    <>
      <h2
        data-testid={isOnTop ? OPPONENT_INFO_ID : PLAYER_INFO_ID}
        className={`${isOnTop ? components.topPlayerInfo : components.bottomPlayerInfo}${isActive ? ` ${components.activePlayerInfo} ${animations.pop}` : ''}`}
      >
        <span>{name}</span> / <AnimatedNumber value={coins} />
        {income ? <span> (+{income})</span> : null}
      </h2>

      <div
        className={
          isOnTop ? components.topPlayerField : components.bottomPlayerField
        }
      >
        {CARD_STACKS.map((stack) => {
          const config = getStackConfiguration(stack)

          return (
            <div
              key={stack}
              data-testid={config.testId}
              className={config.className}
              onClick={config.onClickStack}
            >
              {player[stack].map((cardId) => (
                <PlayCard
                  key={cardId}
                  stack={stack}
                  player={player}
                  card={cards[cardId]}
                  isOnTop={isOnTop}
                />
              ))}
            </div>
          )
        })}
      </div>

      {isBot ? <BotController player={player} isActive={isActive} /> : null}
    </>
  )
}

export default PlayerField
