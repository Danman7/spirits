import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'

import { BookOfAsh, BrotherSachelman } from 'src/features/cards/CardBases'
import { joinCardCategories } from 'src/features/cards/utils'
import { PlayCard } from 'src/features/duel/components/PlayCard'
import { agentAttack, moveToNextAttackingAgent } from 'src/features/duel/slice'
import { createDuelCard } from 'src/features/duel/utils'
import { playerId, stackedPreloadedState } from 'src/shared/__mocks__'
import { TICK } from 'src/shared/constants'
import { renderWithProviders } from 'src/shared/rtlRender'
import { CARD_TEST_ID } from 'src/shared/testIds'

const mockCard = createDuelCard(BrotherSachelman)

it('should display all UI segments of a card when face up', () => {
  const { rerender, getByRole, getByText } = renderWithProviders(
    <PlayCard card={mockCard} playerId={playerId} />,
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
      playerId={playerId}
    />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${boostedStrength}`,
  )

  const damagedStrength = mockCard.strength - 2

  rerender(
    <PlayCard
      card={{ ...mockCard, strength: damagedStrength }}
      playerId={playerId}
    />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${damagedStrength}`,
  )
})

it('should flip card between faces', async () => {
  const { rerender, getByText, queryByText } = renderWithProviders(
    <PlayCard card={mockCard} playerId={playerId} />,
  )

  expect(getByText(mockCard.name)).toBeInTheDocument()

  rerender(<PlayCard card={mockCard} isFaceDown playerId={playerId} />)

  await waitFor(() => {
    expect(queryByText(mockCard.name)).not.toBeInTheDocument()
  })

  rerender(<PlayCard card={mockCard} playerId={playerId} />)

  expect(getByText(mockCard.name)).toBeInTheDocument()
})

it('should fire on click event passing card', () => {
  const onCardClick = jest.fn()

  const { getByText } = renderWithProviders(
    <PlayCard card={mockCard} onClickCard={onCardClick} playerId={playerId} />,
  )

  fireEvent.click(getByText(mockCard.name))

  expect(onCardClick).toHaveBeenCalledWith(mockCard)
})

it('should trigger attacking from bottom animation', async () => {
  const { getByTestId, dispatchSpy } = renderWithProviders(
    <PlayCard card={mockCard} isAttacking playerId={playerId} />,
    {
      preloadedState: stackedPreloadedState,
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
  const { getByTestId, dispatchSpy } = renderWithProviders(
    <PlayCard card={mockCard} isAttacking isOnTop playerId={playerId} />,
    {
      preloadedState: stackedPreloadedState,
    },
  )

  fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${mockCard.id}`))

  await act(async () => {
    await new Promise((r) => setTimeout(r, TICK))
  })

  expect(dispatchSpy).toHaveBeenCalledWith(agentAttack())
  expect(dispatchSpy).toHaveBeenCalledWith(moveToNextAttackingAgent())
})

it('should display no strength for an instant', () => {
  const { getByRole } = renderWithProviders(
    <PlayCard card={createDuelCard(BookOfAsh)} playerId={playerId} />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${BookOfAsh.name}`,
  )
})
