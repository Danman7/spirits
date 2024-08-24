import { FC, useCallback, useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import styles from '../../styles.module.css'

import * as Animations from '../../utils/animations'

import {
  getActivePlayerId,
  getTopPlayer,
  getBottomPlayer,
  getGameTurn,
  getIsCardPlayedThisTurn
} from '../GameSelectors'
import { GameActions } from '../GameSlice'
import { Overlay } from './Overlay'
import { useAppDispatch, useAppSelector } from '../../state'
import { endTurnMessage, passButtonMessage } from '../messages'
import { compPlayTurn } from '../ComputerPlayerUtils'
import { CardProps, PlayCard } from '../../Cards/CardTypes'
import { Card } from '../../Cards/components/Card'

export const Board: FC = () => {
  const dispatch = useAppDispatch()

  const [shouldShowOverlay, setShouldShowOverlay] = useState(false)

  const topCoinsAnimation = useAnimationControls()
  const bottomCoinsAnimation = useAnimationControls()

  const topPlayer = useAppSelector(getTopPlayer)
  const bottomPlayer = useAppSelector(getBottomPlayer)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const turn = useAppSelector(getGameTurn)
  const isCardPlayedThisTurn = useAppSelector(getIsCardPlayedThisTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId

  const onPlayCard: CardProps['onClickCard'] = useCallback(
    (card: PlayCard) => {
      dispatch(GameActions.playCard(card))
    },
    [dispatch]
  )

  const onEndTurn = useCallback(() => {
    dispatch(GameActions.endTurn())
  }, [dispatch])

  useEffect(() => {
    setShouldShowOverlay(true)
  }, [turn])

  const onAnimationComplete = () => {
    setShouldShowOverlay(false)

    if (topPlayer.isNonHuman && activePlayerId === topPlayer.id) {
      compPlayTurn(topPlayer, onPlayCard, onEndTurn)
    }
  }

  useEffect(() => {
    topCoinsAnimation.start(Animations.numberChange)
  }, [topCoinsAnimation, topPlayer.coins])

  useEffect(() => {
    bottomCoinsAnimation.start(Animations.numberChange)
  }, [bottomCoinsAnimation, bottomPlayer.coins])

  return (
    <div className={styles.board}>
      <div
        className={`${styles.topPlayerInfo} ${!isPlayerTurn ? styles.activePlayerInfo : ''}`}
      >
        <span>{topPlayer?.name}</span> /{' '}
        <motion.span className={styles.inlineBlock}>
          {topPlayer?.coins}
        </motion.span>
      </div>

      <div className={styles.topPlayerSide}>
        <div className={styles.faceDownStack}>
          {topPlayer.discard.map(card => (
            <Card key={card.id} card={card} isFaceDown isSmaller />
          ))}
        </div>

        <div className={styles.playerHand}>
          {topPlayer.hand.map(card => (
            <Card key={card.id} card={card} isFaceDown />
          ))}
        </div>

        <div className={styles.faceDownStack}>
          {topPlayer.deck.map(card => (
            <Card key={card.id} card={card} isFaceDown isSmaller />
          ))}
        </div>
      </div>

      <div className={styles.topPlayerBoard}>
        {topPlayer.board.map(card => (
          <Card key={card.id} card={card} isSmaller />
        ))}
      </div>

      <div className={styles.bottomPlayerBoard}>
        {bottomPlayer.board.map(card => (
          <Card key={card.id} card={card} isSmaller />
        ))}
      </div>

      <div className={styles.bottomPlayerSide}>
        <div className={styles.faceDownStack}>
          {bottomPlayer.discard.map(card => (
            <Card key={card.id} card={card} isFaceDown isSmaller />
          ))}
        </div>

        <div className={styles.bottomPlayerHand}>
          {bottomPlayer.hand.map(card => (
            <Card
              key={card.id}
              card={card}
              isActive={
                card.cost <= bottomPlayer.coins &&
                isPlayerTurn &&
                !isCardPlayedThisTurn
              }
              onClickCard={
                isPlayerTurn && !isCardPlayedThisTurn ? onPlayCard : undefined
              }
            />
          ))}
        </div>

        <div className={styles.faceDownStack}>
          {bottomPlayer.deck.map(card => (
            <Card key={card.id} card={card} isFaceDown isSmaller />
          ))}
        </div>
      </div>

      <div
        className={`${styles.bottomPlayerInfo} ${isPlayerTurn ? styles.activePlayerInfo : ''}`}
      >
        <span>{bottomPlayer?.name}</span> /{' '}
        <motion.span
          animate={bottomCoinsAnimation}
          className={styles.inlineBlock}
        >
          {bottomPlayer?.coins}
        </motion.span>
      </div>

      {shouldShowOverlay && (
        <Overlay onAnimationComplete={onAnimationComplete} />
      )}

      {isPlayerTurn && (
        <button className={styles.endTurnButton} onClick={onEndTurn}>
          {isCardPlayedThisTurn ? endTurnMessage : passButtonMessage}
        </button>
      )}
    </div>
  )
}
