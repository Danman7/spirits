import { GameState, Player } from '../Game/GameTypes'
import { CardAbilityFunction, CardType, OnPlayAbilitiesMap } from './CardTypes'
import { BROTHER_SACHELMAN_BOOST } from './constants'
import { ElevatedAcolyte, HammeriteNovice } from './AllCards'
import { CardState } from './CardTypes'
import { getAllCardsOnBoard } from '../Game/GameUtils'

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

export const HammeriteNoviceOnPlay: CardAbilityFunction = (
  state: GameState
) => {
  const { topPlayer, bottomPlayer } = state

  const isHammeriteInPlay = getAllCardsOnBoard(state).filter(card =>
    card.types.includes(CardType.Hammerite)
  )

  const updatePlayer = (player: Player) => {
    if (isHammeriteInPlay) {
      return {
        ...player,
        cards: player.cards.map(card => {
          if (
            (card.state === CardState.InHand ||
              card.state === CardState.InDeck) &&
            card.name === HammeriteNovice.name
          ) {
            return {
              ...card,
              state: CardState.OnBoard
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

export const OnPlayCardAbilitiesMap: OnPlayAbilitiesMap = {
  BrotherSachelmanOnPlay: BrotherSachelmanOnPlay,
  HammeriteNoviceOnPlay: HammeriteNoviceOnPlay
}
