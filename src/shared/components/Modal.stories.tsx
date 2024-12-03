import type { Meta, StoryObj } from '@storybook/react'

import Link from 'src/shared/components/Link'
import { Modal } from 'src/shared/components/Modal'

const meta = {
  title: 'Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'This is a generic centrally positioned modal with a semi-transparent overlay beneath it. Its appearance and disappearance are animated. It can take any valid ReactNode as children.',
      },
    },
  },
  decorators: [
    (story) => <div style={{ width: '100%', height: '100vh' }}>{story()}</div>,
  ],
  args: {
    isOpen: true,
    children: 'Testing modal message',
  },
  argTypes: {
    isOpen: {
      description:
        'Controls whether the modal should be shown or hidden. Internal state syncs this with the animations.',
    },
    children: {
      description: 'Determines what is shown inside the modal box.',
    },
    onClosingComplete: {
      description:
        'An optional callback for after the modal closure animation is complete.',
    },
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const StringContent: Story = {}

export const NodeContent: Story = {
  args: {
    children: (
      <>
        <h1>This is a test</h1>
        <p>You can put any ReactNode as Modal content.</p>
        <Link onClick={() => {}}>A link</Link>
      </>
    ),
  },
}
