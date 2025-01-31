import type { Meta, StoryObj } from '@storybook/react'
import { Provider } from 'react-redux'
import { setupStore } from 'src/app'
import { Board } from 'src/modules/duel/components'
import { stackedStateMock } from 'src/shared/__mocks__'

const meta = {
  title: 'Board',
  component: Board,
  tags: ['Duel', 'Stateful'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'This is a stateful component that wraps the whole dueling UI. It integrates the two players’ fields with their respective card stacks and the panels that communicate the game’s progress. If a duel is initiated, the Board will handle display and coordination between its children and the store. It is a base component that doesn’t take props, but gets everything from the store.',
      },
    },
  },
} satisfies Meta<typeof Board>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => (
      <Provider store={setupStore(stackedStateMock)}>{story()}</Provider>
    ),
  ],
}
