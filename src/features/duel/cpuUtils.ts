import { AppDispatch } from 'src/app/store'
import { playCard } from 'src/features/duel/slice'
import { DuelPhase, Player } from 'src/features/duel/types'
import { getPlayableCardIds, getRandomArrayItem } from 'src/shared/utils'

export const isCPUTurn = (
  isPlayerActive: boolean,
  player: Player,
  phase: DuelPhase,
) =>
  !isPlayerActive &&
  player.isCPU &&
  phase === 'Player Turn' &&
  !player.hasPerformedAction

/**
 * A utility method that simulates a CPU player playing its turn. It requires store dispatch to be passed.
 * For now it determines which cards are within budget and plays a random one from them.
 */
export const playCPUTurn = ({
  dispatch,
  player,
}: {
  dispatch: AppDispatch
  player: Player
}) => {
  const playableCardIds = getPlayableCardIds(player)

  if (playableCardIds.length) {
    const cardId = getRandomArrayItem(playableCardIds)

    dispatch(
      playCard({
        cardId,
        playerId: player.id,
      }),
    )
  }
}
