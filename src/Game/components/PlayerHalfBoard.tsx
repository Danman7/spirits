import { FC, ReactNode, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import Card from 'src/Cards/components/Card'
import styles from 'src/shared/styles/styles.module.css'
import GameButton from 'src/Game/components/GameButton'
import RedrawPhaseModal from 'src/shared/components/ModalVariants/RedrawPhaseModal'
import { GamePhase, Player, PlayerIndex } from 'src/shared/redux/StateTypes'
import { NumberChangeAnimation } from 'src/shared/utils/animations'
import { CardProps, PlayCard } from 'src/Cards/CardTypes'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/Game/constants'
import { compSkipRedraw } from 'src/Game/ComputerPlayerUtils'
import { getLoggedInPlayerId } from 'src/shared/redux/selectors/GameSelectors'

const PlayerHalfBoard: FC<{
  player: Player
  playerIndex: PlayerIndex
  phase: GamePhase
  setOverlayContent: React.Dispatch<React.SetStateAction<ReactNode>>
}> = ({ player, playerIndex, phase, setOverlayContent }) => {
  const {
    id,
    isActive,
    name,
    coins,
    deck,
    hand,
    board,
    discard,
    isReady,
    hasPlayedCardThisTurn,
    isCPU
  } = player

  const dispatch = useAppDispatch()

  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)

  const isPlayerPrespective = loggedInPlayerId === id
  const isOnTop = playerIndex === 0

  const onPlayCard: CardProps['onClickCard'] = (playedCard: PlayCard) => {
    dispatch(GameActions.playCardFromHand({ playedCard, playerIndex }))
  }

  const onRedrawCard: CardProps['onClickCard'] = (card: PlayCard) => {
    dispatch(
      GameActions.putCardAtBottomOfDeck({
        card,
        playerIndex
      })
    )

    dispatch(GameActions.drawCardFromDeck(playerIndex))

    dispatch(GameActions.completeRedraw(playerIndex))
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

  useEffect(() => {
    if (hand.length) {
      if (
        phase === GamePhase.INITIAL_DRAW &&
        hand.length < INITIAL_CARD_DRAW_AMOUNT
      ) {
        setTimeout(() => {
          dispatch(GameActions.drawCardFromDeck(playerIndex))
        }, 500)
      }
    }
  }, [dispatch, hand.length, phase, playerIndex])

  useEffect(() => {
    if (phase === GamePhase.REDRAW && isCPU && !isReady) {
      compSkipRedraw(playerIndex, dispatch)
    }
  }, [dispatch, playerIndex, isCPU, isReady, phase])

  useEffect(() => {
    if (isPlayerPrespective) {
      switch (phase) {
        case GamePhase.REDRAW:
          setOverlayContent(<RedrawPhaseModal playerIndex={playerIndex} />)
          break
      }
    }
  }, [phase, playerIndex, isPlayerPrespective, setOverlayContent])

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

        <motion.div
          className={isOnTop ? styles.topPlayerHand : styles.bottomPlayerHand}
        >
          {hand.map(card => (
            <Card
              key={card.id}
              card={card}
              isFaceDown={isOnTop}
              onClickCard={getOnClickCard()}
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

      {isPlayerPrespective && isActive && <GameButton />}
    </>
  )
}

export default PlayerHalfBoard
