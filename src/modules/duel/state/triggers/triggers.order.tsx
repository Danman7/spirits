import {
  getOtherPlayer,
  getPlayerOwningCardId,
} from 'src/modules/duel/duel.utils'
import {
  DuelTrigger,
  PlayCardAction,
  UpdateAgentAction,
  getNeighboursIndexes,
  getOnPlayCardPredicate,
  getPlayAllCopiesEffect,
} from 'src/modules/duel/state'
import {
  generateBoostedLogMessage,
  generatePlayedFromTriggerLogMessage,
  generateTriggerLogMessage,
  generateTwoEntitiesAction,
  recoveredCostLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  HighPriestMarkander,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  TEMPLE_GUARD_BOOST,
  Agent,
  HammeritePriest,
} from 'src/shared/modules/cards'

export const hammeriteNoviceOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'HammeriteNovice') &&
    action.type === 'PLAY_CARD' &&
    !!state.players[action.playerId].board.find(
      (cardId) =>
        cardId !== action.cardId &&
        state.cards[cardId].categories.includes('Hammerite'),
    ),
  effect: ({ action, state, dispatch }) =>
    getPlayAllCopiesEffect(
      action,
      state.players,
      state.cards,
      'HammeriteNovice',
      dispatch,
    ),
}

export const elevatedAcolyteOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'ElevatedAcolyte'),
  effect: ({ action, state, dispatch }) => {
    const { cardId, playerId } = action as PlayCardAction
    const { players, cards } = state
    const { board } = players[playerId]
    const matchedCard = cards[cardId] as Agent

    const playerdCardIndex = board.indexOf(cardId)
    const neighbourIndexed = getNeighboursIndexes(playerdCardIndex, board)

    if (
      !neighbourIndexed.some((neighbourIndex) => {
        const card = cards[board[neighbourIndex]] as Agent
        const { categories, strength } = card

        return (
          card &&
          categories.includes('Hammerite') &&
          strength > matchedCard.strength
        )
      })
    ) {
      dispatch({ type: 'AGENT_DAMAGE_SELF', cardId, amount: 1 })
    }
  },
}

export const templeGuardOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'TempleGuard'),
  effect: ({ action, state, dispatch }) => {
    const { cardId, playerId } = action as PlayCardAction
    const { players, playerOrder, cards } = state
    const player = players[playerId]
    const opponent = getOtherPlayer(players, playerOrder, playerId)
    const matchedCard = cards[cardId] as Agent

    if (opponent.board.length <= player.board.length) return

    dispatch({
      type: 'UPDATE_AGENT',
      cardId,
      playerId,
      update: { strength: matchedCard.strength + TEMPLE_GUARD_BOOST },
    })

    dispatch({
      type: 'ADD_LOG',
      message: generateTriggerLogMessage(
        generateBoostedLogMessage(matchedCard.name, TEMPLE_GUARD_BOOST),
      ),
    })
  },
}

export const brotherSachelmanOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'BrotherSachelman'),
  effect: ({ action, state, dispatch }) => {
    const { cardId: playedCardId, playerId } = action as PlayCardAction
    const { players, cards } = state
    const { board } = players[playerId]

    board.forEach((boardCardId) => {
      const { strength, categories, name } = cards[boardCardId] as Agent

      if (
        categories.includes('Hammerite') &&
        boardCardId !== playedCardId &&
        strength < (cards[playedCardId] as Agent).strength
      ) {
        dispatch({
          type: 'UPDATE_AGENT',
          cardId: boardCardId,
          playerId,
          update: { strength: strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST },
        })

        dispatch({
          type: 'ADD_LOG',
          message: generateTriggerLogMessage(
            generateBoostedLogMessage(
              name,
              HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
            ),
          ),
        })
      }
    })
  },
}

export const highPriestMarkanderOnUpdate: DuelTrigger = {
  predicate: (state, action) =>
    action.type === 'UPDATE_AGENT' &&
    state.cards[action.cardId].name === HighPriestMarkander.name,
  effect: ({ action, state, dispatch }) => {
    const { players, cards } = state
    const { cardId, playerId } = action as UpdateAgentAction
    const { board, discard } = players[playerId]
    const { counter } = cards[cardId] as Agent

    if ((counter as number) <= 0 && ![...board, ...discard].includes(cardId)) {
      dispatch({ type: 'PLAY_CARD', cardId, playerId, shouldPay: false })

      dispatch({
        type: 'ADD_LOG',
        message: generateTriggerLogMessage(
          generatePlayedFromTriggerLogMessage(HighPriestMarkander.name),
        ),
      })
    }
  },
}

export const hammeritePriestOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'HammeritePriest'),
  effect: ({ action, state, dispatch }) => {
    const { playerId, cardId } = action as PlayCardAction
    const player = state.players[playerId]

    dispatch({
      type: 'TRIGGER_TARGET_SELECTION',
      validTargets: player.board.filter(
        (boardCardId) => boardCardId !== cardId,
      ),
      triggererId: cardId,
    })
  },
}

export const hammeritePriestOnSelectTarget: DuelTrigger = {
  predicate: (state, action) => {
    const triggerer = state.cards[state.targeting.triggererId]

    return (
      triggerer &&
      action.type === 'SELECT_TARGET' &&
      triggerer.name === HammeritePriest.name
    )
  },
  effect: ({ action, state, dispatch }) => {
    const { cards, players, playerOrder } = state
    const { cardId } = action as PlayCardAction

    const playerId = getPlayerOwningCardId(players, playerOrder, cardId)

    dispatch({ type: 'DISCARD_CARD', cardId, shouldRecoverCost: true })
    dispatch({ type: 'GAIN_COINS', amount: cards[cardId].cost, playerId })

    const triggererName = state.cards[state.targeting.triggererId].name
    const recoveredCardName = cards[cardId].name

    dispatch({
      type: 'ADD_LOG',
      message: generateTriggerLogMessage(
        generateTwoEntitiesAction(
          triggererName,
          recoveredCardName,
          recoveredCostLogMessage,
        ),
      ),
    })
    dispatch({ type: 'RESOLVE_TURN' })
  },
}
