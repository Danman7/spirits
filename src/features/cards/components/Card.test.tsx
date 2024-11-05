import '@testing-library/jest-dom'
import { BrotherSachelman } from 'src/features/cards/CardPrototypes'
import Card from 'src/features/cards/components/Card'
import { DuelAgent } from 'src/features/cards/types'
import {
  createPlayCardFromPrototype,
  joinCardTypes,
} from 'src/features/cards/utils'
import { fireEvent, render, screen } from 'src/shared/test-utils'

const mockCard = createPlayCardFromPrototype(BrotherSachelman) as DuelAgent

it('should display all shared UI segments of a card when face up', () => {
  const { rerender } = render(<Card card={mockCard} />)

  expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
    `${mockCard.name}${mockCard.strength}`,
  )

  expect(screen.getByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()

  expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(
    joinCardTypes(mockCard.types),
  )

  expect(screen.getByText(mockCard.description[0])).toBeInTheDocument()

  expect(screen.getByText(mockCard.flavor as string)).toBeInTheDocument()

  const boostedStrength = mockCard.strength + 2

  rerender(<Card card={{ ...mockCard, strength: boostedStrength }} />)

  expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
    `${mockCard.name}${boostedStrength}`,
  )

  const damagedStrength = mockCard.strength - 2

  rerender(<Card card={{ ...mockCard, strength: damagedStrength }} />)

  expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
    `${mockCard.name}${damagedStrength}`,
  )
})

it('should show card back when face down', async () => {
  render(<Card card={mockCard} isFaceDown />)

  expect(await screen.queryByText(mockCard.name)).not.toBeInTheDocument()
})

it('should fire on click event passing card id', () => {
  const onCardClick = jest.fn()

  render(<Card card={mockCard} onClickCard={onCardClick} />)

  fireEvent.click(screen.getByText(mockCard.name))

  expect(onCardClick).toHaveBeenCalledWith(mockCard.id)
})
