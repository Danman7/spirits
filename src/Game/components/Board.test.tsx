import '@testing-library/jest-dom'
import { render, screen } from 'src/utils/test-utils'
import { Board } from './Board'
import { baseGameMockedState } from './mocks'
import { userEvent } from '@storybook/test'
import { playerFirstMessage } from '../messages'

describe('Board Component', () => {
  it('should show the initial UI elements', async () => {
    const { topPlayer, bottomPlayer } = baseGameMockedState.game

    render(<Board shouldDisableOverlay />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByText(topPlayer.name)).toBeInTheDocument()
    expect(await screen.queryByText(bottomPlayer.name)).toBeInTheDocument()

    expect(await screen.queryByText(topPlayer.coins)).toBeInTheDocument()
    expect(await screen.queryByText(bottomPlayer.coins)).toBeInTheDocument()
  })

  it('should show overlay', async () => {
    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByText(playerFirstMessage)).toBeInTheDocument()
  })

  it('should be able to play a card from hand', async () => {
    const { bottomPlayer } = baseGameMockedState.game

    render(<Board shouldDisableOverlay />, {
      preloadedState: baseGameMockedState
    })

    await userEvent.click(screen.getByText(bottomPlayer.hand[0].name))
  })
})
