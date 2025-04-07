import { SidePanel } from 'src/shared/components/SidePanel/SidePanel'
import { render } from 'src/shared/test/render'

const content = 'Side panel content'

const defaultProps = { isOpen: false, children: content }

it('should not show panel when closed', () => {
  const { queryByText } = render(<SidePanel {...defaultProps} />)

  expect(queryByText(content)).toBeFalsy()
})

it('should show panel when open', () => {
  const { getByText } = render(<SidePanel {...defaultProps} isOpen />)

  expect(getByText(content)).toBeTruthy()
})
