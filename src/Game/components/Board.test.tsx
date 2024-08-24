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
import { MockCPUPlayer } from '../../utils/mocks'
import { MainState } from '../../state/StateTypes'
import { createPlayCardFromPrototype } from '../../Cards/CardUtils'
import { BrotherSachelman, HammeriteNovice } from '../../Cards/AllCards'
import { BROTHER_SACHELMAN_BOOST } from '../../Cards/constants'

describe('Board Component', () => {
  it('should show the initial UI elements', () => {
    const { topPlayer, bottomPlayer } = baseGameMockedState.game

    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(screen.queryByText(topPlayer.name)).toBeInTheDocument()
    expect(screen.queryByText(bottomPlayer.name)).toBeInTheDocument()

    expect(screen.queryByText(topPlayer.coins)).toBeInTheDocument()
    expect(screen.queryByText(bottomPlayer.coins)).toBeInTheDocument()
  })

  it('should show overlay', () => {
    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(screen.queryByText(playerFirstMessage)).toBeInTheDocument()
  })

  it('should be able to play a card from hand', () => {
    const { bottomPlayer } = baseGameMockedState.game

    const { coins } = bottomPlayer

    const { name, cost } = bottomPlayer.hand[0]

    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(screen.queryByText(passButtonMessage)).toBeInTheDocument()

    fireEvent.click(screen.getByText(name))

    expect(screen.queryByText(coins - cost)).toBeInTheDocument()

    expect(screen.queryByText(endTurnMessage)).toBeInTheDocument()
  })

  it('should be able to end the turn', () => {
    render(<Board />, {
      preloadedState: baseGameMockedState
    })

    expect(screen.queryByRole('button')).toBeInTheDocument()

    fireEvent.click(screen.getByText(passButtonMessage))

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should play a card as CPU and end the turn', async () => {
    render(<Board />, {
      preloadedState: {
        ...baseGameMockedState,
        game: { ...baseGameMockedState.game, topPlayer: MockCPUPlayer }
      }
    })

    const playedCPUCard = MockCPUPlayer.hand[0]

    expect(screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

    fireEvent.click(screen.getByText(passButtonMessage))

    expect(screen.queryByText(opponentTurnMessage)).toBeInTheDocument()

    await waitFor(
      async () =>
        expect(
          await screen.queryByText(opponentTurnMessage)
        ).not.toBeInTheDocument(),
      {
        timeout: 3000
      }
    )

    expect(screen.queryByText(playedCPUCard.name)).toBeInTheDocument()
  })

  it('should play a card witn an on play ability', () => {
    const playedCard = createPlayCardFromPrototype(BrotherSachelman)

    const mockState: MainState = {
      ...baseGameMockedState,
      game: {
        ...baseGameMockedState.game,
        bottomPlayer: {
          ...baseGameMockedState.game.bottomPlayer,
          hand: [playedCard],
          board: [
            createPlayCardFromPrototype(HammeriteNovice),
            createPlayCardFromPrototype(HammeriteNovice)
          ]
        }
      }
    }

    render(<Board />, {
      preloadedState: mockState
    })

    expect(screen.queryAllByText(HammeriteNovice.name)).toHaveLength(2)

    fireEvent.click(screen.getByText(playedCard.name))

    expect(
      screen.queryAllByText(
        (HammeriteNovice.strength as number) + BROTHER_SACHELMAN_BOOST
      )
    ).toHaveLength(2)
  })
})
