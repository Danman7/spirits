import '@testing-library/jest-dom'
import { BookOfAsh, BrotherSachelman } from 'src/shared/CardBases'
import { Card } from 'src/shared/components'
import { renderWithProviders } from 'src/shared/rtlRender'
import { joinCardCategories } from 'src/shared/utils'

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
  const { getByRole } = renderWithProviders(<Card card={BookOfAsh} />)

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${BookOfAsh.name}`,
  )
})
