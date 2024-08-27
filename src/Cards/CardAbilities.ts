import {
  BrotherSachelman,
  HammeriteNovice,
  Zombie
} from 'src/Cards/CardPrototypes'
import { CardAbilityFunction, CardType } from 'src/Cards/CardTypes'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { GameState, PlayerState } from 'src/shared/redux/StateTypes'

export const BrotherSachelmanOnPlay: CardAbilityFunction = (
  state: GameState
) => {
  const { players } = state

  state.players = players.map(player => {
    const { board, isActive } = player

    if (!isActive) return player

    return {
      ...player,
      board: board.map(card => {
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
  }) as PlayerState
}

export const HammeriteNoviceOnPlay: CardAbilityFunction = (
  state: GameState
) => {
  const { players } = state

  state.players = players.map(player => {
    const { board, hand, deck, isActive } = player

    if (!isActive) return player

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
  }) as PlayerState
}

export const NecromancerOnPlay: CardAbilityFunction = (state: GameState) => {
  const { players } = state

  state.players = players.map(player => {
    const { board, discard, isActive } = player

    if (!isActive) return player

    const zombiesInDiscard = discard.filter(card => card.name === Zombie.name)

    return {
      ...player,
      discard: discard.filter(card => card.name !== Zombie.name),
      board: [...board, ...zombiesInDiscard]
    }
  }) as PlayerState
}
