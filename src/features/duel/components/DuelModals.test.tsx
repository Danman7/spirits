import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'

import { RootState } from 'src/app/store'
import { HammeriteNovice } from 'src/features/cards/CardBases'
import { createDuelCard } from 'src/shared/utils'
import { MockPlayerTurnState } from 'src/shared/__mocks__'
import DuelModals, {
  DuelModalsProps,
} from 'src/features/duel/components/DuelModals'
import {
  opponentDecidingMessage,
  opponentFirst,
  opponentTurnTitle,
  passButtonMessage,
  playerFirst,
  redrawMessage,
  skipRedrawLinkMessage,
  victoryMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import {
  completeRedraw,
  initializeEndTurn,
  playCard,
} from 'src/features/duel/slice'
import { Player } from 'src/features/duel/types'
import { renderWithProviders } from 'src/shared/rtlRender'
import { MODAL_TEST_ID } from 'src/shared/testIds'

const playerId = MockPlayerTurnState.playerOrder[1]
const opponentId = MockPlayerTurnState.playerOrder[0]

const mockPlayer: Player = MockPlayerTurnState.players[playerId]

const playedCard = createDuelCard(HammeriteNovice)

const mockOpponent: Player = {
  ...MockPlayerTurnState.players[opponentId],
  hand: [playedCard.id],
  cards: {
    [playedCard.id]: playedCard,
  },
}

const playerNames = ['Garrett', 'Karrass']

const defaultProps: DuelModalsProps = {
  player: mockPlayer,
  opponent: mockOpponent,
  isPlayerActive: true,
  turn: 1,
  phase: 'Pre-duel',
  playerNames,
}

const preloadedState: Partial<RootState> = {
  duel: MockPlayerTurnState,
}

describe('Overlay Modal', () => {
  it('should show player names and if player is first on initializing a duel and then hide itself', () => {
    const { getByText } = renderWithProviders(
      <DuelModals {...defaultProps} />,
      { preloadedState },
    )

    expect(
      getByText(`${playerNames[0]} vs ${playerNames[1]}`),
    ).toBeInTheDocument()
    expect(getByText(playerFirst)).toBeInTheDocument()
  })

  it('should show that opponent is first if they win coin toss', () => {
    const { getByText } = renderWithProviders(
      <DuelModals {...defaultProps} isPlayerActive={false} />,
      {
        preloadedState,
      },
    )

    expect(getByText(opponentFirst)).toBeInTheDocument()
  })

  it("should show that it is the player's turn", () => {
    const { getByText } = renderWithProviders(
      <DuelModals {...defaultProps} phase="Player Turn" />,
      {
        preloadedState,
      },
    )

    expect(getByText(yourTurnTitle)).toBeInTheDocument()
  })

  it("should show that it is the opponent's turn", () => {
    const { getByText } = renderWithProviders(
      <DuelModals
        {...defaultProps}
        phase="Player Turn"
        isPlayerActive={false}
      />,
    )

    expect(getByText(opponentTurnTitle)).toBeInTheDocument()
  })

  it("should show the duel victor's name", () => {
    const { getByText } = renderWithProviders(
      <DuelModals {...defaultProps} victorName={playerNames[0]} />,
      {
        preloadedState,
      },
    )

    expect(getByText(`${playerNames[0]} ${victoryMessage}`)).toBeInTheDocument()
  })
})

describe('Side Panel', () => {
  it('should show the redraw phase panel with skip redraw link', async () => {
    const { getByText, getByTestId, dispatchSpy } = renderWithProviders(
      <DuelModals {...defaultProps} phase="Pre-duel" />,
      {
        preloadedState,
      },
    )

    fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))

    await waitFor(() => expect(getByText(redrawMessage)).toBeInTheDocument())

    fireEvent.click(getByText(skipRedrawLinkMessage))

    expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw(playerId))
  })

  it('should show the waiting for opponent message during redraw phase', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <DuelModals
        {...defaultProps}
        phase="Pre-duel"
        player={{ ...mockPlayer, hasPerformedAction: true }}
      />,
      {
        preloadedState,
      },
    )

    fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))

    await waitFor(() =>
      expect(getByText(opponentDecidingMessage)).toBeInTheDocument(),
    )
  })

  it('should show the your turn message with pass link', async () => {
    const { getByText, getByTestId, dispatchSpy } = renderWithProviders(
      <DuelModals {...defaultProps} phase="Player Turn" />,
      {
        preloadedState,
      },
    )

    fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))

    await waitFor(() => expect(getByText(yourTurnMessage)).toBeInTheDocument())

    fireEvent.click(getByText(passButtonMessage))

    expect(dispatchSpy).toHaveBeenCalledWith(initializeEndTurn())
  })

  it("should show the waiting for opponent message during opponent's turn", async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <DuelModals
        {...defaultProps}
        phase="Player Turn"
        isPlayerActive={false}
      />,
      {
        preloadedState,
      },
    )

    fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))

    await waitFor(() =>
      expect(getByText(opponentDecidingMessage)).toBeInTheDocument(),
    )
  })
})

describe('CPU triggers', () => {
  it('should play CPU turn', async () => {
    const { getByText, getByTestId, dispatchSpy } = renderWithProviders(
      <DuelModals
        {...defaultProps}
        opponent={{ ...mockOpponent, isCPU: true }}
        phase="Player Turn"
        isPlayerActive={false}
      />,
      {
        preloadedState: {
          duel: {
            ...MockPlayerTurnState,
            players: {
              [mockOpponent.id]: { ...mockOpponent, isCPU: true },
            },
            activePlayerId: mockOpponent.id,
          },
        },
      },
    )

    fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))

    await waitFor(() =>
      expect(getByText(opponentDecidingMessage)).toBeInTheDocument(),
    )

    expect(dispatchSpy).toHaveBeenCalledWith(
      playCard({
        cardId: playedCard.id,
        playerId: opponentId,
      }),
    )
  })
})
