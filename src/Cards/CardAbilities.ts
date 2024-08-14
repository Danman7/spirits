import { GameState, Player } from '../Game/types'
import { CardAbilityFunction, CardType, OnPlayAbilitiesMap } from './types'
import { BROTHER_SACHELMAN_BOOST } from './constants'
import { ElevatedAcolyte } from './AllCards'
import { CardState } from './components/types'

export const BrotherSachelmanOnPlay: CardAbilityFunction = (
  state: GameState
) => {
  const { activePlayerId, topPlayer, bottomPlayer } = state

  const updatePlayer = (player: Player) => {
    if (player.id === activePlayerId) {
      return {
        ...player,
        cards: player.cards.map(card => {
          if (
            card.state === CardState.OnBoard &&
            card.types.includes(CardType.Hammerite) &&
            card.strength &&
            ElevatedAcolyte.strength &&
            card.strength < ElevatedAcolyte.strength
          ) {
            return {
              ...card,
              strength: card.strength + BROTHER_SACHELMAN_BOOST
            }
          }

          return card
        })
      }
    }

    return player
  }

  state.topPlayer = updatePlayer(topPlayer)
  state.bottomPlayer = updatePlayer(bottomPlayer)
}

// export const HammeriteNoviceOnPlay: CardAbilityFunction = (
//   state: GameState
// ) => {
//   const { topPlayer, bottomPlayer } = state

//   const isHammeriteInPlay = getAllCardsOnBoard(state).filter(card =>
//     card.types.includes(CardType.Hammerite)
//   )

//   const updatePlayer = (player: Player) => {
//     if (isHammeriteInPlay) {
//       const noviceInHand = player.hand.find(
//         card => card.name === HammeriteNovice.name
//       )

//       if (noviceInHand) {
//         return player
//       }
//     }

//     return player
//   }

//   state.topPlayer = updatePlayer(topPlayer)
//   state.bottomPlayer = updatePlayer(bottomPlayer)
// }

export const OnPlayCardAbilitiesMap: OnPlayAbilitiesMap = {
  BrotherSachelmanOnPlay: BrotherSachelmanOnPlay
}
