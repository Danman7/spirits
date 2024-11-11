import '@testing-library/jest-dom'
import { RootState } from 'src/app/store'
import {
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardPrototypes'
import { DuelAgent } from 'src/features/cards/types'
import { createDuelCard } from 'src/features/cards/utils'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import Board from 'src/features/duel/components/Board'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawMessage,
  victoryMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import { initialState } from 'src/features/duel/slice'
import { DuelState } from 'src/features/duel/types'
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from 'src/shared/test-utils'
import {
  OPPONENT_DECK_ID,
  OPPONENT_DISCARD_ID,
  OPPONENT_HAND_ID,
  OPPONENT_INFO_ID,
  PLAYER_BOARD_ID,
  PLAYER_DECK_ID,
  PLAYER_DISCARD_ID,
  PLAYER_HAND_ID,
  PLAYER_INFO_ID,
} from 'src/shared/testIds'

const playerId = MockPlayer1.id
const opponentId = MockPlayer2.id

const mockPlayers: DuelState['players'] = {
  [opponentId]: MockPlayer2,
  [playerId]: MockPlayer1,
}

const mockPlayer = mockPlayers[playerId]
const mockOpponent = mockPlayers[opponentId]

const mockGameState: DuelState = {
  ...initialState,
  turn: 1,
  activePlayerId: playerId,
  players: mockPlayers,
  playerOrder: [opponentId, playerId],
  phase: 'Player Turn',
  loggedInPlayerId: playerId,
}

let preloadedState: RootState

beforeEach(() => {
  preloadedState = { duel: { ...mockGameState } }
})

describe('General duel flow', () => {
  test('show the general UI elements', () => {
    preloadedState.duel.players[playerId] = { ...mockPlayer, income: 2 }

    render(<Board />, {
      preloadedState,
    })

    const { players } = preloadedState.duel

    const player = players[playerId]

    expect(screen.getByTestId(OPPONENT_INFO_ID)).toHaveTextContent(
      `${mockOpponent.name} / ${mockOpponent.coins}`,
    )
    expect(screen.getByTestId(PLAYER_INFO_ID)).toHaveTextContent(
      `${player.name} / ${player.coins} (+${player.income})`,
    )
  })

  test('initial draw of cards', async () => {
    preloadedState.duel.phase = 'Initial Draw'

    render(<Board />, {
      preloadedState,
    })

    expect(screen.getByTestId(PLAYER_HAND_ID).children).toHaveLength(
      INITIAL_CARD_DRAW_AMOUNT,
    )
    expect(screen.getByTestId(OPPONENT_HAND_ID).children).toHaveLength(
      INITIAL_CARD_DRAW_AMOUNT,
    )

    await waitFor(
      () => {
        expect(screen.getByTestId(PLAYER_DECK_ID).children).toHaveLength(
          mockPlayer.deck.length - INITIAL_CARD_DRAW_AMOUNT,
        )
      },
      { timeout: 1000 },
    )

    expect(screen.getByTestId(OPPONENT_DECK_ID).children).toHaveLength(
      mockOpponent.deck.length - INITIAL_CARD_DRAW_AMOUNT,
    )

    for (let index = 0; index < INITIAL_CARD_DRAW_AMOUNT; index++) {
      expect(
        screen.getAllByText(mockPlayer.cards[mockPlayer.deck[index]].name)
          .length,
      ).toBeTruthy()
    }
  })

  test('redraw a card', async () => {
    const acolyte = createDuelCard(ElevatedAcolyte)
    const acolyte2 = createDuelCard(ElevatedAcolyte)
    const novice = createDuelCard(HammeriteNovice)
    const brother = createDuelCard(BrotherSachelman)
    const guard = createDuelCard(TempleGuard)

    preloadedState.duel.phase = 'Redrawing Phase'
    preloadedState.duel.players = {
      [opponentId]: {
        ...mockOpponent,
        hasPerformedAction: true,
      },
      [playerId]: {
        ...mockPlayer,
        cards: {
          [guard.id]: guard,
          [novice.id]: novice,
          [brother.id]: brother,
          [acolyte.id]: acolyte,
          [acolyte2.id]: acolyte2,
        },
        deck: [guard.id],
        hand: [novice.id, brother.id, acolyte.id, acolyte2.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Redrawing Phase',
    )
    expect(screen.getByText(redrawMessage)).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent(skipRedrawMessage)

    fireEvent.click(screen.getByText(BrotherSachelman.name))

    expect(screen.getByText(TempleGuard.name)).toBeInTheDocument()
    expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
    expect(screen.getByTestId(PLAYER_HAND_ID).children).toHaveLength(
      INITIAL_CARD_DRAW_AMOUNT + 1,
    )
  })

  test('waiting for opponent to redraw', async () => {
    preloadedState.duel.phase = 'Redrawing Phase'

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByText(skipRedrawMessage))

    expect(screen.getByText(opponentDecidingMessage)).toBeInTheDocument()
  })

  test('skip redraw', async () => {
    preloadedState.duel.phase = 'Redrawing Phase'
    preloadedState.duel.players = {
      [opponentId]: {
        ...mockOpponent,
        hasPerformedAction: true,
      },
      [playerId]: {
        ...mockPlayer,
      },
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByText(skipRedrawMessage))

    expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
    expect(screen.getByTestId(PLAYER_HAND_ID).children).toHaveLength(
      mockPlayer.hand.length + 1,
    )
    expect(screen.getByTestId(OPPONENT_HAND_ID).children).toHaveLength(
      mockOpponent.hand.length,
    )
  })

  test('play an agent from hand', async () => {
    const haunt = createDuelCard(Haunt)
    const book = createDuelCard(BookOfAsh)
    const brother = createDuelCard(BrotherSachelman)
    const novice = createDuelCard(HammeriteNovice)

    preloadedState.duel.players = {
      [opponentId]: {
        ...mockOpponent,
        cards: {
          [haunt.id]: haunt,
          [book.id]: book,
        },
        deck: [],
        board: [haunt.id],
        discard: [book.id],
      },
      [playerId]: {
        ...mockPlayer,
        cards: {
          [brother.id]: brother,
          [novice.id]: novice,
        },
        board: [],
        deck: [],
        hand: [brother.id],
        discard: [novice.id],
      },
    }

    const { players } = preloadedState.duel
    const activePlayer = players[playerId]
    const opponent = players[opponentId]
    const playedCard = activePlayer.cards[activePlayer.hand[0]] as DuelAgent
    const defenderCard = opponent.cards[opponent.board[0]] as DuelAgent

    render(<Board />, {
      preloadedState,
    })

    expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent(passButtonMessage)
    expect(
      within(screen.getByTestId(PLAYER_HAND_ID)).getByText(playedCard.name),
    ).toBeInTheDocument()
    expect(screen.getByTestId(PLAYER_INFO_ID)).toHaveTextContent(
      `${activePlayer.name} / ${activePlayer.coins}`,
    )

    fireEvent.click(screen.getByText(playedCard.name))

    expect(screen.getByTestId(PLAYER_INFO_ID)).toHaveTextContent(
      `${activePlayer.name} / ${activePlayer.coins - playedCard.cost}`,
    )
    expect(
      within(screen.getByTestId(PLAYER_BOARD_ID)).getByText(playedCard.name),
    ).toBeInTheDocument()

    expect(screen.getAllByRole('heading', { level: 4 })[0]).toHaveTextContent(
      `${defenderCard.name}${defenderCard.strength - 1}`,
    )
  })

  test('play an instant from hand', () => {
    const book = createDuelCard(BookOfAsh)
    const zombie = createDuelCard(Zombie)

    preloadedState.duel.players = {
      [opponentId]: mockOpponent,
      [playerId]: {
        ...mockPlayer,
        cards: {
          [book.id]: book,
          [zombie.id]: zombie,
        },
        board: [],
        deck: [],
        hand: [book.id],
        discard: [zombie.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    const { players } = preloadedState.duel
    const activePlayer = players[playerId]
    const playedCard = activePlayer.cards[activePlayer.hand[0]] as DuelAgent

    expect(
      within(screen.getByTestId(PLAYER_HAND_ID)).getByText(playedCard.name),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByText(playedCard.name))

    expect(screen.getByTestId(PLAYER_INFO_ID)).toHaveTextContent(
      `${activePlayer.name} / ${activePlayer.coins - playedCard.cost} (+${playedCard.cost})`,
    )
    expect(screen.getByTestId(PLAYER_BOARD_ID).children).toHaveLength(2)
    expect(screen.queryByText(playedCard.name)).not.toBeInTheDocument()
  })

  test('cannot click on opponent stacks', () => {
    const haunt = createDuelCard(Haunt)
    const haunt2 = createDuelCard(Haunt)
    const zombie = createDuelCard(Zombie)

    preloadedState.duel.players = {
      [opponentId]: {
        ...mockPlayer,
        cards: {
          [haunt.id]: haunt,
          [haunt2.id]: haunt2,
          [zombie.id]: zombie,
        },
        board: [],
        deck: [haunt2.id],
        hand: [haunt.id],
        discard: [zombie.id],
      },
      [playerId]: mockPlayer,
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByTestId(OPPONENT_DECK_ID))

    expect(screen.queryByText(haunt.name)).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId(OPPONENT_DISCARD_ID))

    expect(screen.queryByText(zombie.name)).not.toBeInTheDocument()
  })

  test('pass the turn and send damaged card to discard', async () => {
    const haunt = createDuelCard(Haunt)
    const zombie = createDuelCard(Zombie)
    const brother = createDuelCard(BrotherSachelman)
    const novice = createDuelCard(HammeriteNovice)

    preloadedState.duel.players = {
      [opponentId]: {
        ...mockOpponent,
        cards: {
          [haunt.id]: { ...haunt, strength: 1 } as DuelAgent,
          [zombie.id]: zombie,
        },
        deck: [],
        board: [haunt.id, zombie.id],
        discard: [],
      },
      [playerId]: {
        ...mockPlayer,
        cards: {
          [brother.id]: brother,
          [novice.id]: novice,
        },
        deck: [],
        board: [brother.id, novice.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByText(passButtonMessage))

    await waitFor(
      () => {
        expect(screen.getByText(opponentTurnTitle)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText(Haunt.name)).not.toBeInTheDocument()
  })

  test('show victory modal', () => {
    preloadedState.duel.players = {
      [opponentId]: mockOpponent,
      [playerId]: {
        ...mockPlayer,
        coins: 0,
      },
    }

    render(<Board />, {
      preloadedState,
    })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${mockOpponent.name} ${victoryMessage}`,
    )
  })

  test('browse deck', () => {
    const haunt = createDuelCard(Haunt)
    const brother = createDuelCard(BrotherSachelman)

    preloadedState.duel.players = {
      [opponentId]: mockOpponent,
      [playerId]: {
        ...mockPlayer,
        cards: {
          [haunt.id]: haunt,
          [brother.id]: brother,
        },
        deck: [haunt.id, brother.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    expect(screen.queryByText(haunt.name)).not.toBeInTheDocument()
    expect(screen.queryByText(brother.name)).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId(PLAYER_DECK_ID))

    expect(screen.getByText(haunt.name)).toBeInTheDocument()
    expect(screen.getByText(brother.name)).toBeInTheDocument()
  })

  test('browse discard', () => {
    const haunt = createDuelCard(Haunt)
    const brother = createDuelCard(BrotherSachelman)

    preloadedState.duel.players = {
      [opponentId]: mockOpponent,
      [playerId]: {
        ...mockPlayer,
        cards: {
          [haunt.id]: haunt,
          [brother.id]: brother,
        },
        deck: [],
        discard: [haunt.id, brother.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    expect(screen.queryByText(haunt.name)).not.toBeInTheDocument()
    expect(screen.queryByText(brother.name)).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId(PLAYER_DISCARD_ID))

    expect(screen.getByText(haunt.name)).toBeInTheDocument()
    expect(screen.getByText(brother.name)).toBeInTheDocument()
  })
})

describe('Specifics', () => {
  test('playind cards with "all copies" effects reduce coins only once', () => {
    const novice1 = createDuelCard(HammeriteNovice)
    const novice2 = createDuelCard(HammeriteNovice)
    const guard = createDuelCard(TempleGuard)

    preloadedState.duel.players = {
      [opponentId]: mockOpponent,
      [playerId]: {
        ...mockPlayer,
        cards: {
          [novice1.id]: novice1,
          [novice2.id]: novice2,
          [guard.id]: guard,
        },
        deck: [],
        board: [guard.id],
        hand: [novice1.id, novice2.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getAllByText(HammeriteNovice.name)[0])

    const { players, playerOrder } = preloadedState.duel

    const playerInfos = screen.getAllByRole('heading', { level: 3 })

    expect(playerInfos[1].textContent).toBe(
      `${players[playerOrder[1]].name} / ${players[playerOrder[1]].coins - HammeriteNovice.cost}`,
    )
  })
})

describe('CPU Player', () => {
  test('CPU skips redraw', async () => {
    preloadedState.duel.phase = 'Redrawing Phase'
    preloadedState.duel.players = {
      [opponentId]: {
        ...mockOpponent,
        isCPU: true,
      },
      [playerId]: mockPlayer,
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByText(skipRedrawMessage))

    expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
  })

  test('play a card as CPU and end the turn', async () => {
    const haunt = createDuelCard(Haunt)
    const brother = createDuelCard(BrotherSachelman)

    preloadedState.duel.players = {
      [opponentId]: {
        ...mockOpponent,
        cards: {
          [haunt.id]: haunt,
        },
        deck: [],
        hand: [haunt.id],
        discard: [],
        isCPU: true,
      },
      [playerId]: {
        ...mockPlayer,
        cards: {
          [brother.id]: brother,
        },
        deck: [],
        hand: [brother.id],
        discard: [],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    const cpuPlayer = preloadedState.duel.players[opponentId]
    const playedCPUCard = cpuPlayer.cards[cpuPlayer.hand[0]]

    expect(screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

    fireEvent.click(screen.getByText(passButtonMessage))

    expect(await screen.findByText(opponentTurnTitle)).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByText(playedCPUCard.name)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })
})
