import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'
import { reducer } from 'src/state'
import { Board } from './Board'
import { baseGameMockedState } from './mocks'

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
