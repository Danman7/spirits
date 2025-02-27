import { App } from 'src/App'
import { initialDrawMessage } from 'src/modules/duel/components/DuelModal/messages'
import { render } from 'src/shared/test/render'

it('should render the app with user mock', () => {
  const { getByText } = render(<App />)

  expect(getByText(initialDrawMessage)).toBeTruthy()
})
