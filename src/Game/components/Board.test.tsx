import '@testing-library/jest-dom'
import { render, screen } from 'src/utils/test-utils'
import { Board } from './Board'
import { baseGameMockedState } from './mocks'
import { userEvent } from '@storybook/test'
import {
  endTurnMessage,
  passButtonMessage,
  playerFirstMessage
} from '../messages'
import { act } from 'react'

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

    const { hand, coins } = bottomPlayer

    const { name, cost } = hand[0]

    render(<Board shouldDisableOverlay />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByText(passButtonMessage)).toBeInTheDocument()

    await act(async () => {
      await userEvent.click(screen.getByText(name))
    })

    expect(await screen.queryByText(coins - cost)).toBeInTheDocument()

    expect(await screen.queryByText(endTurnMessage)).toBeInTheDocument()
  })

  it('should be able to end the turn', async () => {
    render(<Board shouldDisableOverlay />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByRole('button')).toBeInTheDocument()

    await act(async () => {
      await userEvent.click(screen.getByText(passButtonMessage))
    })

    expect(await screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
