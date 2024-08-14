import '@testing-library/jest-dom'
import { render, screen } from '../../utils/test-utils'
import { Board } from './Board'
import { baseGameMockedState } from '../../utils/mocks'
import { userEvent } from '@storybook/test'
import {
  endTurnMessage,
  passButtonMessage,
  playerFirstMessage
} from '../messages'
import { act } from 'react'
import { MockCPUPlayer } from '../../utils/mocks'
import { getCardsInHand } from '../utils'

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

    const { coins } = bottomPlayer

    const { name, cost } = getCardsInHand(bottomPlayer)[0]

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

  it('should play a card as CPU and end the turn', async () => {
    render(<Board shouldDisableOverlay />, {
      preloadedState: {
        ...baseGameMockedState,
        game: { ...baseGameMockedState.game, topPlayer: MockCPUPlayer }
      }
    })

    const playedCPUCard = getCardsInHand(MockCPUPlayer)[0]

    expect(await screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

    await act(async () => {
      await userEvent.click(
        screen.getByText(
          getCardsInHand(baseGameMockedState.game.bottomPlayer)[0].name
        )
      )
      await userEvent.click(screen.getByText(passButtonMessage))
    })

    expect(await screen.queryByText(playedCPUCard.name)).toBeInTheDocument()

    expect(await screen.queryByText(passButtonMessage)).toBeInTheDocument()
  })
})
