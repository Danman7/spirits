import { FC, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import Card from 'src/Cards/components/Card'
import styles from 'src/shared/styles/styles.module.css'
import GameButton from 'src/Game/components/GameButton'
import { GamePhase, Player } from 'src/shared/redux/StateTypes'
import { NumberChangeAnimation } from 'src/shared/utils/animations'
import { CardProps, PlayCard } from 'src/Cards/CardTypes'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { getLoggedInPlayerId } from 'src/shared/redux/selectors/GameSelectors'

const PlayerHalfBoard: FC<{
  player: Player
  phase: GamePhase
  isOnTop: boolean
}> = ({ player, phase, isOnTop }) => {
  const {
    id,
    isActive,
    name,
    coins,
    cards,
    deck,
    hand,
    board,
    discard,
    isReady,
    hasPlayedCardThisTurn
  } = player

  const dispatch = useAppDispatch()

  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)

  const isPlayerPrespective = loggedInPlayerId === id

  const onPlayCard: CardProps['onClickCard'] = (card: PlayCard) => {
    dispatch(GameActions.playCardFromHand({ card, playerId: id }))
  }

  const onRedrawCard: CardProps['onClickCard'] = (card: PlayCard) => {
    dispatch(
      GameActions.putCardAtBottomOfDeck({
        cardId: card.id,
        playerId: id
      })
    )

    dispatch(GameActions.drawCardFromDeck(id))

    dispatch(GameActions.completeRedraw(id))
  }

  const getOnClickCard = (): CardProps['onClickCard'] => {
    if (
      phase === GamePhase.PLAYER_TURN &&
      isActive &&
      isPlayerPrespective &&
      !hasPlayedCardThisTurn
    ) {
      return onPlayCard
    }

    if (phase === GamePhase.REDRAW && !isReady && isPlayerPrespective) {
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
          {discard.map(cardId => (
            <Card
              key={cardId}
              card={cards[cardId]}
              animate={['small', 'faceDown']}
            />
          ))}
        </div>

        <motion.div
          className={isOnTop ? styles.topPlayerHand : styles.bottomPlayerHand}
        >
          {hand.map(cardId => (
            <Card
              key={cardId}
              card={cards[cardId]}
              onClickCard={getOnClickCard()}
              whileHover={!isOnTop ? { bottom: 170 } : {}}
              animate={[
                getOnClickCard() ? 'active' : 'normal',
                isOnTop ? 'faceDown' : ''
              ]}
            />
          ))}
        </motion.div>

        <div className={styles.faceDownStack}>
          {deck.map(cardId => (
            <Card
              key={cardId}
              card={cards[cardId]}
              animate={['small', 'faceDown']}
            />
          ))}
        </div>
      </div>

      <div
        className={isOnTop ? styles.topPlayerBoard : styles.bottomPlayerBoard}
      >
        {board.map(cardId => (
          <Card key={cardId} card={cards[cardId]} animate={['small']} />
        ))}
      </div>

      {isPlayerPrespective && isActive && <GameButton />}
    </>
  )
}

export default PlayerHalfBoard
