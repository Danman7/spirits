import { App } from 'src/App'
import { initialDrawMessage } from 'src/modules/duel/components/DuelModal/DuelModalMessages'
import { render } from 'src/shared/test/TestRender'

it('should render the app with user mock', () => {
  const { getByText } = render(<App />)

  expect(getByText(initialDrawMessage)).toBeTruthy()
})
