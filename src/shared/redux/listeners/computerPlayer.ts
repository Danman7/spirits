import { PlayCard } from 'src/Cards/CardTypes'
import { LONG_ANIMATION_CYCLE, SHORT_ANIMATION_CYCLE } from 'src/Game/constants'
import { getPlayableCards } from 'src/Game/GameUtils'
import { startAppListening } from 'src/shared/redux/middleware'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { GamePhase, PlayerIndex } from 'src/shared/redux/StateTypes'
import { getRandomArrayItem } from 'src/shared/utils/utils'

// Handle CPU skipping redraw
startAppListening({
  actionCreator: GameActions.startRedraw,
  effect: async (_, listenerApi) => {
    const {
      players: [Player1, Player2],
      phase
    } = listenerApi.getState().game

    const computerPlayer = Player1.isCPU
      ? Player1
      : Player2.isCPU
        ? Player2
        : null

    if (computerPlayer) {
      const playerIndex: PlayerIndex = Player1.isCPU ? 0 : 1

      if (phase === GamePhase.REDRAW && !computerPlayer.isReady) {
        listenerApi.dispatch(GameActions.completeRedraw(playerIndex))
      }
    }
  }
})

// Handle computer playing turn
startAppListening({
  actionCreator: GameActions.endTurn,
  effect: async (_, listenerApi) => {
    const {
      players: [Player1, Player2],
      phase
    } = listenerApi.getState().game

    const computerPlayer = Player1.isCPU
      ? Player1
      : Player2.isCPU
        ? Player2
        : null

    if (
      computerPlayer &&
      computerPlayer.isActive &&
      phase === GamePhase.PLAYER_TURN
    ) {
      const playerIndex: PlayerIndex = Player1.isCPU ? 0 : 1

      // Play random card for now
      const playableCards = getPlayableCards(computerPlayer)

      if (playableCards.length) {
        const randomCard = getRandomArrayItem(playableCards) as PlayCard

        setTimeout(() => {
          listenerApi.dispatch(
            GameActions.playCardFromHand({
              playedCard: randomCard,
              playerIndex
            })
          )
        }, LONG_ANIMATION_CYCLE + SHORT_ANIMATION_CYCLE)

        setTimeout(() => {
          listenerApi.dispatch(GameActions.endTurn())
        }, LONG_ANIMATION_CYCLE * 2)
      }
    }
  }
})
