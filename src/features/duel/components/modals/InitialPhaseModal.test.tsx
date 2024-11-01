import '@testing-library/jest-dom'
import { RootState } from 'src/app/store'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import InitialPhaseModal from 'src/features/duel/components/modals/InitialPhaseModal'
import { initialDrawMessage } from 'src/features/duel/messages'
import { initialState } from 'src/features/duel/slice'
import { DuelState } from 'src/features/duel/types'
import { render, screen } from 'src/shared/test-utils'

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
  phase: 'Initial Draw',
  loggedInPlayerId: playerId,
}

let preloadedState: RootState

beforeEach(() => {
  preloadedState = { duel: { ...mockGameState } }
})

test('modal shows content as expected', () => {
  render(<InitialPhaseModal />, {
    preloadedState,
  })

  expect(
    screen.getByText(
      `${mockGameState.players[opponentId].name} vs ${mockGameState.players[playerId].name}`,
    ),
  ).toBeInTheDocument()

  expect(
    screen.getByText(
      `${mockGameState.players[playerId].name} ${initialDrawMessage}`,
    ),
  ).toBeInTheDocument()
})
