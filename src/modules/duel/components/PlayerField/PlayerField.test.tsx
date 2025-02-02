import { fireEvent } from '@testing-library/dom'
import { RootState } from 'src/app'
import { PlayerField } from 'src/modules/duel/components'
import {
  completeRedraw,
  drawACardFromDeck,
  playCard,
  putACardAtBottomOfDeck,
  setBrowsedStack,
} from 'src/modules/duel'
import {
  playerId,
  stackedPlayerMock,
  stackedStateMock,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import {
  OPPONENT_BOARD_ID,
  OPPONENT_DECK_ID,
  OPPONENT_DISCARD_ID,
  OPPONENT_HAND_ID,
  PLAYER_BOARD_ID,
  PLAYER_DECK_ID,
  PLAYER_DISCARD_ID,
  PLAYER_HAND_ID,
} from 'src/shared/testIds'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

describe('Bottom (Player) Side', () => {
  it('should show player info', () => {
    const { getByRole } = renderWithProviders(
      <PlayerField playerId={playerId} />,
      {
        preloadedState,
      },
    )

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(
      `${stackedPlayerMock.name} / ${stackedPlayerMock.coins} (+${stackedPlayerMock.income})`,
    )
  })

  it('should show player stacks', () => {
    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <PlayerField playerId={playerId} />,
      {
        preloadedState,
      },
    )

    expect(getByTestId(PLAYER_DECK_ID)?.children).toHaveLength(
      stackedPlayerMock.deck.length,
    )
    expect(getByTestId(PLAYER_HAND_ID)?.children).toHaveLength(
      stackedPlayerMock.hand.length,
    )
    expect(getByTestId(PLAYER_BOARD_ID)?.children).toHaveLength(
      stackedPlayerMock.board.length,
    )
    expect(getByTestId(PLAYER_DISCARD_ID)?.children).toHaveLength(
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

  it('should be able to browse deck and discard stacks', () => {
    const { getByTestId, dispatchSpy } = renderWithProviders(
      <PlayerField playerId={playerId} />,
      {
        preloadedState,
      },
    )

    const deck = getByTestId(PLAYER_DECK_ID)
    const discard = getByTestId(PLAYER_DISCARD_ID)

    fireEvent.click(deck)

    expect(dispatchSpy).toHaveBeenCalledWith(setBrowsedStack('deck'))

    fireEvent.click(discard)

    expect(dispatchSpy).toHaveBeenCalledWith(setBrowsedStack('discard'))
  })

  it('should be able to redraw a card', () => {
    preloadedState.duel.phase = 'Redrawing'

    const { getByText, dispatchSpy } = renderWithProviders(
      <PlayerField playerId={playerId} />,
      {
        preloadedState,
      },
    )

    const redrawnCard = stackedPlayerMock.cards[stackedPlayerMock.hand[0]]

    fireEvent.click(getByText(redrawnCard.name))

    expect(dispatchSpy).toHaveBeenCalledWith(
      putACardAtBottomOfDeck({
        cardId: redrawnCard.id,
        playerId,
      }),
    )
    expect(dispatchSpy).toHaveBeenCalledWith(drawACardFromDeck({ playerId }))
    expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw({ playerId }))
  })

  it('should be able to play a card', () => {
    const { getByText, dispatchSpy } = renderWithProviders(
      <PlayerField playerId={playerId} />,
      {
        preloadedState,
      },
    )

    const playedCard = stackedPlayerMock.cards[stackedPlayerMock.hand[0]]

    fireEvent.click(getByText(playedCard.name))

    expect(dispatchSpy).toHaveBeenCalledWith(
      playCard({ cardId: playedCard.id, playerId, shouldPay: true }),
    )
  })
})

describe('Top (Opponent) Side', () => {
  it('should show opponent stacks', () => {
    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <PlayerField playerId={playerId} isOnTop />,
      {
        preloadedState,
      },
    )

    expect(getByTestId(OPPONENT_DECK_ID)?.children).toHaveLength(
      stackedPlayerMock.deck.length,
    )
    expect(getByTestId(OPPONENT_HAND_ID)?.children).toHaveLength(
      stackedPlayerMock.hand.length,
    )
    expect(getByTestId(OPPONENT_BOARD_ID)?.children).toHaveLength(
      stackedPlayerMock.board.length,
    )
    expect(getByTestId(OPPONENT_DISCARD_ID)?.children).toHaveLength(
      stackedPlayerMock.discard.length,
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
