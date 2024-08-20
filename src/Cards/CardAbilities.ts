import { GameState, Player } from '../Game/GameTypes'
import { CardAbilityFunction, CardType, OnPlayAbilitiesMap } from './CardTypes'
import { BROTHER_SACHELMAN_BOOST } from './constants'
import { BrotherSachelman, HammeriteNovice } from './AllCards'

export const BrotherSachelmanOnPlay: CardAbilityFunction = (
  state: GameState
) => {
  const { activePlayerId, topPlayer, bottomPlayer } = state

  const updatePlayer = (player: Player): Player => {
    if (player.id === activePlayerId) {
      return {
        ...player,
        board: player.board.map(card => {
          if (
            card.types.includes(CardType.Hammerite) &&
            card.strength &&
            BrotherSachelman.strength &&
            card.strength < BrotherSachelman.strength
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

  const updatePlayer = (player: Player): Player => {
    const { board, hand, deck } = player

    if (board.find(card => card.types.includes(CardType.Hammerite))) {
      const noviceInDeck = deck.find(card => card.name === HammeriteNovice.name)
      const noviceInHand = hand.find(card => card.name === HammeriteNovice.name)

      if (noviceInDeck) {
        player.deck = deck.filter(card => card.id !== noviceInDeck.id)
        player.board = [...board, noviceInDeck]
      }

      if (noviceInHand) {
        player.hand = hand.filter(card => card.id !== noviceInHand.id)
        player.board = [...board, noviceInHand]
        // TODO: also draw a card once drawing logic is in
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
