import { CARD_STACKS } from 'src/modules/duel/duel.constants'
import type {
  DuelPlayers,
  Player,
  PlayerStacks,
} from 'src/modules/duel/duel.types'
import type { CardStack, DuelCards, DuelState } from 'src/modules/duel/state'

import { CardBases, CardBaseKey } from 'src/shared/modules/cards'
import { generateUUID } from 'src/shared/shared.utils'

export const getPlayableCardIds = (player: Player, cards: DuelCards) =>
  player.hand.filter((cardId) => cards[cardId].cost <= player.coins)

type NormalizedPlayers = Record<
  string,
  Partial<Record<CardStack, CardBaseKey[]>>
>

export const normalizeStateCards = (
  state: DuelState,
  players: NormalizedPlayers,
): DuelState => {
  const updatedPlayers = { ...state.players }
  const cards = { ...state.cards }

  Object.entries(players).forEach(([playerId, stacks]) => {
    const { deck, hand, discard, board } = state.players[playerId]
    const statePlayerStacks = [...deck, ...hand, ...discard, ...board]

    statePlayerStacks.forEach((cardId) => {
      delete cards[cardId]
    })

    const playerStacks: PlayerStacks = {
      deck: [],
      hand: [],
      board: [],
      discard: [],
    }

    CARD_STACKS.forEach((stack) => {
      const cardKeys = stacks[stack]
      if (!cardKeys) return

      cardKeys.forEach((CardBaseKey) => {
        const cardId = generateUUID()
        cards[cardId] = { id: cardId, ...CardBases[CardBaseKey] }
        playerStacks[stack].push(cardId)
      })
    })

    updatedPlayers[playerId] = { ...updatedPlayers[playerId], ...playerStacks }
  })

  return { ...state, players: updatedPlayers, cards }
}

export const sortPlayerIdsForBoard = (
  players: DuelPlayers,
  loggedInPlayerId: string,
) =>
  Object.values(players)
    .sort(
      (playerA, playerB) =>
        Number(playerA.id === loggedInPlayerId) -
        Number(playerB.id === loggedInPlayerId),
    )
    .map(({ id }) => id) as [string, string]

export const getOtherPlayer = (
  players: DuelPlayers,
  playerOrder: [string, string],
  playerId: string,
) => {
  const otherId = playerOrder[0] === playerId ? playerOrder[1] : playerOrder[0]
  return players[otherId]
}
