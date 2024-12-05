import { AnimatePresence } from 'motion/react'
import { FC, useMemo, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import Card from 'src/features/cards/components/Card'
import { DuelCard } from 'src/features/cards/types'
import { closeMessage } from 'src/features/duel/messages'
import {
  completeRedraw,
  drawCardFromDeck,
  initializeEndTurn,
  moveCardToDiscard,
  moveToNextAttacker,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import { DuelPhase, Player } from 'src/features/duel/types'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'
import Link from 'src/shared/components/Link'
import { Modal } from 'src/shared/components/Modal'
import styles from 'src/shared/styles/components.module.css'
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
  } = player

  const dispatch = useAppDispatch()

  const [browsedStack, setBrowsedStack] = useState<browsedStack>(null)

  const onPlayCard = (cardId: string) =>
    dispatch(playCard({ cardId, playerId: id }))

  const onRedrawCard = (cardId: string) => {
    dispatch(
      putCardAtBottomOfDeck({
        cardId,
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

    if (phase === 'Redrawing Phase' && !hasPerformedAction && !isOnTop) {
      return onRedrawCard
    }

    return undefined
  }

  const closeBrowseCardsModal = () => setBrowsedStack(null)

  const openBrowseCardsModal = (cardList: browsedStack) =>
    setBrowsedStack(cardList)

  const onBoardCardLayoutComplete = (card: DuelCard) => {
    if (
      (phase === 'Player Turn' && card.id === board[board.length - 1]) ||
      card.type === 'instant'
    ) {
      if (card.type === 'instant') {
        dispatch(moveCardToDiscard({ cardId: card.id, playerId: id }))
      }

      dispatch(initializeEndTurn())
    }
  }

  const onBoardCardAnimationComplete = (card: DuelCard) => {
    if (card.id === attackingAgentId) {
      dispatch(moveToNextAttacker())
    }
  }

  const modalContent = useMemo(
    () =>
      browsedStack ? (
        <div className={styles.cardBrowserModal}>
          <h1>Browsing {browsedStack}</h1>
          <div className={styles.cardList}>
            {player[browsedStack].map((cardId) => (
              <Card key={`${cardId}-browse`} card={cards[cardId]} />
            ))}
          </div>

          <div className={styles.cardBrowseModalFooter}>
            <Link onClick={closeBrowseCardsModal}>{closeMessage}</Link>
          </div>
        </div>
      ) : null,
    [browsedStack, cards, player],
  )

  return (
    <>
      <h2
        data-testid={isOnTop ? OPPONENT_INFO_ID : PLAYER_INFO_ID}
        className={`${isOnTop ? styles.topPlayerInfo : styles.bottomPlayerInfo} ${isActive ? styles.activePlayerInfo : ''}`}
      >
        <span>{name}</span> / <AnimatedNumber value={coins} />
        {income ? <span> (+{income})</span> : null}
      </h2>

      <div className={isOnTop ? styles.topPlayerSide : styles.bottomPlayerSide}>
        {discard.length ? (
          <div
            data-testid={isOnTop ? OPPONENT_DISCARD_ID : PLAYER_DISCARD_ID}
            style={!isOnTop ? { cursor: 'pointer' } : {}}
            className={styles.faceDownStack}
            onClick={
              !isOnTop ? () => openBrowseCardsModal('discard') : undefined
            }
          >
            {discard.map((cardId) => (
              <Card
                layout
                layoutId={cardId}
                key={`${cardId}-discard`}
                card={cards[cardId]}
                isSmall
                isFaceDown
              />
            ))}
          </div>
        ) : null}

        <div
          data-testid={isOnTop ? OPPONENT_HAND_ID : PLAYER_HAND_ID}
          className={isOnTop ? styles.topPlayerHand : styles.bottomPlayerHand}
        >
          {hand.map((cardId, i) => (
            <Card
              layout
              layoutId={cardId}
              key={`${cardId}-hand`}
              card={cards[cardId]}
              onClickCard={getOnClickCard()}
              isFaceDown={isOnTop}
              transition={{ layout: { delay: 0.1 * i } }}
            />
          ))}
        </div>

        {deck.length ? (
          <div
            data-testid={isOnTop ? OPPONENT_DECK_ID : PLAYER_DECK_ID}
            style={!isOnTop ? { cursor: 'pointer' } : {}}
            className={styles.faceDownStack}
            onClick={!isOnTop ? () => openBrowseCardsModal('deck') : undefined}
          >
            <AnimatePresence>
              {deck.map((cardId) => (
                <Card
                  layout
                  layoutId={cardId}
                  key={`${cardId}-deck`}
                  card={cards[cardId]}
                  isSmall
                  isFaceDown
                  exit={{ opacity: 0 }}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : null}
      </div>

      <div
        data-testid={isOnTop ? OPPONENT_BOARD_ID : PLAYER_BOARD_ID}
        className={isOnTop ? styles.topPlayerBoard : styles.bottomPlayerBoard}
      >
        <AnimatePresence>
          {board.map((cardId, i) => (
            <Card
              layout
              layoutId={cardId}
              onAnimationComplete={() =>
                onBoardCardAnimationComplete(cards[cardId])
              }
              onLayoutAnimationComplete={() =>
                onBoardCardLayoutComplete(cards[cardId])
              }
              key={`${cardId}-board`}
              transition={{ layout: { delay: 0.1 * i } }}
              card={cards[cardId]}
              isSmall
              isAttacking={attackingAgentId === cardId}
              isOnTop={isOnTop}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={!!browsedStack}>{modalContent}</Modal>
    </>
  )
}

export default PlayerField
