import { initialDuelStateMock } from 'src/modules/duel/__mocks__'
import { DuelProvider } from 'src/modules/duel/components'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

import { render } from 'src/shared/test/render'

const triggerDispatchLabel = 'Trigger Dispatch'

const Consumer: React.FC = () => {
  const {
    state: { phase },
    dispatch,
  } = useDuel()

  const triggerDispatch = () => dispatch({ type: 'ADVANCE_TURN' })

  return (
    <>
      <p>{phase}</p>
      <button onClick={triggerDispatch}>{triggerDispatchLabel}</button>
    </>
  )
}

it('provides state and dispatches actions', () => {
  const { getByText, queryByText, fireEvent } = render(
    <DuelProvider preloadedState={initialDuelStateMock}>
      <Consumer />
    </DuelProvider>,
  )

  expect(getByText(initialDuelStateMock.phase)).toBeTruthy()

  fireEvent.click(getByText(triggerDispatchLabel))

  expect(queryByText(initialDuelStateMock.phase)).toBeFalsy()
  expect(getByText('Player Turn')).toBeTruthy()
})
