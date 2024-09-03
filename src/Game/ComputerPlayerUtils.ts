import { AppDispatch, Player, PlayerIndex } from 'src/shared/redux/StateTypes'
import { getPlayableCards } from 'src/Game/GameUtils'
import { getRandomArrayItem } from 'src/shared/utils/utils'
import { PlayCard } from 'src/Cards/CardTypes'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'

export const compPlayRandomCard = (
  player: Player,
  playerIndex: PlayerIndex,
  dispatch: AppDispatch
) => {
  // check for which cards there is a budget
  const playableCards = getPlayableCards(player)

  if (playableCards.length) {
    const randomCard = getRandomArrayItem(playableCards) as PlayCard

    dispatch(
      GameActions.playCardFromHand({
        playedCard: randomCard,
        playerIndex
      })
    )
  }
}

export const compPlayTurn = (
  player: Player,
  playerIndex: PlayerIndex,
  dispatch: AppDispatch
) => {
  // for now only play a random card
  compPlayRandomCard(player, playerIndex, dispatch)

  dispatch(GameActions.endTurn())
}

export const compSkipRedraw = (
  playerIndex: PlayerIndex,
  dispatch: AppDispatch
) => {
  dispatch(GameActions.completeRedraw(playerIndex))
}
