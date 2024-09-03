import { HammeriteNovice, Zombie } from 'src/Cards/CardPrototypes'
import { CardAbilityFunction, CardType } from 'src/Cards/CardTypes'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'

export const BrotherSachelmanOnPlay: CardAbilityFunction = ({
  state,
  playedCard,
  playerIndex
}) => {
  const { players } = state

  players[playerIndex].board.forEach(card => {
    if (
      card.types.includes(CardType.Hammerite) &&
      card.strength < playedCard.strength
    ) {
      card.strength += BROTHER_SACHELMAN_BOOST
    }
  })
}

export const HammeriteNoviceOnPlay: CardAbilityFunction = ({
  state,
  playerIndex
}) => {
  const { players } = state

  if (
    players[playerIndex].board.find(card =>
      card.types.includes(CardType.Hammerite)
    )
  ) {
    const noviceInDeck = players[playerIndex].deck.find(
      card => card.name === HammeriteNovice.name
    )
    const noviceInHand = players[playerIndex].hand.find(
      card => card.name === HammeriteNovice.name
    )

    if (noviceInDeck) {
      players[playerIndex].deck = players[playerIndex].deck.filter(
        card => card.id !== noviceInDeck.id
      )
      players[playerIndex].board = [...players[playerIndex].board, noviceInDeck]
    }

    if (noviceInHand) {
      players[playerIndex].hand = players[playerIndex].hand.filter(
        card => card.id !== noviceInHand.id
      )
      players[playerIndex].board = [...players[playerIndex].board, noviceInHand]
    }
  }
}

export const NecromancerOnPlay: CardAbilityFunction = ({
  state,
  playerIndex
}) => {
  const { players } = state

  const zombiesInDiscard = players[playerIndex].discard.filter(
    card => card.name === Zombie.name
  )

  players[playerIndex].discard = players[playerIndex].discard.filter(
    card => card.name !== Zombie.name
  )

  players[playerIndex].board = [
    ...players[playerIndex].board,
    ...zombiesInDiscard
  ]
}
