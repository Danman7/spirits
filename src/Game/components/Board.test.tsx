import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '../../utils/test-utils'
import { Board } from './Board'
import { baseGameMockedState } from '../../utils/mocks'
import {
  endTurnMessage,
  opponentTurnMessage,
  passButtonMessage,
  playerFirstMessage
} from '../messages'
import { act } from 'react'
import { MockCPUPlayer } from '../../utils/mocks'

describe('Board Component', () => {
  it('should show the initial UI elements', async () => {
    const { topPlayer, bottomPlayer } = baseGameMockedState.game

    render(<Board />, {
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

    const { name, cost } = bottomPlayer.hand[0]

    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByText(passButtonMessage)).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(screen.getByText(name))
    })

    expect(await screen.queryByText(coins - cost)).toBeInTheDocument()

    expect(await screen.queryByText(endTurnMessage)).toBeInTheDocument()
  })

  it('should be able to end the turn', async () => {
    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByRole('button')).toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(screen.getByText(passButtonMessage))
    })

    expect(await screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should play a card as CPU and end the turn', async () => {
    render(<Board />, {
      preloadedState: {
        ...baseGameMockedState,
        game: { ...baseGameMockedState.game, topPlayer: MockCPUPlayer }
      }
    })

    const playedCPUCard = MockCPUPlayer.hand[0]

    expect(await screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

    await act(async () => {
      await fireEvent.click(screen.getByText(passButtonMessage))
    })

    expect(await screen.queryByText(opponentTurnMessage)).toBeInTheDocument()

    await waitFor(
      async () =>
        expect(
          await screen.queryByText(opponentTurnMessage)
        ).not.toBeInTheDocument(),
      {
        timeout: 3000
      }
    )

    expect(await screen.queryByText(playedCPUCard.name)).toBeInTheDocument()
  })
})
