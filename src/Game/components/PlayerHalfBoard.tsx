import { FC, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import Card from 'src/Cards/components/Card'
import styles from 'src/shared/styles/styles.module.css'
import { Player } from 'src/shared/redux/StateTypes'
import { NumberChangeAnimation } from 'src/shared/utils/animations'
import { CardProps } from 'src/Cards/CardTypes'

const PlayerHalfBoard: FC<{
  player: Player
  isOnTop?: boolean
  onClickCard?: CardProps['onClickCard']
}> = ({ player, isOnTop, onClickCard }) => {
  const { isActive, name, coins, deck, hand, board, discard } = player

  const coinsChangeAnimation = useAnimationControls()

  useEffect(() => {
    coinsChangeAnimation.start(NumberChangeAnimation)
  }, [coins, coinsChangeAnimation])

  return (
    <>
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

        <div className={isOnTop ? styles.playerHand : styles.bottomPlayerHand}>
          {hand.map(card => (
            <Card
              key={card.id}
              card={card}
              isFaceDown={isOnTop}
              onClickCard={onClickCard}
            />
          ))}
        </div>

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
    </>
  )
}

export default PlayerHalfBoard
