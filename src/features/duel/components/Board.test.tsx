import '@testing-library/jest-dom'

import Board from 'src/features/duel/components/Board'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawMessage,
  victoryMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import { fireEvent, render, screen, waitFor } from 'src/shared/test-utils'
import { DuelState } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'

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
import { createPlayCardFromPrototype } from 'src/features/cards/utils'
import { initialState } from 'src/features/duel/slice'
import { PLAYER_DECK_TEST_ID, PLAYER_DISCARD_TEST_ID } from '../constants'
import { DuelAgent } from 'src/features/cards/types'

const playerId = MockPlayer1.id
const opponentId = MockPlayer2.id

const mockPlayers: DuelState['players'] = {
  [opponentId]: MockPlayer2,
  [playerId]: MockPlayer1,
}

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
    preloadedState.duel.players = {
      [playerId]: { ...MockPlayer1, income: 2 },
      [opponentId]: { ...MockPlayer2 },
    }

    render(<Board />, {
      preloadedState,
    })

    const { players, playerOrder } = preloadedState.duel

    const playerInfos = screen.getAllByRole('heading', { level: 3 })

    expect(playerInfos[1].textContent).toBe(
      `${players[playerOrder[1]].name} / ${players[playerOrder[1]].coins} (+${players[playerOrder[1]].income})`,
    )

    expect(playerInfos[0].textContent).toBe(
      `${players[playerOrder[0]].name} / ${players[playerOrder[0]].coins}`,
    )
  })

  test('initial draw of cards', async () => {
    preloadedState.duel.phase = 'Initial Draw'

    render(<Board />, {
      preloadedState,
    })

    const { players } = preloadedState.duel

    const player = players[playerId]

    expect(
      await screen.findByText(player.cards[player.deck[0]].name),
    ).toBeInTheDocument()
  })

  test('redraw a card', async () => {
    const zombie1 = createPlayCardFromPrototype(Zombie)
    const zombie2 = createPlayCardFromPrototype(Zombie)
    const acolyte = createPlayCardFromPrototype(ElevatedAcolyte)
    const novice2 = createPlayCardFromPrototype(HammeriteNovice)
    const guard = createPlayCardFromPrototype(TempleGuard)

    preloadedState.duel.phase = 'Redrawing Phase'
    preloadedState.duel.players = {
      [opponentId]: {
        ...mockPlayers[opponentId],
        cards: {
          ...mockPlayers[opponentId].cards,
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        hasPerformedAction: true,
        hand: [...mockPlayers[opponentId].hand, zombie1.id, zombie2.id],
      },
      [playerId]: {
        ...mockPlayers[playerId],
        cards: {
          ...mockPlayers[playerId].cards,
          [novice2.id]: novice2,
          [guard.id]: guard,
          [acolyte.id]: acolyte,
        },
        deck: [acolyte.id],
        hand: [...mockPlayers[playerId].hand, novice2.id, guard.id],
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

    fireEvent.click(screen.getByText(guard.name))

    expect(screen.getByText(ElevatedAcolyte.name)).toBeInTheDocument()

    expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
  })

  test('waiting for opponent to redraw', async () => {
    const zombie1 = createPlayCardFromPrototype(Zombie)
    const zombie2 = createPlayCardFromPrototype(Zombie)
    const acolyte = createPlayCardFromPrototype(ElevatedAcolyte)
    const novice2 = createPlayCardFromPrototype(HammeriteNovice)
    const guard = createPlayCardFromPrototype(TempleGuard)

    preloadedState.duel.phase = 'Redrawing Phase'
    preloadedState.duel.players = {
      [opponentId]: {
        ...mockPlayers[opponentId],
        cards: {
          ...mockPlayers[opponentId].cards,
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        hand: [...mockPlayers[opponentId].hand, zombie1.id, zombie2.id],
      },
      [playerId]: {
        ...mockPlayers[playerId],
        cards: {
          ...mockPlayers[playerId].cards,
          [novice2.id]: novice2,
          [guard.id]: guard,
          [acolyte.id]: acolyte,
        },
        deck: [acolyte.id],
        hand: [...mockPlayers[playerId].hand, novice2.id, guard.id],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByText(guard.name))

    expect(screen.getByText(opponentDecidingMessage)).toBeInTheDocument()
  })

  test('skip redraw', async () => {
    preloadedState.duel.phase = 'Redrawing Phase'
    preloadedState.duel.players = {
      [opponentId]: {
        ...mockPlayers[opponentId],
        hasPerformedAction: true,
      },
      [playerId]: {
        ...mockPlayers[playerId],
      },
    }

    render(<Board />, {
      preloadedState,
    })

    fireEvent.click(screen.getByRole('button'))

    expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
  })

  test('play a card from hand', async () => {
    const haunt = createPlayCardFromPrototype(Haunt)
    const book = createPlayCardFromPrototype(BookOfAsh)
    const brother = createPlayCardFromPrototype(BrotherSachelman)
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    preloadedState.duel.players = {
      [opponentId]: {
        ...MockPlayer2,
        cards: {
          [haunt.id]: haunt,
          [book.id]: book,
        },
        deck: [],
        hand: [haunt.id],
        discard: [book.id],
      },
      [playerId]: {
        ...MockPlayer1,
        cards: {
          [brother.id]: brother,
          [novice.id]: novice,
        },
        deck: [],
        hand: [brother.id],
        discard: [novice.id],
      },
    }

    const { players } = preloadedState.duel

    const activePlayer = players[playerId]

    const playedCard = activePlayer.cards[activePlayer.hand[0]] as DuelAgent

    render(<Board />, {
      preloadedState,
    })

    expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()

    expect(screen.getByRole('button')).toHaveTextContent(passButtonMessage)

    fireEvent.click(screen.getByText(playedCard.name))

    const playerInfos = screen.getAllByRole('heading', { level: 3 })

    expect(playerInfos[1]).toHaveTextContent(
      `${activePlayer.name} / ${activePlayer.coins - playedCard.cost}`,
    )

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      `${playedCard.name}${playedCard.strength}`,
    )

    expect(await screen.findByText(activePlayer.coins - 1)).toBeInTheDocument()
  })

  test('pass the turn', async () => {
    const haunt = createPlayCardFromPrototype(Haunt)
    const zombie = createPlayCardFromPrototype(Zombie)
    const brother = createPlayCardFromPrototype(BrotherSachelman)
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    preloadedState.duel.players = {
      [opponentId]: {
        ...MockPlayer2,
        cards: {
          [haunt.id]: { ...haunt, strength: 1 } as DuelAgent,
          [zombie.id]: zombie,
        },
        deck: [],
        board: [haunt.id, zombie.id],
      },
      [playerId]: {
        ...MockPlayer1,
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

    expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))

    await waitFor(
      () => {
        expect(screen.getByText(opponentTurnTitle)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.queryByText(Haunt.name)).not.toBeInTheDocument()
  })

  test('play a card as CPU and end the turn', async () => {
    const haunt = createPlayCardFromPrototype(Haunt)
    const brother = createPlayCardFromPrototype(BrotherSachelman)

    preloadedState.duel.players = {
      [opponentId]: {
        ...MockPlayer2,
        cards: {
          [haunt.id]: haunt,
        },
        deck: [],
        hand: [haunt.id],
        discard: [],
        isCPU: true,
      },
      [playerId]: {
        ...MockPlayer1,
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

  test('show victory modal', () => {
    preloadedState.duel.players = {
      [opponentId]: MockPlayer2,
      [playerId]: {
        ...MockPlayer1,
        coins: 0,
      },
    }

    render(<Board />, {
      preloadedState,
    })

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${MockPlayer2.name} ${victoryMessage}`,
    )
  })

  test('browse deck', () => {
    const haunt = createPlayCardFromPrototype(Haunt)
    const brother = createPlayCardFromPrototype(BrotherSachelman)

    preloadedState.duel.players = {
      [opponentId]: MockPlayer2,
      [playerId]: {
        ...MockPlayer1,
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

    fireEvent.click(screen.getByTestId(PLAYER_DECK_TEST_ID))

    expect(screen.getByText(haunt.name)).toBeInTheDocument()
    expect(screen.getByText(brother.name)).toBeInTheDocument()
  })

  test('browse discard', () => {
    const haunt = createPlayCardFromPrototype(Haunt)
    const brother = createPlayCardFromPrototype(BrotherSachelman)

    preloadedState.duel.players = {
      [opponentId]: MockPlayer2,
      [playerId]: {
        ...MockPlayer1,
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

    fireEvent.click(screen.getByTestId(PLAYER_DISCARD_TEST_ID))

    expect(screen.getByText(haunt.name)).toBeInTheDocument()
    expect(screen.getByText(brother.name)).toBeInTheDocument()
  })
})

describe('Specifics', () => {
  test('playind cards with "all copies" effects reduce coins only once', () => {
    const novice1 = createPlayCardFromPrototype(HammeriteNovice)
    const novice2 = createPlayCardFromPrototype(HammeriteNovice)
    const guard = createPlayCardFromPrototype(TempleGuard)

    preloadedState.duel.players = {
      [opponentId]: MockPlayer2,
      [playerId]: {
        ...MockPlayer1,
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
