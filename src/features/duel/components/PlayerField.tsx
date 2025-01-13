import { FC, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import { Card } from 'src/features/cards/components/Card'
import { BotController } from 'src/features/duel/components/BotController'
import { PlayCard } from 'src/features/duel/components/PlayCard'
import { closeMessage } from 'src/features/duel/messages'
import {
  completeRedraw,
  drawCardFromDeck,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import { DuelCard, DuelPhase, Player } from 'src/features/duel/types'
import { triggerPostCardPlay } from 'src/features/duel/utils'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'
import { Link } from 'src/shared/components/Link'
import { Modal } from 'src/shared/components/Modal'
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
import { shuffleArray } from 'src/shared/utils'

type browsedStack = 'deck' | 'discard' | null

export interface PlayerFieldProps {
  player: Player
  phase: DuelPhase
  isOnTop: boolean
  isActive: boolean
  attackingAgentId: string
}

const PlayerField: FC<PlayerFieldProps> = ({
  player,
  phase,
  isOnTop,
  isActive,
  attackingAgentId,
}) => {
  const {
    id,
    name,
    coins,
    income,
    cards,
    deck,
    hand,
    board,
    discard,
    hasPerformedAction,
    isBot,
  } = player

  const dispatch = useAppDispatch()

  const [browsedStack, setBrowsedStack] = useState<browsedStack>(null)
  const [isBrowseStackOpen, setIsBrowseStackOpen] = useState(false)

  const onPlayCard = (card: DuelCard) => {
    dispatch(playCard({ cardId: card.id, playerId: id }))

    triggerPostCardPlay({
      card,
      playerId: id,
      dispatch,
    })
  }

  const onRedrawCard = (card: DuelCard) => {
    dispatch(
      putCardAtBottomOfDeck({
        cardId: card.id,
        playerId: id,
      }),
    )

    dispatch(drawCardFromDeck(id))

    dispatch(completeRedraw(id))
  }

  const getOnClickCard = () => {
    if (
      phase === 'Player Turn' &&
      isActive &&
      !isOnTop &&
      !hasPerformedAction
    ) {
      return onPlayCard
    }

    if (phase === 'Redrawing' && !hasPerformedAction && !isOnTop) {
      return onRedrawCard
    }

    return undefined
  }

  const closeBrowseCardsModal = () => setIsBrowseStackOpen(false)

  const openBrowseCardsModal = (stack: browsedStack) => {
    setIsBrowseStackOpen(true)
    setBrowsedStack(stack)
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
          isOnTop ? components.topPlayerSide : components.bottomPlayerSide
        }
      >
        <div
          data-testid={isOnTop ? OPPONENT_DISCARD_ID : PLAYER_DISCARD_ID}
          style={!isOnTop ? { cursor: 'pointer' } : {}}
          className={components.faceDownStack}
          onClick={!isOnTop ? () => openBrowseCardsModal('discard') : undefined}
        >
          {discard.map((cardId) => (
            <PlayCard
              key={cardId}
              playerId={id}
              card={cards[cardId]}
              isSmall
              isFaceDown
            />
          ))}
        </div>

        <div
          data-testid={isOnTop ? OPPONENT_HAND_ID : PLAYER_HAND_ID}
          className={
            isOnTop ? components.topPlayerHand : components.bottomPlayerHand
          }
        >
          {hand.map((cardId) => (
            <PlayCard
              key={cardId}
              playerId={id}
              card={cards[cardId]}
              onClickCard={getOnClickCard()}
              isFaceDown={isOnTop}
            />
          ))}
        </div>

        <div
          data-testid={isOnTop ? OPPONENT_DECK_ID : PLAYER_DECK_ID}
          style={!isOnTop ? { cursor: 'pointer' } : {}}
          className={components.faceDownStack}
          onClick={!isOnTop ? () => openBrowseCardsModal('deck') : undefined}
        >
          {deck.map((cardId) => (
            <PlayCard
              key={cardId}
              playerId={id}
              card={cards[cardId]}
              isSmall
              isFaceDown
            />
          ))}
        </div>
      </div>

      <div
        data-testid={isOnTop ? OPPONENT_BOARD_ID : PLAYER_BOARD_ID}
        className={
          isOnTop ? components.topPlayerBoard : components.bottomPlayerBoard
        }
      >
        {board.map((cardId) => (
          <PlayCard
            key={cardId}
            playerId={id}
            card={cards[cardId]}
            isSmall
            isAttacking={attackingAgentId === cardId}
            isOnTop={isOnTop}
          />
        ))}
      </div>

      {/* Browse facedown stacks modal */}
      <Modal isOpen={isBrowseStackOpen}>
        {browsedStack ? (
          <div className={components.cardBrowserModal}>
            <h1>Browsing your {browsedStack} (not in order)</h1>
            <div className={components.cardList}>
              {shuffleArray(player[browsedStack]).map((cardId) => (
                <Card key={`${cardId}-browse`} card={cards[cardId]} />
              ))}
            </div>

            <div className={components.cardBrowseModalFooter}>
              <Link onClick={closeBrowseCardsModal}>{closeMessage}</Link>
            </div>
          </div>
        ) : null}
      </Modal>

      {isBot ? (
        <BotController player={player} phase={phase} isActive={isActive} />
      ) : null}
    </>
  )
}

export default PlayerField
