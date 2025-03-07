import { Board } from 'src/modules/duel/components/Board'
import { initialDrawMessage } from 'src/modules/duel/components/DuelModal/DuelModalMessages'
import { DuelProviderWithMiddleware } from 'src/modules/duel/components/DuelProviderWithMiddleware'
import { render } from 'src/shared/test/TestRender'

it('should render with initial state', () => {
  const { queryByText } = render(
    <DuelProviderWithMiddleware>
      <Board />
    </DuelProviderWithMiddleware>,
  )

  expect(queryByText(initialDrawMessage)).toBeFalsy()
})
