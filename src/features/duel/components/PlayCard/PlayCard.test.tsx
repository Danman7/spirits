import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'
import { RootState } from 'src/app/store'
import { PlayCard } from 'src/features/duel/components'
import {
  agentAttack,
  completeRedraw,
  discardCard,
  drawCardFromDeck,
  moveToNextAttackingAgent,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import {
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
  const { rerender, getByRole, getByText } = renderWithProviders(
    <PlayCard card={mockCard} player={stackedPlayerMock} stack="hand" />,
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

  const boostedStrength = mockCard.strength + 2

  rerender(
    <PlayCard
      card={{ ...mockCard, strength: boostedStrength }}
      player={stackedPlayerMock}
      stack="hand"
    />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${boostedStrength}`,
  )

  const damagedStrength = mockCard.strength - 2

  rerender(
    <PlayCard
      card={{ ...mockCard, strength: damagedStrength }}
      player={stackedPlayerMock}
      stack="hand"
    />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${damagedStrength}`,
  )
})

it('should flip card between faces', async () => {
  const { rerender, getByText, queryByText } = renderWithProviders(
    <PlayCard card={mockCard} player={stackedPlayerMock} stack="hand" />,
    {
      preloadedState,
    },
  )

  expect(getByText(mockCard.name)).toBeInTheDocument()

  rerender(<PlayCard card={mockCard} stack="deck" player={stackedPlayerMock} />)

  await waitFor(() => {
    expect(queryByText(mockCard.name)).not.toBeInTheDocument()
  })

  rerender(<PlayCard card={mockCard} player={stackedPlayerMock} stack="hand" />)

  expect(getByText(mockCard.name)).toBeInTheDocument()
})

it('should be able to redraw', () => {
  preloadedState.duel.phase = 'Redrawing'

  const { getByText, dispatchSpy } = renderWithProviders(
    <PlayCard card={mockCard} player={stackedPlayerMock} stack="hand" />,
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
    <PlayCard card={mockCard} player={stackedPlayerMock} stack="hand" />,
    {
      preloadedState,
    },
  )

  fireEvent.click(getByText(mockCard.name))

  expect(dispatchSpy).toHaveBeenCalledWith(
    playCard({ cardId: mockCard.id, playerId }),
  )
})

it('should not be able to be played if outside budget', () => {
  const { getByText, dispatchSpy } = renderWithProviders(
    <PlayCard
      card={mockCard}
      player={{ ...stackedPlayerMock, coins: 1 }}
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
    <PlayCard card={mockCard} player={stackedPlayerMock} stack="board" />,
    {
      preloadedState,
    },
  )

  fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${mockCard.id}`))

  await act(async () => {
    await new Promise((r) => setTimeout(r, TICK))
  })

  expect(dispatchSpy).toHaveBeenCalledWith(agentAttack())
  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextAttackingAgent())
})

it('should trigger attacking from top animation', async () => {
  preloadedState.duel.attackingAgentId = mockCard.id

  const { getByTestId, dispatchSpy } = renderWithProviders(
    <PlayCard
      card={mockCard}
      isOnTop
      player={stackedPlayerMock}
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

  expect(dispatchSpy).toHaveBeenCalledWith(agentAttack())
  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextAttackingAgent())
})

it('should discard card if strength is 0 or below', () => {
  const { dispatchSpy } = renderWithProviders(
    <PlayCard
      card={{ ...mockCard, strength: 0 }}
      player={stackedPlayerMock}
      stack="board"
    />,
    {
      preloadedState,
    },
  )

  expect(dispatchSpy).toHaveBeenCalledWith(
    discardCard({ cardId: mockCard.id, playerId }),
  )
})
