import { clearAllListeners } from '@reduxjs/toolkit'
import { FC, useEffect, useState } from 'react'

import { addAppListener } from 'src/app/listenerMiddleware'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import { ActionPanel } from 'src/features/duel/components/ActionPanel'
import { PhaseModal } from 'src/features/duel/components/PhaseModal'
import PlayerField from 'src/features/duel/components/PlayerField'
import { isCPUTurn, playCPUTurn } from 'src/features/duel/cpuUtils'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getLoggedInPlayerId,
  getPhase,
  getPlayerOrder,
  getPlayers,
} from 'src/features/duel/selectors'
import { startInitialCardDraw } from 'src/features/duel/slice'

let hasAddedCardEffectListeners = false

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)
  const phase = useAppSelector(getPhase)
  const loggedInPlayerId = useAppSelector(getLoggedInPlayerId)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)

  const haveBothPlayersNotPerformedAction = Object.values(players).every(
    ({ hasPerformedAction }) => !hasPerformedAction,
  )
  const loggedInPlayer = players[loggedInPlayerId]
  const opponent = players[playerOrder[0]]
  const isLoggedInPlayerActive = loggedInPlayerId === activePlayerId
  const victoriousPlayerName =
    opponent.coins <= 0
      ? loggedInPlayer.name
      : loggedInPlayer.coins <= 0
        ? opponent.name
        : undefined

  const onPhaseModalCloseEnd = () => {
    if (phase === 'Pre-duel') {
      dispatch(startInitialCardDraw())
      setIsSidePanelOpen(true)
    }
    if (phase === 'Player Turn') {
      setIsSidePanelOpen(true)
    }
    if (isCPUTurn(isLoggedInPlayerActive, opponent, phase)) {
      playCPUTurn({
        dispatch,
        player: opponent,
      })
    }
  }

  useEffect(() => {
    if (
      phase === 'Player Turn' &&
      (haveBothPlayersNotPerformedAction || loggedInPlayer.hasPerformedAction)
    ) {
      setIsSidePanelOpen(false)
    }
  }, [phase, loggedInPlayer, haveBothPlayersNotPerformedAction])

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
    <>
      {playerOrder.map((playerId, index) => (
        <PlayerField
          key={playerId}
          player={players[playerId]}
          isOnTop={!index}
          isActive={playerId === activePlayerId}
          phase={phase}
          attackingAgentId={attackingAgentId}
        />
      ))}

      <PhaseModal
        players={players}
        phase={phase}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
        haveBothPlayersNotPerformedAction={haveBothPlayersNotPerformedAction}
        victoriousPlayerName={victoriousPlayerName}
        onPhaseModalCloseEnd={onPhaseModalCloseEnd}
      />

      <ActionPanel
        isOpen={isSidePanelOpen}
        loggedInPlayer={loggedInPlayer}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
        phase={phase}
      />
    </>
  )
}

export default Board
