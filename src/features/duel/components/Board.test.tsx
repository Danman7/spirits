import '@testing-library/jest-dom'

import Board from 'src/features/duel/components/Board'
import {
  initialDrawMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import { fireEvent, render, screen, waitFor } from 'src/shared/test-utils'
import { DuelPhase, DuelState } from 'src/features/duel/types'
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

const haunt = createPlayCardFromPrototype(Haunt)
const book = createPlayCardFromPrototype(BookOfAsh)
const brother = createPlayCardFromPrototype(BrotherSachelman)
const novice = createPlayCardFromPrototype(HammeriteNovice)

const mockPlayers: DuelState['players'] = {
  [MockPlayer2.id]: {
    ...MockPlayer2,
    cards: {
      [haunt.id]: haunt,
      [book.id]: book,
    },
    deck: [],
    hand: [haunt.id],
    discard: [book.id],
  },
  [MockPlayer1.id]: {
    ...MockPlayer1,
    isActive: true,
    cards: {
      [brother.id]: brother,
      [novice.id]: novice,
    },
    deck: [],
    hand: [brother.id],
    discard: [novice.id],
  },
}

const mockGameState: DuelState = {
  turn: 1,
  players: mockPlayers,
  playerOrder: [MockPlayer2.id, MockPlayer1.id],
  phase: DuelPhase.PLAYER_TURN,
  loggedInPlayerId: MockPlayer1.id,
}

test('show the general UI elements', () => {
  const gameState: DuelState = { ...mockGameState }

  render(<Board />, {
    preloadedState: {
      duel: gameState,
    },
  })

  const { players, playerOrder } = gameState

  expect(screen.getByText(players[playerOrder[0]].name)).toBeInTheDocument()
  expect(screen.getByText(players[playerOrder[1]].name)).toBeInTheDocument()

  expect(screen.getByText(players[playerOrder[0]].coins)).toBeInTheDocument()
  expect(screen.getByText(players[playerOrder[1]].coins)).toBeInTheDocument()
})

test('initial draw of cards', () => {
  const preloadedState: RootState = {
    duel: {
      ...mockGameState,
      phase: DuelPhase.INITIAL_DRAW,
    },
  }

  render(<Board />, {
    preloadedState,
  })

  expect(screen.getByText(initialDrawMessage)).toBeInTheDocument()
})

test('redraw a card', async () => {
  const zombie1 = createPlayCardFromPrototype(Zombie)
  const zombie2 = createPlayCardFromPrototype(Zombie)
  const acolyte = createPlayCardFromPrototype(ElevatedAcolyte)
  const novice2 = createPlayCardFromPrototype(HammeriteNovice)
  const guard = createPlayCardFromPrototype(TempleGuard)

  const gameState: DuelState = {
    ...mockGameState,
    phase: DuelPhase.REDRAW,
    players: {
      [MockPlayer2.id]: {
        ...mockPlayers[MockPlayer2.id],
        cards: {
          ...mockPlayers[MockPlayer2.id].cards,
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        isReady: true,
        hand: [...mockPlayers[MockPlayer2.id].hand, zombie1.id, zombie2.id],
      },
      [MockPlayer1.id]: {
        ...mockPlayers[MockPlayer1.id],
        cards: {
          ...mockPlayers[MockPlayer1.id].cards,
          [novice2.id]: novice2,
          [guard.id]: guard,
          [acolyte.id]: acolyte,
        },
        deck: [acolyte.id],
        hand: [...mockPlayers[MockPlayer1.id].hand, novice2.id, guard.id],
      },
    },
  }

  render(<Board />, {
    preloadedState: {
      duel: gameState,
    },
  })

  expect(screen.getByText(redrawMessage)).toBeInTheDocument()
  expect(screen.getByText(skipRedrawMessage)).toBeInTheDocument()

  fireEvent.click(screen.getByText(guard.name))

  expect(screen.getByText(ElevatedAcolyte.name)).toBeInTheDocument()
})

test('play a card from hand', async () => {
  const gameState: DuelState = { ...mockGameState }

  const { players } = gameState

  const activePlayer = players[MockPlayer1.id]

  const { coins } = activePlayer

  const { name, cost } = activePlayer.cards[activePlayer.hand[0]]

  render(<Board />, {
    preloadedState: {
      duel: gameState,
    },
  })

  expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()

  expect(screen.getByText(passButtonMessage)).toBeInTheDocument()

  fireEvent.click(screen.getByText(name))

  expect(screen.getByText(coins - cost)).toBeInTheDocument()
})

test('end the turn', async () => {
  render(<Board />, {
    preloadedState: {
      duel: { ...mockGameState },
    },
  })

  expect(screen.getByRole('button')).toBeInTheDocument()

  fireEvent.click(screen.getByText(passButtonMessage))

  await waitFor(
    async () =>
      expect(
        await expect(screen.queryByRole('button')).not.toBeInTheDocument(),
      ),
    {
      timeout: 3000,
    },
  )
})

test('play a card as CPU and end the turn', async () => {
  const state: DuelState = {
    ...mockGameState,
    players: {
      [MockPlayer2.id]: { ...mockPlayers[MockPlayer2.id], isCPU: true },
      [MockPlayer1.id]: mockPlayers[MockPlayer1.id],
    },
  }

  render(<Board />, {
    preloadedState: {
      duel: state,
    },
  })

  const cpuPlayer = mockGameState.players[MockPlayer2.id]
  const playedCPUCard = cpuPlayer.cards[cpuPlayer.hand[0]]

  expect(screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

  fireEvent.click(screen.getByText(passButtonMessage))

  expect(screen.getByText(opponentTurnTitle)).toBeInTheDocument()

  await waitFor(
    async () =>
      expect(
        await expect(
          screen.queryByText(opponentTurnTitle),
        ).not.toBeInTheDocument(),
      ),
    {
      timeout: 3000,
    },
  )

  expect(screen.getByText(playedCPUCard.name)).toBeInTheDocument()
})
