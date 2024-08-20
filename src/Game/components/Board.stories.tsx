import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'
import { reducer } from '../../state'
import { Board } from './Board'
import { baseGameMockedState } from '../../utils/mocks'
import { MockCPUPlayer } from '../../utils/mocks'
import {
  DownwinderThief,
  GarrettMasterThief,
  ViktoriaThiefPawn
} from '../../Cards/AllCards'
import { createPlayCardFromPrototype } from '../../Cards/CardUtils'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  args: {
    shouldDisableOverlay: true
  },
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
          preloadedState: baseGameMockedState
        })}
      >
        {story()}
      </Provider>
    )
  ]
}

export const LimitedBudget: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: {
            ...baseGameMockedState,
            game: {
              ...baseGameMockedState.game,
              bottomPlayer: {
                ...baseGameMockedState.game.bottomPlayer,
                coins: 3,
                hand: [
                  createPlayCardFromPrototype(DownwinderThief),
                  createPlayCardFromPrototype(ViktoriaThiefPawn),
                  createPlayCardFromPrototype(GarrettMasterThief)
                ]
              }
            }
          }
        })}
      >
        {story()}
      </Provider>
    )
  ]
}

export const PlayWithCPU: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          reducer,
          preloadedState: {
            ...baseGameMockedState,
            game: { ...baseGameMockedState.game, topPlayer: MockCPUPlayer }
          }
        })}
      >
        {story()}
      </Provider>
    )
  ]
}
