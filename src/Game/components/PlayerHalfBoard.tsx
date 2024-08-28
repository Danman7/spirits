import { FC, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import Card from 'src/Cards/components/Card'
import styles from 'src/shared/styles/styles.module.css'
import { GamePhase, Player } from 'src/shared/redux/StateTypes'
import { NumberChangeAnimation } from 'src/shared/utils/animations'
import { CardProps } from 'src/Cards/CardTypes'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import { getPhase } from 'src/shared/redux/selectors/GameSelectors'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/Game/constants'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'

const PlayerHalfBoard: FC<{
  player: Player
  isOnTop?: boolean
  onClickCard?: CardProps['onClickCard']
}> = ({ player, isOnTop, onClickCard }) => {
  const { id, isActive, name, coins, deck, hand, board, discard } = player

  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)

  const coinsChangeAnimation = useAnimationControls()

  useEffect(() => {
    coinsChangeAnimation.start(NumberChangeAnimation)
  }, [coins, coinsChangeAnimation])

  useEffect(() => {
    if (
      phase === GamePhase.INITIAL_DRAW &&
      hand.length < INITIAL_CARD_DRAW_AMOUNT
    ) {
      dispatch(GameActions.drawCardFromDeck(id))
    } else if (
      phase === GamePhase.INITIAL_DRAW &&
      hand.length === INITIAL_CARD_DRAW_AMOUNT
    ) {
      dispatch(GameActions.startRedraw())
    }
  }, [phase, hand.length, dispatch, id])

  return (
    <div>
      <div
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
      </div>

      <div className={isOnTop ? styles.topPlayerSide : styles.bottomPlayerSide}>
        <div className={styles.faceDownStack}>
          {discard.map(card => (
            <Card key={card.id} card={card} isFaceDown isSmaller />
          ))}
        </div>

        <motion.div
          className={isOnTop ? styles.playerHand : styles.bottomPlayerHand}
        >
          {hand.map(card => (
            <Card
              key={card.id}
              card={card}
              isFaceDown={isOnTop}
              onClickCard={onClickCard}
            />
          ))}
        </motion.div>

        <div className={styles.faceDownStack}>
          {deck.map(card => (
            <Card key={card.id} card={card} isFaceDown isSmaller />
          ))}
        </div>
      </div>

      <div
        className={isOnTop ? styles.topPlayerBoard : styles.bottomPlayerBoard}
      >
        {board.map(card => (
          <Card key={card.id} card={card} isSmaller />
        ))}
      </div>
    </div>
  )
}

export default PlayerHalfBoard
