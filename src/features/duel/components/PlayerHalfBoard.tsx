import { FC, useEffect } from 'react'
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
  playCardFromHand,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'

import styles from 'src/shared/styles/styles.module.css'
import { NumberChangeAnimation } from 'src/shared/animations'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import { CardProps } from 'src/features/cards/types'
import Card from 'src/features/cards/components/Card'
import { MEDIUM_ANIMATION_CYCLE } from '../constants'

const PlayerHalfBoard: FC<{
  player: Player
  phase: DuelPhase
  isOnTop: boolean
}> = ({ player, phase, isOnTop }) => {
  const {
    id,
    name,
    coins,
    cards,
    deck,
    hand,
    board,
    discard,
    isReady,
    hasPlayedCardThisTurn,
  } = player

  const dispatch = useAppDispatch()

  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)

  const isPlayerPrespective = loggedInPlayerId === id
  const isActive = activePlayerId === id

  const onPlayCard: CardProps['onClickCard'] = (cardId) => {
    dispatch(playCardFromHand({ cardId, playerId: id }))

    setTimeout(() => {
      dispatch(initializeEndTurn())
    }, MEDIUM_ANIMATION_CYCLE)
  }

  const onRedrawCard: CardProps['onClickCard'] = (cardId) => {
    dispatch(
      putCardAtBottomOfDeck({
        cardId,
        playerId: id,
        from: 'hand',
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
      </h3>

      <div className={isOnTop ? styles.topPlayerSide : styles.bottomPlayerSide}>
        <div className={styles.faceDownStack}>
          {discard.map((cardId) => (
            <Card key={cardId} card={cards[cardId]} isSmall isFaceDown />
          ))}
        </div>

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

        <div className={styles.faceDownStack}>
          {deck.map((cardId) => (
            <Card key={cardId} card={cards[cardId]} isSmall isFaceDown />
          ))}
        </div>
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
    </>
  )
}

export default PlayerHalfBoard
