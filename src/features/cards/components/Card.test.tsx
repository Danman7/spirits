import '@testing-library/jest-dom'

import Card from 'src/features/cards/components/Card'
import {
  createPlayCardFromPrototype,
  joinCardTypes,
} from 'src/features/cards/utils'
import { BrotherSachelman } from 'src/features/cards/CardPrototypes'
import { PlayCard } from 'src/features/cards/types'

import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from 'src/shared/test-utils'

const mockCard: PlayCard = createPlayCardFromPrototype(BrotherSachelman)

it('should display all shared UI segments of a card when face up', () => {
  const { rerender } = render(<Card card={mockCard} />)

  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${mockCard.strength}`,
  )

  expect(screen.getByText(`Cost: ${mockCard.cost}`)).toBeInTheDocument()

  expect(screen.getByRole('heading', { level: 5 })).toHaveTextContent(
    joinCardTypes(mockCard.types),
  )

  expect(screen.getByText(mockCard.description as string)).toBeInTheDocument()

  expect(screen.getByText(mockCard.flavor as string)).toBeInTheDocument()

  const boostedStrength = mockCard.strength + 2

  rerender(<Card card={{ ...mockCard, strength: boostedStrength }} />)

  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${boostedStrength}`,
  )

  const damagedStrength = mockCard.strength - 2

  rerender(<Card card={{ ...mockCard, strength: damagedStrength }} />)

  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${damagedStrength}`,
  )
})

it('should show card back when face down', async () => {
  const { rerender } = render(<Card card={mockCard} animate="faceDown" />)

  rerender(<Card card={mockCard} animate="normal" />)

  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    `${mockCard.name}${mockCard.strength}`,
  )

  rerender(<Card card={mockCard} animate="faceDown" />)

  await waitForElementToBeRemoved(() => screen.queryByText(mockCard.name))

  expect(await screen.queryByText(mockCard.name)).not.toBeInTheDocument()
})

it('should fire on click event passing card id', () => {
  const onCardClick = jest.fn()

  render(<Card card={mockCard} onClickCard={onCardClick} />)

  fireEvent.click(screen.getByText(mockCard.name))

  expect(onCardClick).toHaveBeenCalledWith(mockCard.id)
})
