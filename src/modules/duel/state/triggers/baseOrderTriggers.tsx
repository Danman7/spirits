import {
  getOtherPlayer,
  getPlayerOwningCardId,
} from 'src/modules/duel/duel.utils'
import {
  DuelTrigger,
  PlayCardAction,
  getNeighboursIndexes,
  getOnPlayCardPredicate,
  getPlayAllCopiesEffect,
} from 'src/modules/duel/state'
import {
  generateBoostedLogMessage,
  generateTriggerLogMessage,
  generateTwoEntitiesAction,
  recoveredCostLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  HammeritePriest,
  TEMPLE_GUARD_BOOST,
} from 'src/shared/modules/cards'
import { defaultTheme } from 'src/shared/styles'

export const hammeriteNoviceOnPlay: DuelTrigger = {
  predicate: (state, action) =>
    getOnPlayCardPredicate(action, state.cards, 'HammeriteNovice') &&
    action.type === 'PLAY_CARD',
  effect: ({ action, state, dispatch }) => {
    if (
      action.type === 'PLAY_CARD' &&
      state.players[action.playerId].board.find(
        (cardId) =>
          cardId !== action.cardId &&
          state.cards[cardId].categories.includes('Hammerite'),
      )
    ) {
      getPlayAllCopiesEffect(
        action,
        state.players,
        state.cards,
        'HammeriteNovice',
        dispatch,
      )
    } else {
      setTimeout(() => {
        dispatch({ type: 'RESOLVE_TURN' })
      }, defaultTheme.transitionTime * 3)
    }
  },
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

    setTimeout(() => {
      dispatch({ type: 'RESOLVE_TURN' })
    }, defaultTheme.transitionTime * 3)
  },
}
