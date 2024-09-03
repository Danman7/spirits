import '@testing-library/jest-dom'

import Board from 'src/Game/components/Board'
import {
  endTurnMessage,
  initialDrawMessage,
  passButtonMessage
} from 'src/Game/messages'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { BrotherSachelman, Haunt } from 'src/Cards/CardPrototypes'
import { fireEvent, render, screen, waitFor } from 'src/shared/utils/test-utils'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import {
  GamePhase,
  MainState,
  PlayersInGame,
  GameState,
  Player
} from 'src/shared/redux/StateTypes'

const initialPlayers: PlayersInGame = [
  { ...MockPlayer2, hand: [createPlayCardFromPrototype(Haunt)] },
  {
    ...MockPlayer1,
    isActive: true,
    hand: [createPlayCardFromPrototype(BrotherSachelman)]
  }
]

const mockGameState: GameState = {
  turn: 1,
  players: initialPlayers,
  phase: GamePhase.PLAYER_TURN,
  loggedInPlayerId: MockPlayer1.id
}

test('show the general UI elements', () => {
  const gameState = { ...mockGameState }

  render(<Board />, {
    preloadedState: {
      game: gameState
    }
  })

  const { players } = gameState

  expect(screen.getByText(players[0].name)).toBeInTheDocument()
  expect(screen.getByText(players[1].name)).toBeInTheDocument()

  expect(screen.getByText(players[0].coins)).toBeInTheDocument()
  expect(screen.getByText(players[1].coins)).toBeInTheDocument()
})

test('initial draw of cards', () => {
  const preloadedState: MainState = {
    game: {
      ...mockGameState,
      players: [MockPlayer1, MockPlayer2],
      phase: GamePhase.INITIAL_DRAW
    }
  }

  render(<Board />, {
    preloadedState
  })

  expect(screen.getByText(initialDrawMessage)).toBeInTheDocument()
})

test('play a card from hand', async () => {
  const gameState = { ...mockGameState }

  const { players } = gameState

  const activePlayer = players.find(({ isActive }) => isActive) as Player

  const { coins } = activePlayer

  const { name, cost } = activePlayer.hand[0]

  render(<Board />, {
    preloadedState: {
      game: gameState
    }
  })

  expect(screen.queryByText(passButtonMessage)).toBeInTheDocument()

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
  const CPUPlayerIndex = 0

  const state: GameState = {
    ...mockGameState,
    players: mockGameState.players.map((player, playerIndex) => {
      if (playerIndex === CPUPlayerIndex) {
        return {
          ...player,
          isCPU: true
        }
      }

      return player
    }) as PlayersInGame
  }

  render(<Board />, {
    preloadedState: {
      game: state
    }
  })

  const playedCPUCard = mockGameState.players[0].hand[0]

  expect(screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

  fireEvent.click(screen.getByText(passButtonMessage))

  await waitFor(
    async () =>
      expect(
        await screen.queryByText(playedCPUCard.name)
      ).not.toBeInTheDocument(),
    {
      timeout: 3000
    }
  )
})
