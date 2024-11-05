import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DuelAgent, PlayCard } from 'src/features/cards/types'
import {
  drawCardFromDeckTransformer,
  initializeEndTurnTransformer,
  moveCardToBoardTransformer,
  moveCardToDiscardTransformer,
  moveToNextAttackerTransformer,
} from 'src/features/duel/transformers'
import {
  DuelPhase,
  DuelState,
  Player,
  PlayerCardAction,
  PlayerOrder,
} from 'src/features/duel/types'
import { getRandomArrayItem, shuffleArray } from 'src/shared/utils'

export const initialState: DuelState = {
  turn: 0,
  phase: 'Pre-duel',
  players: {},
  playerOrder: ['', ''],
  loggedInPlayerId: '',
  attackingAgentId: '',
  activePlayerId: '',
  hasAddedCardEffectListeners: false,
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
        .map(({ id }) => id) as PlayerOrder

      state.phase = phase || 'Initial Draw'

      if (loggedInPlayerId) {
        state.loggedInPlayerId = loggedInPlayerId
      }
    },
    drawCardFromDeck: (state, action: PayloadAction<Player['id']>) => {
      drawCardFromDeckTransformer(state, action.payload)
    },
    startRedraw: (state) => {
      const [opponentId, playerId] = state.playerOrder

      state.phase = 'Redrawing Phase'

      state.players[opponentId].hasPerformedAction = false
      state.players[playerId].hasPerformedAction = false
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
      const { playerOrder, activePlayerId } = state
      const [opponentId, playerId] = playerOrder

      state.phase = 'Player Turn'
      state.turn = 1

      state.players[opponentId].hasPerformedAction = false
      state.players[playerId].hasPerformedAction = false

      drawCardFromDeckTransformer(state, activePlayerId)
    },
    initializeEndTurn: (state) => {
      initializeEndTurnTransformer(state)
    },
    moveToNextAttacker: (state) => {
      moveToNextAttackerTransformer(state)
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
    updateAgent: (
      state,
      action: PayloadAction<{
        playerId: Player['id']
        cardId: PlayCard['id']
        update: Partial<DuelAgent>
      }>,
    ) => {
      const { playerId, cardId, update } = action.payload

      const movedCard = state.players[playerId].cards[cardId] as DuelAgent

      state.players[playerId].cards[cardId] = {
        ...state.players[playerId].cards[cardId],
        ...update,
      } as DuelAgent

      if (movedCard.strength <= 0) {
        moveCardToDiscardTransformer(state, {
          payload: {
            cardId,
            playerId,
          },
        })
      }
    },
    moveCardToDiscard: (state, action: PlayerCardAction) => {
      moveCardToDiscardTransformer(state, action)
    },
    setHasAddedCardEffectListeners: (state, action: PayloadAction<boolean>) => {
      state.hasAddedCardEffectListeners = action.payload
    },
  },
})

const { actions, reducer } = duelSlice

export const {
  initializeDuel,
  completeRedraw,
  drawCardFromDeck,
  initializeEndTurn,
  playCard,
  putCardAtBottomOfDeck,
  beginPlay,
  startRedraw,
  moveCardToBoard,
  updateAgent,
  moveToNextAttacker,
  moveCardToDiscard,
  setHasAddedCardEffectListeners,
} = actions

export type DuelActionTypes = `${typeof duelSlice.name}/${keyof typeof actions}`

export default reducer
