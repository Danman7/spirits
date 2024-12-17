import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'

import { BookOfAsh, BrotherSachelman } from 'src/features/cards/CardBases'
import { Card } from 'src/features/cards/components/Card'
import { TICK } from 'src/shared/constants'
import { renderWithProviders } from 'src/shared/rtlRender'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { createDuelCard, joinCardCategories } from 'src/shared/utils'

const mockCard = createDuelCard(BrotherSachelman)

it('should display all UI segments of a card when face up', () => {
  const { rerender, getByRole, getByText } = renderWithProviders(
    <Card card={mockCard} />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${mockCard.strength}`,
  )
  expect(getByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()
  expect(getByText(joinCardCategories(mockCard.categories))).toBeInTheDocument()
  expect(getByText(mockCard.description[0])).toBeInTheDocument()
  expect(getByText(mockCard.flavor as string)).toBeInTheDocument()

  const boostedStrength = mockCard.strength + 2

  rerender(<Card card={{ ...mockCard, strength: boostedStrength }} />)

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${boostedStrength}`,
  )

  const damagedStrength = mockCard.strength - 2

  rerender(<Card card={{ ...mockCard, strength: damagedStrength }} />)

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${damagedStrength}`,
  )
})

it('should show card back when face down', () => {
  const { queryByText } = renderWithProviders(
    <Card card={mockCard} isFaceDown />,
  )

  expect(queryByText(mockCard.name)).not.toBeInTheDocument()
})

it('should fire on click event passing card', () => {
  const onCardClick = jest.fn()

  const { getByText } = renderWithProviders(
    <Card card={mockCard} onClickCard={onCardClick} />,
  )

  fireEvent.click(getByText(mockCard.name))

  expect(onCardClick).toHaveBeenCalledWith(mockCard)
})

it('should trigger attacking from bottom animation', async () => {
  const onAttackAnimationEnd = jest.fn()

  const { getByTestId } = renderWithProviders(
    <Card
      card={mockCard}
      isAttacking
      onAttackAnimationEnd={onAttackAnimationEnd}
    />,
  )

  fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${mockCard.id}`))

  await act(async () => {
    await new Promise((r) => setTimeout(r, TICK))
  })

  expect(onAttackAnimationEnd).toHaveBeenCalled()
})

it('should trigger attacking from top animation', async () => {
  const onAttackAnimationEnd = jest.fn()

  const { getByTestId } = renderWithProviders(
    <Card
      card={mockCard}
      isAttacking
      onAttackAnimationEnd={onAttackAnimationEnd}
      isOnTop
    />,
  )

  fireEvent.animationEnd(getByTestId(`${CARD_TEST_ID}${mockCard.id}`))

  await act(async () => {
    await new Promise((r) => setTimeout(r, TICK))
  })

  expect(onAttackAnimationEnd).toHaveBeenCalled()
})

it('should display no strength for an instant', () => {
  const { getByRole } = renderWithProviders(
    <Card card={createDuelCard(BookOfAsh)} />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${BookOfAsh.name}`,
  )
})
