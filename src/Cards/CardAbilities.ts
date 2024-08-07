import { GameState, Player } from 'src/Game/types'
import { CardAbilityFunction, CardType, OnPlayAbilitiesMap } from './types'
import { ELEVATED_ACOLYTE_BOOST } from './constants'
import { ElevatedAcolyte } from './AllCards'

export const ElevatedAcolyteOnPlay: CardAbilityFunction = (
  state: GameState
) => {
  const { activePlayerId, topPlayer, bottomPlayer } = state

  const updatePlayer = (player: Player) => {
    if (player.id === activePlayerId) {
      return {
        ...player,
        field: player.field.map(card => {
          if (
            card.types.includes(CardType.Hammerite) &&
            card.strength &&
            ElevatedAcolyte.strength &&
            card.strength < ElevatedAcolyte.strength
          ) {
            return {
              ...card,
              strength: card.strength + ELEVATED_ACOLYTE_BOOST
            }
          }

          return card
        })
      }
    }

    return player
  }

  return {
    ...state,
    topPlayer: updatePlayer(topPlayer),
    bottomPlayer: updatePlayer(bottomPlayer)
  }
}

export const OnPlayCardAbilitiesMap: OnPlayAbilitiesMap = {
  ElevatedAcolyteOnPlay: ElevatedAcolyteOnPlay
}
