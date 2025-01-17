import type { Meta, StoryObj } from '@storybook/react'
import { Provider } from 'react-redux'
import { setupStore } from 'src/app/store'
import { Board } from 'src/features/duel/components/Board'
import { stackedStateMock } from 'src/shared/__mocks__'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'This is the main component for dueling (single and multi-player) that displays both player’s card stacks and gameplay UI. It takes no properties as it gets all information from the app store and distributes it to the nested children.',
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
