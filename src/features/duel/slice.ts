import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayCard } from 'src/features/cards/types'
import {
  drawCardFromDeckTransformer,
  moveCardToBoardTransformer,
} from 'src/features/duel/transformers'
import {
  AgentAttacksAgentAction,
  AgentAttacksPlayerAction,
  DuelPhase,
  DuelState,
  Player,
  PlayerCardAction,
} from 'src/features/duel/types'
import { getRandomArrayItem, shuffleArray } from 'src/shared/utils'

export const initialState: DuelState = {
  turn: 0,
  phase: 'Pre-duel',
  players: {},
  playerOrder: [],
  loggedInPlayerId: '',
  attackingAgentId: '',
  activePlayerId: '',
}

export const duelSlice = createSlice({
  name: 'duel',
  initialState,
  reducers: {
    initializeDuel: (
      state,
      action: PayloadAction<{
        players: Player[]
        loggedInPlayerId?: Player['id']
        firstPlayerId?: Player['id']
        phase?: DuelPhase
      }>,
    ) => {
      const { players, firstPlayerId, loggedInPlayerId, phase } = action.payload

      let startingPlayerId: Player['id']

      if (firstPlayerId) {
        const playerFromProp = players.find(({ id }) => id === firstPlayerId)

        if (playerFromProp) {
          startingPlayerId = playerFromProp.id
        } else {
          throw new Error(
            'The firstPlayerId prop does not match any of the player ids passed to initialize.',
          )
        }
      } else {
        startingPlayerId = getRandomArrayItem(players).id
      }

      state.activePlayerId = startingPlayerId

      state.players = players.reduce(
        (statePlayers: DuelState['players'], player) => {
          statePlayers[player.id] = {
            ...player,
            deck: shuffleArray(player.deck),
          }

          return statePlayers
        },
        {},
      )

      state.playerOrder = players
        .sort(
          (playerA, playerB) =>
            Number(playerA.id === loggedInPlayerId) -
            Number(playerB.id === loggedInPlayerId),
        )
        .map(({ id }) => id)

      state.phase = phase || 'Initial Draw'

      if (loggedInPlayerId) {
        state.loggedInPlayerId = loggedInPlayerId
      }
    },
    drawCardFromDeck: (state, action: PayloadAction<Player['id']>) => {
      drawCardFromDeckTransformer(state, action)
    },
    startRedraw: (state) => {
      const { playerOrder } = state

      state.phase = 'Redrawing Phase'

      state.players[playerOrder[0]].hasPerformedAction = false
      state.players[playerOrder[1]].hasPerformedAction = false
    },
    putCardAtBottomOfDeck: (state, action: PlayerCardAction) => {
      const { cardId: movedCardId, playerId } = action.payload

      const { players } = state

      players[playerId].board = players[playerId].board.filter(
        (cardId) => cardId !== movedCardId,
      )
      players[playerId].hand = players[playerId].hand.filter(
        (cardId) => cardId !== movedCardId,
      )
      players[playerId].discard = players[playerId].discard.filter(
        (cardId) => cardId !== movedCardId,
      )

      players[playerId].deck.push(movedCardId)
    },
    completeRedraw: (state, action: PayloadAction<Player['id']>) => {
      const { players } = state

      players[action.payload].hasPerformedAction = true
    },
    beginPlay: (state) => {
      state.phase = 'Player Turn'
      state.turn = 1
    },
    initializeEndTurn: (state) => {
      const { activePlayerId } = state

      state.phase = 'Resolving end of turn'

      const activePlayer = state.players[activePlayerId]

      state.attackingAgentId = activePlayer.board[0] || ''
    },
    agentAttacksAgent: (state, action: AgentAttacksAgentAction) => {
      const { defendingCardId, defendingPlayerId } = action.payload

      const { players } = state

      players[defendingPlayerId].cards[defendingCardId].strength -= 1
    },
    agentAttacksPlayer: (state, action: AgentAttacksPlayerAction) => {
      const { defendingPlayerId } = action.payload

      const { players } = state

      players[defendingPlayerId].coins -= 1
    },
    moveToNextAttacker: (state, action: PayloadAction<PlayCard['id']>) => {
      state.attackingAgentId = action.payload
    },
    endTurn: (state) => {
      state.turn += 1
      state.phase = 'Player Turn'
      state.attackingAgentId = initialState.attackingAgentId

      state.activePlayerId =
        state.playerOrder[0] === state.activePlayerId
          ? state.playerOrder[1]
          : state.playerOrder[0]

      state.playerOrder.forEach((playerId) => {
        const player = state.players[playerId]

        state.players[playerId].hasPerformedAction = false

        if (player.income) {
          state.players[playerId].coins += 1
          state.players[playerId].income -= 1
        }
      })
    },
    playCard: (state, action: PlayerCardAction) => {
      const { cardId: playedCardId, playerId } = action.payload
      const { players } = state

      moveCardToBoardTransformer(state, action)

      const playedCard = players[playerId].cards[playedCardId]

      players[playerId].coins = players[playerId].coins - playedCard.cost
      players[playerId].hasPerformedAction = true
    },
    moveCardToBoard: (state, action: PlayerCardAction) => {
      moveCardToBoardTransformer(state, action)
    },
    updateCard: (
      state,
      action: PayloadAction<{
        playerId: Player['id']
        cardId: PlayCard['id']
        update: Partial<PlayCard>
      }>,
    ) => {
      const { playerId, cardId, update } = action.payload

      state.players[playerId].cards[cardId] = {
        ...state.players[playerId].cards[cardId],
        ...update,
      }
    },
    moveCardToDiscard: (state, action: PlayerCardAction) => {
      const { players } = state
      const { playerId, cardId: movedCardId } = action.payload

      const player = players[playerId]

      players[playerId].board = player.board.filter(
        (cardId) => cardId !== movedCardId,
      )
      players[playerId].hand = player.hand.filter(
        (cardId) => cardId !== movedCardId,
      )
      players[playerId].deck = player.deck.filter(
        (cardId) => cardId !== movedCardId,
      )

      const card = player.cards[movedCardId]

      players[playerId].discard = [...player.discard, movedCardId]
      players[playerId].cards[movedCardId] = {
        ...card,
        strength: card.prototype.strength,
      }
      players[playerId].income += card.cost
    },
  },
})

const { actions, reducer } = duelSlice

export const {
  initializeDuel,
  completeRedraw,
  drawCardFromDeck,
  endTurn,
  initializeEndTurn,
  playCard,
  putCardAtBottomOfDeck,
  beginPlay,
  startRedraw,
  moveCardToBoard,
  updateCard,
  agentAttacksAgent,
  agentAttacksPlayer,
  moveToNextAttacker,
  moveCardToDiscard,
} = actions

export type DuelActionTypes = `${typeof duelSlice.name}/${keyof typeof actions}`

export default reducer
