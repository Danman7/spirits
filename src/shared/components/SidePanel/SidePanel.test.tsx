import { fireEvent, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { SidePanel } from 'src/shared/components'
import { renderWithProviders } from 'src/shared/rtlRender'
import { PANEL_TEST_ID } from 'src/shared/testIds'

const content = 'Side panel content'

const defaultProps = {
  isOpen: true,
  children: content,
}

it('should show panel when open', () => {
  const { getByText } = renderWithProviders(<SidePanel {...defaultProps} />)

  expect(getByText(content)).toBeInTheDocument()
})

it('should hide panel after animations are complete', async () => {
  const { rerender, queryByText, getByTestId } = renderWithProviders(
    <SidePanel {...defaultProps} />,
  )

  rerender(<SidePanel {...defaultProps} isOpen={false} />)

  fireEvent.animationEnd(getByTestId(PANEL_TEST_ID))

  await waitFor(() => {
    expect(queryByText(content)).not.toBeInTheDocument()
  })
})
