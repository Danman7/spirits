import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'

import {
  stackedPlayerMock,
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
  CARD_TEST_ID,
  PLAYER_BOARD_ID,
  PLAYER_DECK_ID,
  PLAYER_DISCARD_ID,
  PLAYER_HAND_ID,
} from 'src/shared/testIds'

const playerId = stackedPlayerMock.id

const defaultProps: PlayerFieldProps = {
  player: stackedPlayerMock,
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
      `${stackedPlayerMock.name} / ${stackedPlayerMock.coins} (+${stackedPlayerMock.income})`,
    )
  })

  it('should show player stacks', () => {
    const { getByTestId, getByText, queryByText } = renderWithProviders(
      <PlayerField {...defaultProps} player={stackedPlayerMock} />,
      {
        preloadedState,
      },
    )

    expect(getByTestId(PLAYER_DECK_ID).children).toHaveLength(
      stackedPlayerMock.deck.length,
    )
    expect(getByTestId(PLAYER_HAND_ID).children).toHaveLength(
      stackedPlayerMock.hand.length,
    )
    expect(getByTestId(PLAYER_BOARD_ID).children).toHaveLength(
      stackedPlayerMock.board.length,
    )
    expect(getByTestId(PLAYER_DISCARD_ID).children).toHaveLength(
      stackedPlayerMock.discard.length,
    )

    expect(
      getByText(stackedPlayerMock.cards[stackedPlayerMock.hand[0]].name),
    ).toBeInTheDocument()
    expect(
      getByText(stackedPlayerMock.cards[stackedPlayerMock.board[0]].name),
    ).toBeInTheDocument()
    expect(
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.deck[0]].name),
    ).not.toBeInTheDocument()
    expect(
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.discard[0]].name),
    ).not.toBeInTheDocument()
  })

  it('should be able to browse deck and discard stacks', async () => {
    const { getByTestId, getByText, queryByText } = renderWithProviders(
      <PlayerField {...defaultProps} player={stackedPlayerMock} />,
      {
        preloadedState,
      },
    )

    expect(
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.deck[0]].name),
    ).not.toBeInTheDocument()

    fireEvent.click(getByTestId(PLAYER_DECK_ID))

    expect(
      getByText(stackedPlayerMock.cards[stackedPlayerMock.deck[0]].name),
    ).toBeInTheDocument()

    fireEvent.click(getByText(closeMessage))

    await waitFor(() => {
      expect(
        queryByText(stackedPlayerMock.cards[stackedPlayerMock.deck[0]].name),
      ).not.toBeInTheDocument()
    })

    expect(
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.discard[0]].name),
    ).not.toBeInTheDocument()

    fireEvent.click(getByTestId(PLAYER_DISCARD_ID))

    expect(
      getByText(stackedPlayerMock.cards[stackedPlayerMock.discard[0]].name),
    ).toBeInTheDocument()

    fireEvent.click(getByText(closeMessage))

    await waitFor(() => {
      expect(
        queryByText(stackedPlayerMock.cards[stackedPlayerMock.deck[0]].name),
      ).not.toBeInTheDocument()
    })
  })

  it('should be able to redraw a card', () => {
    const { getByText, dispatchSpy } = renderWithProviders(
      <PlayerField
        {...defaultProps}
        player={stackedPlayerMock}
        phase="Redrawing Phase"
      />,
      {
        preloadedState,
      },
    )

    const redrawnCard = stackedPlayerMock.cards[stackedPlayerMock.hand[0]]

    fireEvent.click(getByText(redrawnCard.name))

    expect(dispatchSpy).toHaveBeenCalledWith(
      putCardAtBottomOfDeck({
        cardId: redrawnCard.id,
        playerId,
      }),
    )
    expect(dispatchSpy).toHaveBeenCalledWith(
      drawCardFromDeck(stackedPlayerMock.id),
    )
    expect(dispatchSpy).toHaveBeenCalledWith(
      completeRedraw(stackedPlayerMock.id),
    )
  })

  it('should be able to play a card', () => {
    const { getByText, dispatchSpy } = renderWithProviders(
      <PlayerField {...defaultProps} />,
      {
        preloadedState,
      },
    )

    const playedCard = stackedPlayerMock.cards[stackedPlayerMock.hand[0]]

    fireEvent.click(getByText(playedCard.name))

    expect(dispatchSpy).toHaveBeenCalledWith(
      playCard({ cardId: playedCard.id, playerId }),
    )
  })

  it('should show agent attacking', async () => {
    const attackingAgentId = stackedPlayerMock.board[0]

    const { getByTestId, dispatchSpy } = renderWithProviders(
      <PlayerField {...defaultProps} attackingAgentId={attackingAgentId} />,
      {
        preloadedState,
      },
    )

    fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${attackingAgentId}`))

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
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.hand[0]].name),
    ).not.toBeInTheDocument()
    expect(
      getByText(stackedPlayerMock.cards[stackedPlayerMock.board[0]].name),
    ).toBeInTheDocument()
    expect(
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.deck[0]].name),
    ).not.toBeInTheDocument()
    expect(
      queryByText(stackedPlayerMock.cards[stackedPlayerMock.discard[0]].name),
    ).not.toBeInTheDocument()
  })
})
