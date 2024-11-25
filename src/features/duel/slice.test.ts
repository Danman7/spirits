import {
  HammeriteNovice,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardBases'
import { DuelCard } from 'src/features/cards/types'
import { createDuelCard } from 'src/features/cards/utils'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'
import duelReducer, {
  addNewCards,
  startInitialCardDraw,
  completeRedraw,
  drawCardFromDeck,
  initializeDuel,
  initializeEndTurn,
  initialState,
  moveCardToBoard,
  moveCardToDiscard,
  moveToNextAttacker,
  playCard,
  putCardAtBottomOfDeck,
  updateCard,
} from 'src/features/duel/slice'
import { CardStacks, DuelState, PlayerCards } from 'src/features/duel/types'

const playerId = MockPlayer1.id
const opponentId = MockPlayer2.id

const initialPlayers = [MockPlayer1, MockPlayer2]

const mockPlayers: DuelState['players'] = {
  [opponentId]: MockPlayer2,
  [playerId]: MockPlayer1,
}

const mockPlayer = mockPlayers[playerId]
const mockOpponent = mockPlayers[opponentId]

const mockDuelState: DuelState = {
  ...initialState,
  players: mockPlayers,
  activePlayerId: playerId,
  playerOrder: [opponentId, playerId],
}

let duelState: DuelState

describe('Initializing a duel', () => {
  beforeEach(() => {
    duelState = { ...initialState }
  })

  test('initialize a new game with a random first player', () => {
    const state = duelReducer(
      duelState,
      initializeDuel({
        players: [mockPlayer, mockOpponent],
        loggedInPlayerId: mockOpponent.id,
      }),
    )

    const { turn, activePlayerId, phase } = state

    expect(turn).toBe(0)
    expect(activePlayerId).toBeTruthy()
    expect(phase).toBe('Pre-duel')
  })

  test('initialize a new game with a preset first player', () => {
    const firstPlayerId = opponentId

    const state = duelReducer(
      duelState,
      initializeDuel({
        players: initialPlayers,
        firstPlayerId,
      }),
    )

    const { turn, activePlayerId, phase } = state

    expect(turn).toBe(0)
    expect(activePlayerId).toBe(firstPlayerId)
    expect(phase).toBe('Pre-duel')
  })

  test('throw an error when initializing game if firstPlayerId is set to a non existent player', () => {
    expect(() => {
      duelReducer(
        duelState,
        initializeDuel({
          players: initialPlayers,
          firstPlayerId: 'random-id',
        }),
      )
    }).toThrow()
  })
})

describe('Sequence before play', () => {
  beforeEach(() => {
    duelState = { ...mockDuelState }
  })

  test("draw a card from a player's deck if it has cards", () => {
    const mockDrawingPlayer = duelState.players[playerId]

    duelState.phase = 'Initial Draw'

    const state = duelReducer(duelState, drawCardFromDeck(playerId))

    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length - 1)
    expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length + 1)
    expect(drawingPlayer.hand).toContain(mockDrawingPlayer.deck[0])
  })

  test('should draw no card if deck has no cards', () => {
    duelState.phase = 'Initial Draw'

    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        hand: [],
        deck: [],
      },
      [opponentId]: mockOpponent,
    }

    const mockDrawingPlayer = duelState.players[playerId]

    const state = duelReducer(duelState, drawCardFromDeck(playerId))

    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length)
    expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length)
  })

  test('initial card draw', () => {
    const state = duelReducer(duelState, startInitialCardDraw())

    const { players } = state

    Object.values(players).forEach(({ id, hand, deck }) => {
      expect(hand).toHaveLength(INITIAL_CARD_DRAW_AMOUNT)
      expect(deck).toHaveLength(
        mockPlayers[id].deck.length - INITIAL_CARD_DRAW_AMOUNT,
      )
    })

    expect(state.phase).toBe('Redrawing Phase')
  })

  test('put a card at the bottom of the deck', () => {
    const novice = createDuelCard(HammeriteNovice)
    const cardId = novice.id
    const stacks = ['hand', 'board', 'discard']

    stacks.forEach((stack: 'hand' | 'board' | 'discard') => {
      duelState.players = {
        [playerId]: {
          ...mockPlayer,
          cards: {
            ...mockPlayer.cards,
            [cardId]: novice,
          },
          [stack]: [cardId],
        },
        [opponentId]: mockOpponent,
      }

      const state = duelReducer(
        duelState,
        putCardAtBottomOfDeck({
          playerId,
          cardId,
        }),
      )

      const player = state.players[playerId]

      expect(player[stack]).toHaveLength(0)
      expect(player.deck).toHaveLength(mockPlayer.deck.length + 1)
      expect(player.deck).toContain(cardId)
    })
  })

  test('mark that one player has completed redraw', () => {
    const state = duelReducer(duelState, completeRedraw(playerId))
    const { players } = state

    expect(players[playerId].hasPerformedAction).toBeTruthy()
    expect(players[opponentId].hasPerformedAction).toBeFalsy()
  })

  test('start the game if both players have completed redraw', () => {
    duelState.players = {
      [playerId]: mockPlayer,
      [opponentId]: { ...mockOpponent, hasPerformedAction: true },
    }
    duelState.playerOrder = [opponentId, playerId]

    const state = duelReducer(duelState, completeRedraw(playerId))

    const { turn, phase, players, activePlayerId } = state

    expect(turn).toBe(1)
    expect(phase).toBe('Player Turn')
    expect(players[activePlayerId].hand).toHaveLength(
      mockPlayer.hand.length + 1,
    )
    expect(
      Object.values(players).every(
        ({ hasPerformedAction }) => !hasPerformedAction,
      ),
    ).toBeTruthy()
  })
})

