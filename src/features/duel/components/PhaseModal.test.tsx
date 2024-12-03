import '@testing-library/jest-dom'

import { RootState } from 'src/app/store'
import {
  PhaseModal,
  PhaseModalProps,
} from 'src/features/duel/components/PhaseModal'
import {
  opponentFirst,
  opponentTurnTitle,
  playerFirst,
  victoryMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import { MockPlayerTurnState } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'

const defaultProps: PhaseModalProps = {
  players: MockPlayerTurnState.players,
  haveBothPlayersNotPerformedAction: true,
  isLoggedInPlayerActive: true,
  phase: 'Pre-duel',
  onPhaseModalCloseEnd: jest.fn(),
}

const preloadedState: Partial<RootState> = {
  duel: MockPlayerTurnState,
}

const playerName =
  MockPlayerTurnState.players[MockPlayerTurnState.playerOrder[0]].name
const opponentName =
  MockPlayerTurnState.players[MockPlayerTurnState.playerOrder[1]].name

it('should show player names and if player is first on initializing a duel and then hide itself', () => {
  const { getByText } = renderWithProviders(<PhaseModal {...defaultProps} />, {
    preloadedState,
  })

  expect(getByText(`${opponentName} vs ${playerName}`)).toBeInTheDocument()
  expect(getByText(playerFirst)).toBeInTheDocument()
})

it('should show that opponent is first if they win coin toss', () => {
  const { getByText } = renderWithProviders(
    <PhaseModal {...defaultProps} isLoggedInPlayerActive={false} />,
    {
      preloadedState,
    },
  )

  expect(getByText(opponentFirst)).toBeInTheDocument()
})

it("should show that it is the player's turn", () => {
  const { getByText } = renderWithProviders(
    <PhaseModal {...defaultProps} phase="Player Turn" />,
    {
      preloadedState,
    },
  )

  expect(getByText(yourTurnTitle)).toBeInTheDocument()
})

it("should show that it is the opponent's turn", () => {
  const { getByText } = renderWithProviders(
    <PhaseModal
      {...defaultProps}
      phase="Player Turn"
      isLoggedInPlayerActive={false}
    />,
  )

  expect(getByText(opponentTurnTitle)).toBeInTheDocument()
})

it("should show the duel victor's name", () => {
  const { getByText } = renderWithProviders(
    <PhaseModal {...defaultProps} victoriousPlayerName={playerName} />,
    {
      preloadedState,
    },
  )

  expect(getByText(`${playerName} ${victoryMessage}`)).toBeInTheDocument()
})
