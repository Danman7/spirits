import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'

import Board from 'src/Game/components/Board'
import {
  DownwinderThief,
  GarrettMasterThief,
  ViktoriaThiefPawn
} from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { reducer } from 'src/shared/redux/reducer'
import { baseGameMockedState } from 'src/shared/__mocks__/state'
import { MockCPUPlayer } from 'src/shared/__mocks__/players'

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
