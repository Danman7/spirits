import { FC, useEffect, useMemo, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import { DuelPhase, Player } from 'src/features/duel/types'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getLoggedInPlayerId,
} from 'src/features/duel/selectors'
import {
  completeRedraw,
  drawCardFromDeck,
  initializeEndTurn,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'

import styles from 'src/shared/styles/styles.module.css'
import { NumberChangeAnimation } from 'src/shared/animations'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import { CardProps } from 'src/features/cards/types'
import Card from 'src/features/cards/components/Card'
import {
  MEDIUM_ANIMATION_CYCLE,
  PLAYER_DECK_TEST_ID,
  PLAYER_DISCARD_TEST_ID,
} from '../constants'
import Link from 'src/shared/components/Link'
import Modal from 'src/shared/components/Modal'
import DisplayCard from 'src/features/cards/components/DisplayCard'

type browsedStack = 'deck' | 'discard' | null

const PlayerHalfBoard: FC<{
  player: Player
  phase: DuelPhase
  isOnTop: boolean
}> = ({ player, phase, isOnTop }) => {
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
    isReady,
    hasPlayedCardThisTurn,
  } = player

  const dispatch = useAppDispatch()

  const [browsedStack, setBrowsedStack] = useState<browsedStack>(null)

  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)

  const isPlayerPrespective = loggedInPlayerId === id
  const isActive = activePlayerId === id

  const onPlayCard: CardProps['onClickCard'] = (cardId) => {
    dispatch(playCard({ cardId, playerId: id }))

    setTimeout(() => {
      dispatch(initializeEndTurn())
    }, MEDIUM_ANIMATION_CYCLE)
  }

  const onRedrawCard: CardProps['onClickCard'] = (cardId) => {
    dispatch(
      putCardAtBottomOfDeck({
        cardId,
        playerId: id,
      }),
    )

    dispatch(drawCardFromDeck(id))

    dispatch(completeRedraw(id))
  }

  const getOnClickCard = (): CardProps['onClickCard'] => {
    if (
      phase === 'Player Turn' &&
      isActive &&
      isPlayerPrespective &&
      !hasPlayedCardThisTurn
    ) {
      return onPlayCard
    }

    if (phase === 'Redrawing Phase' && !isReady && isPlayerPrespective) {
      return onRedrawCard
    }

    return undefined
  }

  const closeBrowseCardsModal = () => setBrowsedStack(null)

  const openBrowseCardsModal = (cardList: browsedStack) =>
    setBrowsedStack(cardList)

  const modalContent = useMemo(
    () =>
      browsedStack ? (
        <div className={styles.cardBrowserModal}>
          <h1>Browsing {browsedStack}</h1>
          <div className={styles.cardList}>
            {player[browsedStack].map((cardId) => (
              <DisplayCard key={`${cardId}-browse`} card={cards[cardId]} />
            ))}
          </div>

          <div className={styles.cardBrowseModalFooter}>
            <Link onClick={closeBrowseCardsModal}>Close</Link>
          </div>
        </div>
      ) : null,
    [browsedStack, deck, discard],
  )

  const coinsChangeAnimation = useAnimationControls()

  useEffect(() => {
    coinsChangeAnimation.start(NumberChangeAnimation)
  }, [coins, coinsChangeAnimation])

  return (
    <>
      <h3
        className={`${isOnTop ? styles.topPlayerInfo : styles.bottomPlayerInfo} ${isActive ? styles.activePlayerInfo : ''}`}
      >
        <span>{name}</span> /{' '}
        <motion.span
          className={styles.inlineBlock}
          initial={false}
          animate={coinsChangeAnimation}
        >
          {coins}
        </motion.span>
        {income ? <span> (+{income})</span> : null}
      </h3>

      <div className={isOnTop ? styles.topPlayerSide : styles.bottomPlayerSide}>
        {discard.length ? (
          <div
            data-testid={!isOnTop ? PLAYER_DISCARD_TEST_ID : ''}
            style={!isOnTop ? { cursor: 'pointer' } : {}}
            className={styles.faceDownStack}
            onClick={
              !isOnTop ? () => openBrowseCardsModal('discard') : undefined
            }
          >
            {discard.map((cardId) => (
              <Card key={cardId} card={cards[cardId]} isSmall isFaceDown />
            ))}
          </div>
        ) : null}

        <div
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

        {deck.length ? (
          <div
            data-testid={!isOnTop ? PLAYER_DECK_TEST_ID : ''}
            style={!isOnTop ? { cursor: 'pointer' } : {}}
            className={styles.faceDownStack}
            onClick={!isOnTop ? () => openBrowseCardsModal('deck') : undefined}
          >
            {deck.map((cardId) => (
              <Card key={cardId} card={cards[cardId]} isSmall isFaceDown />
            ))}
          </div>
        ) : null}
      </div>

      <div
        className={isOnTop ? styles.topPlayerBoard : styles.bottomPlayerBoard}
      >
        {board.map((cardId) => (
          <Card
            key={cardId}
            card={cards[cardId]}
            isSmall
            isAttacking={attackingAgentId === cardId}
            isOnTop={isOnTop}
          />
        ))}
      </div>

      <Modal
        style={{
          height: '90vh',
          zIndex: 6,
          padding: '1rem 0 2rem',
        }}
        hasOverlay
      >
        {modalContent}
      </Modal>
    </>
  )
}

export default PlayerHalfBoard
