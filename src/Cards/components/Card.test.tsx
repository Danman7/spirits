import '@testing-library/jest-dom'

import Card from 'src/Cards/components/Card'
import { createPlayCardFromPrototype, joinCardTypes } from 'src/Cards/CardUtils'
import { fireEvent, render, screen } from 'src/shared/utils/test-utils'
import { BrotherSachelman } from 'src/Cards/CardPrototypes'
import { PlayCard } from 'src/Cards/CardTypes'

const mockCard: PlayCard = createPlayCardFromPrototype(BrotherSachelman)

it('should display all shared UI segments of a card when face up', () => {
  render(<Card card={mockCard} />)

  expect(screen.queryByText(mockCard.name)).toBeInTheDocument()

  expect(screen.queryByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()

  expect(screen.queryByText(mockCard.strength as number)).toBeInTheDocument()

  expect(screen.queryByText(joinCardTypes(mockCard.types))).toBeInTheDocument()

  expect(screen.queryByText(mockCard.description as string)).toBeInTheDocument()

  expect(screen.queryByText(mockCard.flavor as string)).toBeInTheDocument()
})

it('should card back when face down', () => {
  render(<Card card={mockCard} isFaceDown />)

  expect(screen.queryByText(mockCard.name)).not.toBeInTheDocument()
  expect(
    screen.queryByText(mockCard.strength as number)
  ).not.toBeInTheDocument()
})

it('should fire on click event passing card id', () => {
  const onCardClick = jest.fn()

  render(<Card card={mockCard} onClickCard={onCardClick} />)

  fireEvent.click(screen.getByText(mockCard.name))

  expect(onCardClick).toHaveBeenCalledWith(mockCard)
})
