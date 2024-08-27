import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'

import Board from 'src/Game/components/Board'
import { reducer } from 'src/shared/redux/reducer'
import { mockState } from 'src/shared/__mocks__/state'

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
          preloadedState: mockState
        })}
      >
        {story()}
      </Provider>
    )
  ]
}
