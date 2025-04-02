import { fireEvent } from '@testing-library/dom'

import { AnimatedNumber } from 'src/shared/components'
import { render } from 'src/shared/test/render'

it('should show changes in value', () => {
  const value = 3
  const update = 4

  const { getByText, rerender, queryByText } = render(
    <AnimatedNumber value={value} />,
  )

  rerender(<AnimatedNumber value={update} />)

  const differenceElement = getByText(`+${update - value}`)

  expect(getByText(update)).toBeTruthy()
  expect(differenceElement).toBeTruthy()

  fireEvent.animationEnd(differenceElement)

  expect(queryByText(`+${update - value}`)).not.toBeTruthy()
})
