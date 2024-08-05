import '@testing-library/jest-dom'
import { render, screen } from 'src/utils/test-utils'
import { baseGameMockedState } from './mocks'
import { Overlay } from './Overlay'
import { opponentFirstMessage, playerFirstMessage } from '../messages'
import { MockPlayer1 } from 'src/utils/mocks'

describe('Overlay component', () => {
  it('should show the correct message when player is first', async () => {
    render(<Overlay isAnimated={false} />, {
      preloadedState: baseGameMockedState
    })

    expect(await screen.queryByText(playerFirstMessage)).toBeInTheDocument()
  })

  it('should show the correct message when opponent is first', async () => {
    render(<Overlay />, {
      preloadedState: {
        ...baseGameMockedState,
        game: {
          ...baseGameMockedState.game,
          activePlayerId: MockPlayer1.id
        }
      }
    })

    expect(await screen.queryByText(opponentFirstMessage)).toBeInTheDocument()
  })
})
