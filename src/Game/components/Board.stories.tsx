import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'

import Board from 'src/Game/components/Board'
import { reducer } from 'src/shared/redux/reducer'
import { initialPlayers } from 'src/shared/__mocks__/state'
import { GamePhase } from 'src/shared/redux/StateTypes'
import { initialState } from 'src/shared/redux/reducers/GameReducer'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Board>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: {
            game: {
              turn: 1,
              players: initialPlayers,
              phase: GamePhase.PLAYER_TURN,
              loggedInPlayerId: initialState.loggedInPlayerId
            }
          }
        })}
      >
        {story()}
      </Provider>
    )
  ]
}
