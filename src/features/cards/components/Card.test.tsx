import '@testing-library/jest-dom'

import Card from 'src/features/cards/components/Card'
import {
  createPlayCardFromPrototype,
  joinCardTypes
} from 'src/features/cards/utils'
import { BrotherSachelman } from 'src/features/cards/CardPrototypes'
import { PlayCard } from 'src/features/cards/types'

import { fireEvent, render, screen, waitFor } from 'src/shared/test-utils'

const mockCard: PlayCard = createPlayCardFromPrototype(BrotherSachelman)

it('should display all shared UI segments of a card when face up', () => {
  const { rerender } = render(<Card card={mockCard} />)

  expect(screen.queryByText(mockCard.name)).toBeInTheDocument()

  expect(screen.queryByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()

  expect(screen.queryByText(mockCard.strength)).toBeInTheDocument()

  expect(screen.queryByText(joinCardTypes(mockCard.types))).toBeInTheDocument()

  expect(screen.queryByText(mockCard.description as string)).toBeInTheDocument()

  expect(screen.queryByText(mockCard.flavor as string)).toBeInTheDocument()

  const boostedStrength = mockCard.strength + 2

  rerender(<Card card={{ ...mockCard, strength: boostedStrength }} />)

  expect(screen.queryByText(boostedStrength)).toBeInTheDocument()

  const damagedStrength = mockCard.strength - 2

  rerender(<Card card={{ ...mockCard, strength: damagedStrength }} />)

  expect(screen.queryByText(damagedStrength)).toBeInTheDocument()
})

it('should show card back when face down', async () => {
  const { rerender } = render(<Card card={mockCard} animate="faceDown" />)

  expect(screen.queryByText(mockCard.name)).not.toBeInTheDocument()

  rerender(<Card card={mockCard} animate="normal" />)

  await waitFor(() =>
    expect(screen.queryByText(mockCard.name)).toBeInTheDocument()
  )

  // rerender(<Card card={mockCard} animate="faceDown" />)
})

it('should fire on click event passing card id', () => {
  const onCardClick = jest.fn()

  render(<Card card={mockCard} onClickCard={onCardClick} />)

  fireEvent.click(screen.getByText(mockCard.name))

  expect(onCardClick).toHaveBeenCalledWith(mockCard)
})
