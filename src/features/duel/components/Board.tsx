import { clearAllListeners } from '@reduxjs/toolkit'
import { FC, useEffect } from 'react'

import { addAppListener } from 'src/app/listenerMiddleware'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import DuelModals from 'src/features/duel/components/DuelModals'
import PlayerField from 'src/features/duel/components/PlayerField'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getLoggedInPlayerId,
  getPhase,
  getPlayerNames,
  getPlayerOrder,
  getPlayers,
  getTurn,
  getVictoriousPlayerName,
} from 'src/features/duel/selectors'
import * as styles from 'src/shared/styles/styles.module.css'

let hasAddedCardEffectListeners = false

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)
  const phase = useAppSelector(getPhase)
  const turn = useAppSelector(getTurn)
  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)
  const victorName = useAppSelector(getVictoriousPlayerName)
  const playerNames = useAppSelector(getPlayerNames)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const activePlayerId = useAppSelector(getActivePlayerId)

  const player = players[loggedInPlayerId]
  const opponent = players[playerOrder[0]]

  // This adds all store listeners for card effect triggers.
  // It plugs into the redux middleware and cannot be done in the slice.
  useEffect(() => {
    if (!hasAddedCardEffectListeners) {
      hasAddedCardEffectListeners = true
      dispatch(clearAllListeners())

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
  }, [dispatch, players])

  return (
    <div className={styles.board}>
      {playerOrder.map((playerId, index) => (
        <PlayerField
          key={playerId}
          player={players[playerId]}
          phase={phase}
          isOnTop={!index}
          isActive={playerId === activePlayerId}
          attackingAgentId={attackingAgentId}
        />
      ))}

      <DuelModals
        player={player}
        opponent={opponent}
        isPlayerActive={player.id === activePlayerId}
        turn={turn}
        phase={phase}
        victorName={victorName}
        playerNames={playerNames}
      />
    </div>
  )
}

export default Board
