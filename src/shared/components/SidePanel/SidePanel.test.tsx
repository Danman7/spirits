import { SidePanel } from 'src/shared/components/SidePanel/SidePanel'
import { render } from 'src/shared/test/render'
import { PANEL_TEST_ID } from 'src/shared/test/testIds'

const content = 'Side panel content'

const defaultProps = { isOpen: true, children: content }

it('should show panel when open', () => {
  const { getByText } = render(<SidePanel {...defaultProps} />)

  expect(getByText(content)).toBeTruthy()
})

it('should hide panel after animations are complete', async () => {
  const { fireEvent, rerender, queryByText, getByTestId, waitFor } = render(
    <SidePanel {...defaultProps} />,
  )

  rerender(<SidePanel {...defaultProps} isOpen={false} />)

  fireEvent.animationEnd(getByTestId(PANEL_TEST_ID))

  await waitFor(() => {
    expect(queryByText(content)).not.toBeTruthy()
  })
})
