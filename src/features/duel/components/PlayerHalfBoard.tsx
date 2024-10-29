import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { FC, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import Card from 'src/features/cards/components/Card'
import { CardProps } from 'src/features/cards/types'
import {
  INITIAL_CARD_DRAW_AMOUNT,
  PLAYER_DECK_TEST_ID,
  PLAYER_DISCARD_TEST_ID,
} from 'src/features/duel/constants'
import {
  getActivePlayerId,
  getAttackingAgentId,
} from 'src/features/duel/selectors'
import {
  completeRedraw,
  drawCardFromDeck,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import { DuelPhase, Player } from 'src/features/duel/types'
import { getPlayableCardIds } from 'src/features/duel/utils'
import { NumberChangeAnimation } from 'src/shared/animations'
import Link from 'src/shared/components/Link'
import Modal from 'src/shared/components/Modal'
import styles from 'src/shared/styles/styles.module.css'
import { getRandomArrayItem } from 'src/shared/utils'

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
    hasPerformedAction,
    isCPU,
  } = player

  const dispatch = useAppDispatch()

  const [browsedStack, setBrowsedStack] = useState<browsedStack>(null)

  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)

  const isActive = activePlayerId === id

  const onPlayCard: CardProps['onClickCard'] = (cardId) => {
    dispatch(playCard({ cardId, playerId: id }))
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
            <Link onClick={closeBrowseCardsModal}>Close</Link>
          </div>
        </div>
      ) : null,
    [browsedStack, cards, player],
  )

  const coinsChangeAnimation = useAnimationControls()

  useEffect(() => {
    coinsChangeAnimation.start(NumberChangeAnimation)
  }, [coins, coinsChangeAnimation])

  useEffect(() => {
    if (phase === 'Initial Draw' && hand.length < INITIAL_CARD_DRAW_AMOUNT) {
      dispatch(drawCardFromDeck(id))
    }
  }, [dispatch, id, phase, hand.length])

  useEffect(() => {
    if (phase === 'Redrawing Phase' && isCPU && !hasPerformedAction) {
      dispatch(completeRedraw(id))
    }
  }, [dispatch, id, hasPerformedAction, isCPU, phase])

  useEffect(() => {
    if (isCPU && isActive && phase === 'Player Turn') {
      // Play random card for now
      const playableCardIds = getPlayableCardIds(player)

      if (playableCardIds.length) {
        const cardId = getRandomArrayItem(playableCardIds)

        dispatch(
          playCard({
            cardId,
            playerId: id,
          }),
        )
      }
    }
  }, [dispatch, id, isActive, isCPU, phase, player])

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
            data-testid={!isOnTop ? PLAYER_DECK_TEST_ID : ''}
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
        className={isOnTop ? styles.topPlayerBoard : styles.bottomPlayerBoard}
      >
        <AnimatePresence>
          {board.map((cardId) => (
            <Card
              layout
              layoutId={cardId}
              key={`${cardId}-board`}
              card={cards[cardId]}
              isSmall
              isAttacking={attackingAgentId === cardId}
              isOnTop={isOnTop}
              exit={{ opacity: 0 }}
            />
          ))}
        </AnimatePresence>
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
