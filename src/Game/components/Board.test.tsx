import '@testing-library/jest-dom'

import Board from 'src/Game/components/Board'
import {
  endTurnMessage,
  opponentTurnMessage,
  passButtonMessage,
  playerFirstMessage
} from 'src/Game/messages'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { BrotherSachelman, HammeriteNovice } from 'src/Cards/CardPrototypes'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { fireEvent, render, screen, waitFor } from 'src/shared/utils/test-utils'
import { baseGameMockedState } from 'src/shared/__mocks__/state'
import { MockCPUPlayer } from 'src/shared/__mocks__/players'
import { MainState } from 'src/shared/redux/StateTypes'
import { GameState } from 'src/Game/GameTypes'

const baseGameState = baseGameMockedState.game

describe('Board Component', () => {
  it('should show the initial UI elements', () => {
    const { topPlayer, bottomPlayer } = baseGameState

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
    const { bottomPlayer } = baseGameState

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
        game: { ...baseGameState, topPlayer: MockCPUPlayer }
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

    const gameState: GameState = {
      ...baseGameState,
      bottomPlayer: {
        ...baseGameState.bottomPlayer,
        hand: [playedCard],
        board: [
          createPlayCardFromPrototype(HammeriteNovice),
          createPlayCardFromPrototype(HammeriteNovice)
        ]
      }
    }

    const mockState: MainState = {
      ...baseGameMockedState,
      game: gameState
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
