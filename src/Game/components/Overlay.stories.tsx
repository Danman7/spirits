import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'
import { reducer } from 'src/state'
import { Overlay } from './Overlay'
import { baseGameMockedState } from '../../utils/mocks'

const meta = {
  title: 'Overlay',
  component: Overlay,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  args: {
    isAnimated: false
  },
  argTypes: {}
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

export const PlayerFirst: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: baseGameMockedState
        })}
      >
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          {story()}
        </div>
      </Provider>
    )
  ]
}

export const OpponentFirst: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: {
            ...baseGameMockedState,
            game: {
              ...baseGameMockedState.game,
              activePlayerId: baseGameMockedState.game.topPlayer.id
            }
          }
        })}
      >
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          {story()}
        </div>
      </Provider>
    )
  ]
}

export const PlayerTurn: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: {
            ...baseGameMockedState,
            game: {
              ...baseGameMockedState.game,
              turn: 2
            }
          }
        })}
      >
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          {story()}
        </div>
      </Provider>
    )
  ]
}
export const OpponentTurn: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: {
            ...baseGameMockedState,
            game: {
              ...baseGameMockedState.game,
              turn: 2,
              activePlayerId: baseGameMockedState.game.topPlayer.id
            }
          }
        })}
      >
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          {story()}
        </div>
      </Provider>
    )
  ]
}
