import '@testing-library/jest-dom'

import Board from 'src/Game/components/Board'
import {
  endTurnMessage,
  passButtonMessage,
  redrawMessage
} from 'src/Game/messages'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import {
  BrotherSachelman,
  HammeriteNovice,
  Haunt
} from 'src/Cards/CardPrototypes'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { fireEvent, render, screen, waitFor } from 'src/shared/utils/test-utils'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import {
  GamePhase,
  MainState,
  PlayerState,
  GameState,
  Player
} from 'src/shared/redux/StateTypes'
import { initialState } from 'src/shared/redux/reducers/GameReducer'

const initialPlayers: PlayerState = [
  {
    ...MockPlayer1,
    isActive: true,
    hand: [createPlayCardFromPrototype(BrotherSachelman)]
  },
  { ...MockPlayer2, hand: [createPlayCardFromPrototype(Haunt)] }
]

const mockState: MainState = {
  game: {
    turn: 1,
    players: initialPlayers,
    phase: GamePhase.PLAYER_TURN
  }
}

test('show the general UI elements', () => {
  const { players } = mockState.game

  render(<Board />, {
    preloadedState: mockState
  })

  expect(screen.getByText(players[0].name)).toBeInTheDocument()
  expect(screen.getByText(players[1].name)).toBeInTheDocument()

  expect(screen.getByText(players[0].coins)).toBeInTheDocument()
  expect(screen.getByText(players[1].coins)).toBeInTheDocument()
})

test('initial draw of cards', () => {
  const preloadedState: MainState = {
    game: {
      ...initialState,
      players: [MockPlayer1, MockPlayer2],
      phase: GamePhase.INITIAL_DRAW
    }
  }

  render(<Board />, {
    preloadedState
  })

  expect(screen.getByText(redrawMessage)).toBeInTheDocument()
})

test('play a card from hand', async () => {
  const { players } = mockState.game

  const activePlayer = players.find(({ isActive }) => isActive) as Player

  const { coins } = activePlayer

  const { name, cost } = activePlayer.hand[0]

  render(<Board />, {
    preloadedState: mockState
  })

  expect(screen.queryByText(passButtonMessage)).toBeInTheDocument()

  fireEvent.click(screen.getByText(name))

  expect(screen.getByText(coins - cost)).toBeInTheDocument()

  expect(screen.getByText(endTurnMessage)).toBeInTheDocument()
})

test('end the turn', async () => {
  render(<Board />, {
    preloadedState: mockState
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
  const mockGameState: GameState = {
    ...mockState.game,
    players: [initialPlayers[0], { ...initialPlayers[1], isCPU: true }]
  }

  render(<Board />, {
    preloadedState: {
      ...mockState,
      game: mockGameState
    }
  })

  const playedCPUCard = mockGameState.players[1].hand[0]

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

test('play a card witn an on play ability', () => {
  const mockGameState: GameState = {
    ...mockState.game,
    players: [
      initialPlayers[1],
      {
        ...initialPlayers[0],
        board: [
          createPlayCardFromPrototype(HammeriteNovice),
          createPlayCardFromPrototype(HammeriteNovice)
        ]
      }
    ]
  }

  render(<Board />, {
    preloadedState: { ...mockState, game: mockGameState }
  })

  expect(screen.queryAllByText(HammeriteNovice.name)).toHaveLength(2)

  fireEvent.click(screen.getByText(initialPlayers[0].hand[0].name))

  expect(
    screen.queryAllByText(
      (HammeriteNovice.strength as number) + BROTHER_SACHELMAN_BOOST
    )
  ).toHaveLength(2)
})
