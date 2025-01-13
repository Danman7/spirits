import '@testing-library/jest-dom'

import { BookOfAsh, BrotherSachelman } from 'src/features/cards/CardBases'
import { Card } from 'src/features/cards/components/Card'
import { joinCardCategories } from 'src/features/cards/utils'
import { createDuelCard } from 'src/features/duel/utils'
import { renderWithProviders } from 'src/shared/rtlRender'

const mockCard = BrotherSachelman

it('should display all UI segments of a card when face up', () => {
  const { getByRole, getByText } = renderWithProviders(<Card card={mockCard} />)

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${mockCard.strength}`,
  )
  expect(getByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()
  expect(getByText(joinCardCategories(mockCard.categories))).toBeInTheDocument()
  expect(getByText(mockCard.description[0])).toBeInTheDocument()
  expect(getByText(mockCard.flavor as string)).toBeInTheDocument()
})

it('should display no strength for an instant', () => {
  const { getByRole } = renderWithProviders(
    <Card card={createDuelCard(BookOfAsh)} />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${BookOfAsh.name}`,
  )
})