describe('Playing turns', () => {
  beforeEach(() => {
    duelState = {
      ...mockDuelState,
      turn: 1,
      phase: 'Player Turn',
    }
  })

  test('initialize end of turn resolution if active player has no units on board', () => {
    const mockState: DuelState = {
      ...duelState,
      players: {
        [playerId]: {
          ...duelState.players[playerId],
          board: [],
        },
        [opponentId]: duelState.players[opponentId],
      },
    }

    const state = duelReducer(mockState, initializeEndTurn())

    const { phase, attackingAgentId } = state

    expect(phase).toBe('Player Turn')
    expect(attackingAgentId).toBe('')
  })

  test('initialize end of turn resolution if active player has units on board', () => {
    const novice = createDuelCard(HammeriteNovice)

    duelState.players = {
      [playerId]: {
        ...duelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: duelState.players[opponentId],
    }

    const state = duelReducer(duelState, initializeEndTurn())

    const { phase, attackingAgentId } = state

    expect(phase).toBe('Resolving end of turn')
    expect(attackingAgentId).toBe(novice.id)
  })

  test('agent attacking player', () => {
    const novice = createDuelCard(HammeriteNovice)

    duelState.phase = 'Player Turn'
    duelState.players = {
      [playerId]: {
        ...duelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: { ...duelState.players[opponentId], board: [] },
    }

    const state = duelReducer(duelState, initializeEndTurn())

    const { players } = state

    expect(players[opponentId].coins).toBe(mockOpponent.coins - 1)
  })

  test('agent attacking agent', () => {
    const novice = createDuelCard(HammeriteNovice)
    const zombie = createDuelCard(Zombie)

    duelState.phase = 'Resolving end of turn'
    duelState.players = {
      [playerId]: {
        ...duelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: {
        ...duelState.players[opponentId],
        cards: {
          [zombie.id]: zombie,
        },
        deck: [],
        board: [zombie.id],
      },
    }

    const state = duelReducer(duelState, initializeEndTurn())

    const { players } = state

    const damagedAgent = players[opponentId].cards[zombie.id]

    expect(damagedAgent.strength).toBe(
      (players[opponentId].cards[zombie.id].base.strength as number) - 1,
    )
  })

  test('end of turn as player', () => {
    duelState.phase = 'Resolving end of turn'
    duelState.activePlayerId = playerId

    const coins = 20
    const income = 2

    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        income,
        coins,
      },
      [opponentId]: mockOpponent,
    }

    const state = duelReducer(duelState, moveToNextAttacker())

    const { phase, turn, activePlayerId, players } = state

    const player = players[playerId]

    expect(turn).toBe(duelState.turn + 1)
    expect(phase).toBe('Player Turn')
    expect(activePlayerId).toBe(opponentId)
    expect(player.coins).toBe(coins + 1)
    expect(player.income).toBe(income - 1)
  })

  test('agent attacking agent on opposite slot', () => {
    const novice1 = createDuelCard(HammeriteNovice)
    const novice2 = createDuelCard(HammeriteNovice)
    const zombie1 = createDuelCard(Zombie)
    const zombie2 = createDuelCard(Zombie)

    duelState.phase = 'Resolving end of turn'
    duelState.activePlayerId = opponentId
    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        cards: {
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        deck: [],
        hand: [],
        board: [zombie1.id, zombie2.id],
      },
      [opponentId]: {
        ...mockOpponent,
        cards: {
          [novice1.id]: novice1,
          [novice2.id]: novice2,
        },
        deck: [],
        hand: [],
        board: [novice1.id, novice2.id],
      },
    }

    const mockDefendingCard =
      duelState.players[playerId].cards[duelState.players[playerId].board[0]]

    const state = duelReducer(duelState, moveToNextAttacker())

    const { players, attackingAgentId } = state

    const player = players[playerId]
    const opponent = players[opponentId]

    const defendingCard = player.cards[player.board[0]]

    expect(attackingAgentId).toBe(opponent.board[0])
    expect(defendingCard.strength).toBe(mockDefendingCard.strength - 1)
  })

  test('agent attacking agent on previous slot', () => {
    const novice = createDuelCard(HammeriteNovice)
    const zombie1 = createDuelCard(Zombie)
    const zombie2 = createDuelCard(Zombie)

    duelState.phase = 'Resolving end of turn'
    duelState.activePlayerId = playerId
    duelState.attackingAgentId = zombie1.id
    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        cards: {
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        deck: [],
        hand: [],
        board: [zombie1.id, zombie2.id],
      },
      [opponentId]: {
        ...mockOpponent,
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        hand: [],
        board: [novice.id],
      },
    }

    const mockDefendingCard =
      duelState.players[opponentId].cards[
        duelState.players[opponentId].board[0]
      ]

    const state = duelReducer(duelState, moveToNextAttacker())

    const { players, attackingAgentId } = state

    const player = players[playerId]
    const opponent = players[opponentId]

    const defendingCard = opponent.cards[opponent.board[0]]

    expect(attackingAgentId).toBe(player.board[1])
    expect(defendingCard.strength).toBe(mockDefendingCard.strength - 1)
  })

  test('end turn on last attacker', () => {
    duelState.phase = 'Resolving end of turn'
    const novice = createDuelCard(HammeriteNovice)

    duelState.phase = 'Resolving end of turn'
    duelState.activePlayerId = playerId
    duelState.attackingAgentId = novice.id
    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        hand: [],
        board: [novice.id],
      },
      [opponentId]: mockOpponent,
    }

    const state = duelReducer(duelState, moveToNextAttacker())

    const { phase, turn, activePlayerId } = state

    expect(turn).toBe(duelState.turn + 1)
    expect(phase).toBe('Player Turn')
    expect(activePlayerId).toBe(opponentId)
  })

  test('end turn when there are no attackers', () => {
    duelState.phase = 'Resolving end of turn'
    duelState.activePlayerId = opponentId

    const state = duelReducer(duelState, moveToNextAttacker())

    const { phase, turn, activePlayerId } = state

    expect(turn).toBe(duelState.turn + 1)
    expect(phase).toBe('Player Turn')
    expect(activePlayerId).toBe(playerId)
  })

  test('play card', () => {
    const novice = createDuelCard(HammeriteNovice)
    const cardId = novice.id
    const stacks: CardStacks[] = ['hand', 'discard', 'deck']

    stacks.forEach((stack: 'hand' | 'discard' | 'deck') => {
      duelState.players = {
        [playerId]: {
          ...mockPlayer,
          [stack]: [cardId],
          cards: {
            [cardId]: novice,
          },
        },
        [opponentId]: {
          ...mockOpponent,
          hand: [],
          cards: {},
        },
      }

      const mockPlayingPlayer = duelState.players[playerId]

      const state = duelReducer(
        duelState,
        playCard({
          cardId: novice.id,
          playerId,
        }),
      )

      const playingPlayer = state.players[playerId]

      expect(playingPlayer.coins).toBe(mockPlayingPlayer.coins - novice.cost)
      expect(playingPlayer[stack]).toHaveLength(0)
      expect(playingPlayer.board).toHaveLength(
        mockPlayingPlayer.board.length + 1,
      )
      expect(playingPlayer.board).toContain(cardId)
    })
  })

  test('move card to board without playing it', () => {
    const novice = createDuelCard(HammeriteNovice)
    const cardId = novice.id
    const stacks: CardStacks[] = ['hand', 'discard', 'deck']

    stacks.forEach((stack: 'hand' | 'discard' | 'deck') => {
      duelState.players = {
        [playerId]: {
          ...mockPlayer,
          [stack]: [cardId],
          cards: {
            [cardId]: novice,
          },
        },
        [opponentId]: {
          ...mockOpponent,
          hand: [],
          cards: {},
        },
      }

      const mockPlayingPlayer = duelState.players[playerId]

      const state = duelReducer(
        duelState,
        moveCardToBoard({
          cardId: novice.id,
          playerId,
        }),
      )

      const playingPlayer = state.players[playerId]

      expect(playingPlayer.coins).toBe(mockPlayingPlayer.coins)
      expect(playingPlayer[stack]).toHaveLength(0)
      expect(playingPlayer.board).toHaveLength(
        mockPlayingPlayer.board.length + 1,
      )
      expect(playingPlayer.board).toContain(cardId)
    })
  })

  test('update an agent', () => {
    const novice = createDuelCard(HammeriteNovice)
    const cardId = novice.id

    duelState.activePlayerId = playerId

    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        board: [cardId],
        cards: {
          [cardId]: novice,
        },
      },
      [opponentId]: mockOpponent,
    }

    const update: Partial<DuelCard> = {
      cost: 1,
      strength: 5,
    }

    const state = duelReducer(
      duelState,
      updateCard({
        playerId,
        cardId,
        update,
      }),
    )

    const updatedCard = state.players[playerId].cards[cardId]

    expect(updatedCard.strength).toBe(update.strength)
    expect(updatedCard.cost).toBe(update.cost)
  })

  test('remove agent with no strength as a result of update', () => {
    const novice = createDuelCard(HammeriteNovice)
    const cardId = novice.id

    duelState.activePlayerId = playerId

    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        board: [cardId],
        cards: {
          [cardId]: novice,
        },
      },
      [opponentId]: mockOpponent,
    }

    const update: Partial<DuelCard> = {
      strength: 0,
    }

    const state = duelReducer(
      duelState,
      updateCard({
        playerId,
        cardId,
        update,
      }),
    )

    const player = state.players[playerId]

    expect(player.board).toHaveLength(0)
    expect(player.discard).toContain(cardId)
  })

  test('remove agent with no strength as a result of an attack', () => {
    const novice = createDuelCard(HammeriteNovice)
    const zombie = createDuelCard(Zombie)
    const cardId = novice.id

    duelState.activePlayerId = playerId

    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        board: [cardId],
        cards: {
          [cardId]: novice,
        },
      },
      [opponentId]: {
        ...mockOpponent,
        cards: {
          [zombie.id]: { ...zombie, strength: 1 },
        },
        board: [zombie.id],
      },
    }

    const state = duelReducer(duelState, moveToNextAttacker())

    const opponent = state.players[opponentId]

    expect(opponent.board).toHaveLength(0)
    expect(opponent.discard).toContain(zombie.id)
  })

  test('move a card from board to discard pile', () => {
    const novice = createDuelCard(HammeriteNovice)
    const guard = createDuelCard(TempleGuard)
    const cardId = novice.id
    const stacks: CardStacks[] = ['hand', 'board', 'deck']

    stacks.forEach((stack: 'hand' | 'board' | 'deck') => {
      duelState.players = {
        [playerId]: {
          ...mockPlayer,
          [stack]: [cardId, guard.id],
          discard: [],
          cards: {
            [cardId]: { ...novice, strength: 1 },
            [guard.id]: guard,
          },
        },
        [opponentId]: mockOpponent,
      }

      const state = duelReducer(
        duelState,
        moveCardToDiscard({
          playerId,
          cardId,
        }),
      )

      const player = state.players[playerId]

      const discardedCard = player.cards[cardId]

      expect(player[stack]).toHaveLength(1)
      expect(player.discard).toHaveLength(1)
      expect(player.discard).toContain(cardId)
      expect(discardedCard.strength).toBe(discardedCard.base.strength)
      expect(player.income).toBe(novice.cost)
    })
  })

  test('summon new cards for a player', () => {
    const novice = createDuelCard(HammeriteNovice)

    duelState.activePlayerId = playerId

    duelState.players = {
      [playerId]: {
        ...mockPlayer,
        deck: [],
        cards: {},
      },
      [opponentId]: mockOpponent,
    }

    const addedCards: PlayerCards = {
      [novice.id]: novice,
    }

    const state = duelReducer(
      duelState,
      addNewCards({
        playerId,
        cards: addedCards,
      }),
    )

    const player = state.players[playerId]

    expect(player.cards).toEqual(addedCards)
  })
})
