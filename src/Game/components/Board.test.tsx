import '@testing-library/jest-dom'
import { render, screen } from 'src/utils/test-utils'
import { Board } from './Board'
import { baseGameMockedState } from './mocks'

describe('Board Component', () => {
  it('should show all UI elements', async () => {
    const { topPlayer, bottomPlayer } = baseGameMockedState.game

    render(<Board shouldDisableOverlay />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByText(topPlayer.name)).toBeInTheDocument()
    expect(await screen.queryByText(bottomPlayer.name)).toBeInTheDocument()
  })
})
