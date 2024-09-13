import '@testing-library/jest-dom'

import Board from 'src/Game/components/Board'
import {
  endTurnMessage,
  initialDrawMessage,
  opponentTurnMessage,
  passButtonMessage,
  playerFirstMessage,
  redrawMessage,
  skipRedrawMessage
} from 'src/Game/messages'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import {
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie
} from 'src/Cards/CardPrototypes'
import { fireEvent, render, screen, waitFor } from 'src/shared/utils/test-utils'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import { GamePhase, MainState, GameState } from 'src/shared/redux/StateTypes'

const haunt = createPlayCardFromPrototype(Haunt)
const book = createPlayCardFromPrototype(BookOfAsh)
const brother = createPlayCardFromPrototype(BrotherSachelman)
const novice = createPlayCardFromPrototype(HammeriteNovice)

const mockPlayers: GameState['players'] = {
  [MockPlayer2.id]: {
    ...MockPlayer2,
    cards: {
      [haunt.id]: haunt,
      [book.id]: book
    },
    deck: [],
    hand: [haunt.id],
    discard: [book.id]
  },
  [MockPlayer1.id]: {
    ...MockPlayer1,
    isActive: true,
    cards: {
      [brother.id]: brother,
      [novice.id]: novice
    },
    deck: [],
    hand: [brother.id],
    discard: [novice.id]
  }
}

const mockGameState: GameState = {
  turn: 1,
  players: mockPlayers,
  playerOrder: [MockPlayer2.id, MockPlayer1.id],
  phase: GamePhase.PLAYER_TURN,
  loggedInPlayerId: MockPlayer1.id
}

test('show the general UI elements', () => {
  const gameState: GameState = { ...mockGameState }

  render(<Board />, {
    preloadedState: {
      game: gameState
    }
  })

  const { players, playerOrder } = gameState

  expect(screen.getByText(players[playerOrder[0]].name)).toBeInTheDocument()
  expect(screen.getByText(players[playerOrder[1]].name)).toBeInTheDocument()

  expect(screen.getByText(players[playerOrder[0]].coins)).toBeInTheDocument()
  expect(screen.getByText(players[playerOrder[1]].coins)).toBeInTheDocument()
})

test('initial draw of cards', () => {
  const preloadedState: MainState = {
    game: {
      ...mockGameState,
      phase: GamePhase.INITIAL_DRAW
    }
  }

  render(<Board />, {
    preloadedState
  })

  expect(screen.getByText(initialDrawMessage)).toBeInTheDocument()
})

test('redraw a card', async () => {
  const zombie1 = createPlayCardFromPrototype(Zombie)
  const zombie2 = createPlayCardFromPrototype(Zombie)
  const acolyte = createPlayCardFromPrototype(ElevatedAcolyte)
  const novice2 = createPlayCardFromPrototype(HammeriteNovice)
  const guard = createPlayCardFromPrototype(TempleGuard)

  const gameState: GameState = {
    ...mockGameState,
    phase: GamePhase.REDRAW,
    players: {
      [MockPlayer2.id]: {
        ...mockPlayers[MockPlayer2.id],
        cards: {
          ...mockPlayers[MockPlayer2.id].cards,
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2
        },
        isReady: true,
        hand: [...mockPlayers[MockPlayer2.id].hand, zombie1.id, zombie2.id]
      },
      [MockPlayer1.id]: {
        ...mockPlayers[MockPlayer1.id],
        cards: {
          ...mockPlayers[MockPlayer1.id].cards,
          [novice2.id]: novice2,
          [guard.id]: guard,
          [acolyte.id]: acolyte
        },
        deck: [acolyte.id],
        hand: [...mockPlayers[MockPlayer1.id].hand, novice2.id, guard.id]
      }
    }
  }

  render(<Board />, {
    preloadedState: {
      game: gameState
    }
  })

  expect(screen.getByText(redrawMessage)).toBeInTheDocument()
  expect(screen.getByText(skipRedrawMessage)).toBeInTheDocument()

  fireEvent.click(screen.getByText(guard.name))

  expect(screen.getByText(ElevatedAcolyte.name)).toBeInTheDocument()
})

test('play a card from hand', async () => {
  const gameState: GameState = { ...mockGameState }

  const { players } = gameState

  const activePlayer = players[MockPlayer1.id]

  const { coins } = activePlayer

  const { name, cost } = activePlayer.cards[activePlayer.hand[0]]

  render(<Board />, {
    preloadedState: {
      game: gameState
    }
  })

  expect(screen.getByText(playerFirstMessage)).toBeInTheDocument()

  expect(screen.getByText(passButtonMessage)).toBeInTheDocument()

  await waitFor(
    async () =>
      expect(
        await screen.queryByText(playerFirstMessage)
      ).not.toBeInTheDocument(),
    {
      timeout: 3000
    }
  )

  fireEvent.click(screen.getByText(name))

  expect(screen.getByText(coins - cost)).toBeInTheDocument()

  expect(screen.getByText(endTurnMessage)).toBeInTheDocument()
})

test('end the turn', async () => {
  render(<Board />, {
    preloadedState: {
      game: { ...mockGameState }
    }
  })

  expect(screen.queryByRole('button')).toBeInTheDocument()

  fireEvent.click(screen.getByText(passButtonMessage))

  await waitFor(
    async () =>
      expect(
        await expect(screen.queryByRole('button')).not.toBeInTheDocument()
      ),
    {
      timeout: 3000
    }
  )
})

test('play a card as CPU and end the turn', async () => {
  const state: GameState = {
    ...mockGameState,
    players: {
      [MockPlayer2.id]: { ...mockPlayers[MockPlayer2.id], isCPU: true },
      [MockPlayer1.id]: mockPlayers[MockPlayer1.id]
    }
  }

  render(<Board />, {
    preloadedState: {
      game: state
    }
  })

  const cpuPlayer = mockGameState.players[MockPlayer2.id]
  const playedCPUCard = cpuPlayer.cards[cpuPlayer.hand[0]]

  expect(screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

  fireEvent.click(screen.getByText(passButtonMessage))

  expect(screen.getByText(opponentTurnMessage)).toBeInTheDocument()

  await waitFor(
    async () =>
      expect(
        await expect(
          screen.queryByText(opponentTurnMessage)
        ).not.toBeInTheDocument()
      ),
    {
      timeout: 3000
    }
  )

  expect(screen.getByText(playedCPUCard.name)).toBeInTheDocument()
})
