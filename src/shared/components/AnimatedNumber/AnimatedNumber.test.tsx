import { fireEvent } from '@testing-library/dom'
import { AnimatedNumber } from 'src/shared/components/AnimatedNumber/AnimatedNumber'
import { renderWithProviders } from 'src/shared/rtlRender'

it('should show changes in value', () => {
  const value = 3
  const update = 4

  const { getByText, rerender, queryByText } = renderWithProviders(
    <AnimatedNumber value={value} />,
  )

  rerender(<AnimatedNumber value={update} />)

  const differenceElement = getByText(`+ ${update - value}`)

  expect(getByText(update)).toBeInTheDocument()
  expect(differenceElement).toBeInTheDocument()

  fireEvent.animationEnd(differenceElement)

  expect(queryByText(`+ ${update - value}`)).not.toBeInTheDocument()
})
