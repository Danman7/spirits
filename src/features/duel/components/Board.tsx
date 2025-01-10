import { clearAllListeners } from '@reduxjs/toolkit'
import { FC, useEffect, useState } from 'react'

import { addAppListener } from 'src/app/listenerMiddleware'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import * as CardEffects from 'src/features/cards/CardEffects'
import { ActionPanel } from 'src/features/duel/components/ActionPanel'
import { PhaseModal } from 'src/features/duel/components/PhaseModal'
import PlayerField from 'src/features/duel/components/PlayerField'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getPhase,
  getPlayers,
} from 'src/features/duel/selectors'
import { drawInitialCardsFromDeck } from 'src/features/duel/slice'
import { getOpponentId, sortDuelPlayers } from 'src/features/duel/utils'
import { getUserId } from 'src/features/user/selector'

let hasAddedCardEffectListeners = false

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const loggedInPlayerId = useAppSelector(getUserId)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)

  const loggedInPlayer = players[loggedInPlayerId]
  const opponent = players[getOpponentId(players, loggedInPlayerId)]
  const isLoggedInPlayerActive = loggedInPlayerId === activePlayerId
  const victoriousPlayerName =
    opponent.coins <= 0
      ? loggedInPlayer.name
      : loggedInPlayer.coins <= 0
        ? opponent.name
        : undefined

  const onPhaseModalCloseEnd = () => {
    if (phase === 'Initial Draw') {
      dispatch(drawInitialCardsFromDeck())
      setIsSidePanelOpen(true)
    }
  }

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
      {sortDuelPlayers(players, loggedInPlayerId).map((player, index) => (
        <PlayerField
          key={player.id}
          player={player}
          isOnTop={!index}
          isActive={player.id === activePlayerId}
          phase={phase}
          attackingAgentId={attackingAgentId}
        />
      ))}

      <PhaseModal
        players={players}
        phase={phase}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
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
