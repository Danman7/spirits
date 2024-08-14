import '@testing-library/jest-dom'

import userEvent from '@testing-library/user-event'
import { render, screen } from '../../utils/test-utils'
import { Card } from './Card'
import { mockCard } from '../../utils/mocks'
import { joinCardTypes } from '../utils'

describe('Card Component', () => {
  it('should display all shared UI segments of a card when face up', async () => {
    render(<Card card={mockCard} />)

    expect(await screen.queryByText(mockCard.name)).toBeInTheDocument()

    expect(
      await screen.queryByText(`Cost: ${mockCard.cost}`)
    ).toBeInTheDocument()

    expect(
      await screen.queryByText(mockCard.strength as number)
    ).toBeInTheDocument()

    expect(
      await screen.queryByText(joinCardTypes(mockCard.types))
    ).toBeInTheDocument()

    expect(
      await screen.queryByText(mockCard.description as string)
    ).toBeInTheDocument()

    expect(
      await screen.queryByText(mockCard.flavor as string)
    ).toBeInTheDocument()
  })

  it('should card back when face down', async () => {
    render(<Card card={mockCard} isFaceDown />)

    expect(await screen.queryByText(mockCard.name)).not.toBeInTheDocument()
    expect(
      await screen.queryByText(mockCard.strength as number)
    ).not.toBeInTheDocument()
  })

  it('should fire on click event passing card id', async () => {
    const onCardClick = jest.fn()

    render(<Card card={mockCard} onClick={onCardClick} />)

    await userEvent.click(screen.getByText(mockCard.name))

    expect(onCardClick).toHaveBeenCalledWith(mockCard.id)
  })

  // it('should trigger boost animation if card is boosted', async () => {
  //   const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch')

  //   const { rerender } = render(<Card card={mockCard} />)

  //   rerender(
  //     <Card
  //       card={{ ...mockCard, strength: (mockCard.strength as number) + 1 }}
  //     />
  //   )

  //   expect(useDispatchSpy).toHaveBeenCalledWith(mockCard.id)
  // })
})
