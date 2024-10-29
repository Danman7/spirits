import { clearAllListeners } from '@reduxjs/toolkit'
import { FC, ReactNode, useEffect, useState } from 'react'
import { addAppListener } from 'src/app/listenerMiddleware'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import InitialPhaseModal from 'src/features/duel/components/modals/InitialPhaseModal'
import PlayerTurnModal from 'src/features/duel/components/modals/PlayerTurnModal'
import RedrawPhaseModal from 'src/features/duel/components/modals/RedrawPhaseModal'
import VictoryModal from 'src/features/duel/components/modals/VictoryModal'
import PlayerHalfBoard from 'src/features/duel/components/PlayerHalfBoard'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'
import {
  getHasAddedCardEffectListeners,
  getPhase,
  getPlayerOrder,
  getPlayers,
  getTurn,
  getVictoriousPlayerName,
} from 'src/features/duel/selectors'
import {
  beginPlay,
  setHasAddedCardEffectListeners,
  startRedraw,
} from 'src/features/duel/slice'
import Modal from 'src/shared/components/Modal'
import * as styles from 'src/shared/styles/styles.module.css'

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)
  const phase = useAppSelector(getPhase)
  const turn = useAppSelector(getTurn)
  const victorName = useAppSelector(getVictoriousPlayerName)
  const hasAddedCardEffectListeners = useAppSelector(
    getHasAddedCardEffectListeners,
  )

  const victoryModalContent: ReactNode = victorName ? (
    <VictoryModal victorName={victorName} />
  ) : null

  const [gameModalContent, setGameModalContent] = useState<ReactNode>(null)

  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        setGameModalContent(<InitialPhaseModal />)
        break

      case 'Player Turn':
        setGameModalContent(<PlayerTurnModal />)
        break

      case 'Redrawing Phase':
        setGameModalContent(<RedrawPhaseModal />)
        break
    }
  }, [phase, turn, playerOrder])

  useEffect(() => {
    if (
      phase === 'Initial Draw' &&
      Object.values(players).every(
        ({ hand }) => hand.length === INITIAL_CARD_DRAW_AMOUNT,
      )
    ) {
      dispatch(startRedraw())
    }
  }, [dispatch, phase, players])

  useEffect(() => {
    if (
      phase === 'Redrawing Phase' &&
      Object.values(players).every(
        ({ hasPerformedAction }) => !!hasPerformedAction,
      )
    ) {
      dispatch(beginPlay())
    }
  }, [dispatch, phase, players])

  useEffect(() => {
    if (!hasAddedCardEffectListeners) {
      console.log('add listeners')
      dispatch(clearAllListeners())
      dispatch(setHasAddedCardEffectListeners(true))

      const addedListeners: string[] = []

      Object.values(players).forEach(({ cards }) =>
        Object.keys(cards).forEach((cardId) => {
          const { trigger, name } = cards[cardId]

          if (trigger && !addedListeners.includes(name)) {
            const { predicate, effect } = trigger

            dispatch(
              addAppListener({
                predicate: CardEffectPredicates[predicate],
                effect: CardEffects[effect],
              }),
            )

            addedListeners.push(name)
          }
        }),
      )
    }
  }, [dispatch, players, hasAddedCardEffectListeners])

  return (
    <div className={styles.board}>
      {playerOrder.map((playerId, index) => (
        <PlayerHalfBoard
          key={playerId}
          player={players[playerId]}
          phase={phase}
          isOnTop={!index}
        />
      ))}

      <Modal
        style={{ left: '1em', transform: 'translate(0, -50%)', zIndex: 3 }}
      >
        {gameModalContent}
      </Modal>

      <Modal hasOverlay style={{ zIndex: 5 }}>
        {victoryModalContent}
      </Modal>
    </div>
  )
}

export default Board
