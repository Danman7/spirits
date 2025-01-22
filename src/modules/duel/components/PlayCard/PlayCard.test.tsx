import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'
import { RootState } from 'src/app/store'
import { PlayCard } from 'src/modules/duel/components'
import {
  agentAttack,
  completeRedraw,
  discardCard,
  drawCardFromDeck,
  moveToNextAttackingAgent,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/modules/duel/slice'
import {
  opponentId,
  playerId,
  stackedPlayerMock,
  stackedStateMock,
} from 'src/shared/__mocks__'
import { TICK } from 'src/shared/constants'
import { renderWithProviders } from 'src/shared/rtlRender'
import { CARD_TEST_ID } from 'src/shared/testIds'
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
  expect(getByText(mockCard.description[0])).toBeInTheDocument()
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

it('should trigger attacking from bottom animation', async () => {
  preloadedState.duel.attackingAgentId = mockCard.id

  const { getByTestId, dispatchSpy } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      playerId={playerId}
      stack="board"
    />,
    {
      preloadedState,
    },
  )

  fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${mockCard.id}`))

  await act(async () => {
    await new Promise((r) => setTimeout(r, TICK))
  })

  expect(dispatchSpy).toHaveBeenCalledWith(
    agentAttack({
      defendingAgentId: preloadedState.duel.players[opponentId].board[0],
      defendingPlayerId: opponentId,
    }),
  )
  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextAttackingAgent())
})

it('should trigger attacking from top animation', async () => {
  preloadedState.duel.attackingAgentId = mockCard.id

  const { getByTestId, dispatchSpy } = renderWithProviders(
    <PlayCard
      cardId={stackedPlayerMock.hand[0]}
      isOnTop
      playerId={playerId}
      stack="board"
    />,
    {
      preloadedState,
    },
  )

  fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${mockCard.id}`))

  await act(async () => {
    await new Promise((r) => setTimeout(r, TICK))
  })

  expect(dispatchSpy).toHaveBeenCalledWith(
    agentAttack({
      defendingAgentId: preloadedState.duel.players[opponentId].board[0],
      defendingPlayerId: opponentId,
    }),
  )
  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextAttackingAgent())
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
