import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from 'src/utils/test-utils'
import { Card } from './Card'
import { mockCard } from './mocks'

describe('Card Component', () => {
  it('should display all shared UI segments of a card when face up', async () => {
    render(<Card card={mockCard} />)

    expect(await screen.queryByText(mockCard.name)).toBeInTheDocument()
    expect(await screen.queryByText(mockCard.strength)).toBeInTheDocument()
  })

  it('should card back when face down', async () => {
    render(<Card card={mockCard} isFaceDown />)

    expect(await screen.queryByText(mockCard.name)).not.toBeInTheDocument()
    expect(await screen.queryByText(mockCard.strength)).not.toBeInTheDocument()
  })

  it('should fire on click event passing card id', async () => {
    const onCardClick = jest.fn()

    render(<Card card={mockCard} onClick={onCardClick} />)

    await userEvent.click(screen.getByText(mockCard.name))

    expect(onCardClick).toHaveBeenCalledWith(mockCard.id)
  })
})
