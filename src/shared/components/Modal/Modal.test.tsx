import { Modal } from 'src/shared/components'
import { render } from 'src/shared/test/render'
import { MODAL_TEST_ID, OVERLAY_TEST_ID } from 'src/shared/test/testIds'

const content = 'Modal content'

const defaultProps = { isOpen: true, children: content }

it('should show modal when open', () => {
  const { getByText } = render(<Modal {...defaultProps} />)

  expect(getByText(content)).toBeTruthy()
})

it('should fire onClosingComplete', async () => {
  const onClosingComplete = jest.fn()

  const { fireEvent, waitFor, rerender, queryByText, getByTestId } = render(
    <Modal {...defaultProps} onClosingComplete={onClosingComplete} />,
  )

  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  rerender(
    <Modal
      {...defaultProps}
      isOpen={false}
      onClosingComplete={onClosingComplete}
    />,
  )

  fireEvent.animationEnd(getByTestId(MODAL_TEST_ID))
  fireEvent.animationEnd(getByTestId(OVERLAY_TEST_ID))

  await waitFor(() => {
    expect(queryByText(content)).not.toBeTruthy()
  })

  expect(onClosingComplete).toHaveBeenCalled()
})
