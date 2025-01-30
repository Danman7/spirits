import { fireEvent, waitFor } from '@testing-library/dom'
import { RootState } from 'src/app/store'
import { PlayCard } from 'src/modules/duel/components'
import {
  completeRedraw,
  discardCard,
  drawCardFromDeck,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/modules/duel/slice'
import {
  playerId,
  stackedPlayerMock,
  stackedStateMock,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone, joinCardCategories } from 'src/shared/utils'

const mockCard =
  stackedStateMock.duel.players[playerId].cards[
    stackedStateMock.duel.players[playerId].hand[0]
  ]

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

it('should display all UI segments of a card when face up', () => {
  const { getByRole, getByText } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="hand"
    />,
    {
      preloadedState,
    },
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${mockCard.strength}`,
  )
  expect(getByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()
  expect(getByText(joinCardCategories(mockCard.categories))).toBeInTheDocument()
  expect(getByText((mockCard.description as string[])[0])).toBeInTheDocument()
  expect(getByText(mockCard.flavor as string)).toBeInTheDocument()
})

it('should flip card between faces', async () => {
  const { rerender, getByText, queryByText } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="hand"
    />,
    {
      preloadedState,
    },
  )

  expect(getByText(mockCard.name)).toBeInTheDocument()

  rerender(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      stack="deck"
      playerId={playerId}
    />,
  )

  await waitFor(() => {
    expect(queryByText(mockCard.name)).not.toBeInTheDocument()
  })

  rerender(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="hand"
    />,
  )

  expect(getByText(mockCard.name)).toBeInTheDocument()
})

it('should be able to redraw', () => {
  preloadedState.duel.phase = 'Redrawing'

  const { getByText, dispatchSpy } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="hand"
    />,
    {
      preloadedState,
    },
  )

  fireEvent.click(getByText(mockCard.name))

  expect(dispatchSpy).toHaveBeenCalledWith(
    putCardAtBottomOfDeck({
      cardId: mockCard.id,
      playerId,
    }),
  )
  expect(dispatchSpy).toHaveBeenCalledWith(drawCardFromDeck(playerId))
  expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw(playerId))
})

it('should be able to be played if within budget', () => {
  const { getByText, dispatchSpy } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="hand"
    />,
    {
      preloadedState,
    },
  )

  fireEvent.click(getByText(mockCard.name))

  expect(dispatchSpy).toHaveBeenCalledWith(
    playCard({ cardId: mockCard.id, playerId, shouldPay: true }),
  )
})

it('should not be able to be played if outside budget', () => {
  preloadedState.duel.players[playerId].coins = 1

  const { getByText, dispatchSpy } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="hand"
    />,
    {
      preloadedState,
    },
  )

  fireEvent.click(getByText(mockCard.name))

  expect(dispatchSpy).not.toHaveBeenCalled()
})

it('should discard card if strength is 0 or below', () => {
  preloadedState.duel.players[playerId].cards[
    preloadedState.duel.players[playerId].board[0]
  ].strength = 0

  const { dispatchSpy } = renderWithProviders(
    <PlayCard
      cardId={preloadedState.duel.players[playerId].board[0]}
      playerId={playerId}
      stack="board"
    />,
    {
      preloadedState,
    },
  )

  expect(dispatchSpy).toHaveBeenCalledWith(
    discardCard({
      cardId: preloadedState.duel.players[playerId].board[0],
      playerId,
    }),
  )
})
