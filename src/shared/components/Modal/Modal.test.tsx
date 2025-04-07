import { Modal } from 'src/shared/components'
import { render } from 'src/shared/test/render'

const content = 'Modal content'

const defaultProps = { isOpen: true, children: content }

it('should show modal when open', () => {
  const { getByText } = render(<Modal {...defaultProps} />)

  expect(getByText(content)).toBeTruthy()
})
