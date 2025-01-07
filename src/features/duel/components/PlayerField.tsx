import { FC, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import { Card } from 'src/features/cards/components/Card'
import { closeMessage } from 'src/features/duel/messages'
import {
  completeRedraw,
  drawCardFromDeck,
  moveToNextAttacker,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import { DuelPhase, Player } from 'src/features/duel/types'
import { triggerPostCardPlay } from 'src/features/duel/utils'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'
import { Link } from 'src/shared/components/Link'
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
import { DuelCard } from 'src/shared/types'
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

    if (phase === 'Redrawing Phase' && !hasPerformedAction && !isOnTop) {
      return onRedrawCard
    }

    return undefined
  }

  const closeBrowseCardsModal = () => setIsBrowseStackOpen(false)

  const openBrowseCardsModal = (stack: browsedStack) => {
    setIsBrowseStackOpen(true)
    setBrowsedStack(stack)
  }

  const onAttackAnimationEnd = () => dispatch(moveToNextAttacker())

  return (
    <>
      <h2
        data-testid={isOnTop ? OPPONENT_INFO_ID : PLAYER_INFO_ID}
        className={`${isOnTop ? styles.topPlayerInfo : styles.bottomPlayerInfo}${isActive ? ` ${styles.activePlayerInfo}` : ''}`}
      >
        <span>{name}</span> / <AnimatedNumber value={coins} />
        {income ? <span> (+{income})</span> : null}
      </h2>

      <div className={isOnTop ? styles.topPlayerSide : styles.bottomPlayerSide}>
        <div
          data-testid={isOnTop ? OPPONENT_DISCARD_ID : PLAYER_DISCARD_ID}
          style={!isOnTop ? { cursor: 'pointer' } : {}}
          className={styles.faceDownStack}
          onClick={!isOnTop ? () => openBrowseCardsModal('discard') : undefined}
        >
          {discard.map((cardId) => (
            <Card key={cardId} card={cards[cardId]} isSmall isFaceDown />
          ))}
        </div>

        <div
          data-testid={isOnTop ? OPPONENT_HAND_ID : PLAYER_HAND_ID}
          className={isOnTop ? styles.topPlayerHand : styles.bottomPlayerHand}
        >
          {hand.map((cardId) => (
            <Card
              key={cardId}
              card={cards[cardId]}
              onClickCard={getOnClickCard()}
              isFaceDown={isOnTop}
            />
          ))}
        </div>

        <div
          data-testid={isOnTop ? OPPONENT_DECK_ID : PLAYER_DECK_ID}
          style={!isOnTop ? { cursor: 'pointer' } : {}}
          className={styles.faceDownStack}
          onClick={!isOnTop ? () => openBrowseCardsModal('deck') : undefined}
        >
          {deck.map((cardId) => (
            <Card key={cardId} card={cards[cardId]} isSmall isFaceDown />
          ))}
        </div>
      </div>

      <div
        data-testid={isOnTop ? OPPONENT_BOARD_ID : PLAYER_BOARD_ID}
        className={isOnTop ? styles.topPlayerBoard : styles.bottomPlayerBoard}
      >
        {board.map((cardId) => (
          <Card
            onAttackAnimationEnd={onAttackAnimationEnd}
            key={cardId}
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
          <div className={styles.cardBrowserModal}>
            <h1>Browsing your {browsedStack} (randomized)</h1>
            <div className={styles.cardList}>
              {shuffleArray(player[browsedStack]).map((cardId) => (
                <Card key={`${cardId}-browse`} card={cards[cardId]} />
              ))}
            </div>

            <div className={styles.cardBrowseModalFooter}>
              <Link onClick={closeBrowseCardsModal}>{closeMessage}</Link>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}

export default PlayerField
