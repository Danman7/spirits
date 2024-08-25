import {
  BrotherSachelman,
  HammeriteNovice,
  Zombie
} from 'src/Cards/CardPrototypes'
import { CardAbilityFunction, CardType } from 'src/Cards/CardTypes'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { GameState, Player } from 'src/Game/GameTypes'

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

export const NecromancerOnPlay: CardAbilityFunction = (state: GameState) => {
  const { activePlayerId, topPlayer, bottomPlayer } = state

  const updatePlayer = (player: Player): Player => {
    const { discard, board, id } = player

    const zombiesInDiscard = discard.filter(card => card.name === Zombie.name)

    if (id === activePlayerId && zombiesInDiscard) {
      return {
        ...player,
        discard: discard.filter(card => card.name !== Zombie.name),
        board: [...board, ...zombiesInDiscard]
      }
    }

    return player
  }

  state.topPlayer = updatePlayer(topPlayer)
  state.bottomPlayer = updatePlayer(bottomPlayer)
}
