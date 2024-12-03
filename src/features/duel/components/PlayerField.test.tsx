import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'

import {
  mockStackedPlayer,
  stackedPreloadedState as preloadedState,
} from 'src/shared/__mocks__'
import PlayerField, {
  PlayerFieldProps,
} from 'src/features/duel/components/PlayerField'
import { closeMessage } from 'src/features/duel/messages'
import {
  completeRedraw,
  drawCardFromDeck,
  moveToNextAttacker,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import { renderWithProviders } from 'src/shared/rtlRender'
import {
  PLAYER_BOARD_ID,
  PLAYER_DECK_ID,
  PLAYER_DISCARD_ID,
  PLAYER_HAND_ID,
} from 'src/shared/testIds'

const playerId = mockStackedPlayer.id

const defaultProps: PlayerFieldProps = {
  player: mockStackedPlayer,
  isActive: true,
  phase: 'Player Turn',
  isOnTop: false,
  attackingAgentId: '',
}

describe('Bottom (Player) Side', () => {
  it('should show player info', () => {
    const { getByRole } = renderWithProviders(
      <PlayerField {...defaultProps} />,
      {
        preloadedState,
      },
    )

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(
      `${mockStackedPlayer.name} / ${mockStackedPlayer.coins} (+${mockStackedPlayer.income})`,
    )
  })

  it('should show player stacks', () => {
    const { getByTestId, getByText, queryByText } = renderWithProviders(
      <PlayerField {...defaultProps} player={mockStackedPlayer} />,
      {
        preloadedState,
      },
    )

    expect(getByTestId(PLAYER_DECK_ID).children).toHaveLength(
      mockStackedPlayer.deck.length,
    )
    expect(getByTestId(PLAYER_HAND_ID).children).toHaveLength(
      mockStackedPlayer.hand.length,
    )
    expect(getByTestId(PLAYER_BOARD_ID).children).toHaveLength(
      mockStackedPlayer.board.length,
    )
    expect(getByTestId(PLAYER_DISCARD_ID).children).toHaveLength(
      mockStackedPlayer.discard.length,
    )

    expect(
      getByText(mockStackedPlayer.cards[mockStackedPlayer.hand[0]].name),
    ).toBeInTheDocument()
    expect(
      getByText(mockStackedPlayer.cards[mockStackedPlayer.board[0]].name),
    ).toBeInTheDocument()
    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.deck[0]].name),
    ).not.toBeInTheDocument()
    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.discard[0]].name),
    ).not.toBeInTheDocument()
  })

  it('should be able to browse deck and discard stacks', async () => {
    const { getByTestId, getByText, queryByText } = renderWithProviders(
      <PlayerField {...defaultProps} player={mockStackedPlayer} />,
      {
        preloadedState,
      },
    )

    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.deck[0]].name),
    ).not.toBeInTheDocument()

    fireEvent.click(getByTestId(PLAYER_DECK_ID))

    expect(
      getByText(mockStackedPlayer.cards[mockStackedPlayer.deck[0]].name),
    ).toBeInTheDocument()

    fireEvent.click(getByText(closeMessage))

    await waitFor(() => {
      expect(
        queryByText(mockStackedPlayer.cards[mockStackedPlayer.deck[0]].name),
      ).not.toBeInTheDocument()
    })

    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.discard[0]].name),
    ).not.toBeInTheDocument()

    fireEvent.click(getByTestId(PLAYER_DISCARD_ID))

    expect(
      getByText(mockStackedPlayer.cards[mockStackedPlayer.discard[0]].name),
    ).toBeInTheDocument()

    fireEvent.click(getByText(closeMessage))

    await waitFor(() => {
      expect(
        queryByText(mockStackedPlayer.cards[mockStackedPlayer.deck[0]].name),
      ).not.toBeInTheDocument()
    })
  })

  it('should be able to redraw a card', () => {
    const { getByText, dispatchSpy } = renderWithProviders(
      <PlayerField
        {...defaultProps}
        player={mockStackedPlayer}
        phase="Redrawing Phase"
      />,
      {
        preloadedState,
      },
    )

    const redrawnCard = mockStackedPlayer.cards[mockStackedPlayer.hand[0]]

    fireEvent.click(getByText(redrawnCard.name))

    expect(dispatchSpy).toHaveBeenCalledWith(
      putCardAtBottomOfDeck({
        cardId: redrawnCard.id,
        playerId,
      }),
    )
    expect(dispatchSpy).toHaveBeenCalledWith(
      drawCardFromDeck(mockStackedPlayer.id),
    )
    expect(dispatchSpy).toHaveBeenCalledWith(
      completeRedraw(mockStackedPlayer.id),
    )
  })

  it('should be able to play a card', () => {
    const { getByText, dispatchSpy } = renderWithProviders(
      <PlayerField {...defaultProps} />,
      {
        preloadedState,
      },
    )

    const playedCard = mockStackedPlayer.cards[mockStackedPlayer.hand[0]]

    fireEvent.click(getByText(playedCard.name))

    expect(dispatchSpy).toHaveBeenCalledWith(
      playCard({ cardId: playedCard.id, playerId }),
    )
  })

  it('should show agent attacking', async () => {
    const attackingAgentId = mockStackedPlayer.board[0]

    const { dispatchSpy } = renderWithProviders(
      <PlayerField {...defaultProps} attackingAgentId={attackingAgentId} />,
      {
        preloadedState,
      },
    )

    await waitFor(() =>
      expect(dispatchSpy).toHaveBeenCalledWith(moveToNextAttacker()),
    )
  })
})

describe('Top (Opponent) Side', () => {
  it('should show opponent stacks', () => {
    const { getByText, queryByText } = renderWithProviders(
      <PlayerField {...defaultProps} isOnTop />,
      {
        preloadedState,
      },
    )

    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.hand[0]].name),
    ).not.toBeInTheDocument()
    expect(
      getByText(mockStackedPlayer.cards[mockStackedPlayer.board[0]].name),
    ).toBeInTheDocument()
    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.deck[0]].name),
    ).not.toBeInTheDocument()
    expect(
      queryByText(mockStackedPlayer.cards[mockStackedPlayer.discard[0]].name),
    ).not.toBeInTheDocument()
  })
})
