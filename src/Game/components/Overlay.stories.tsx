import type { Meta, StoryObj } from '@storybook/react'

import Overlay from 'src/Game/components/Overlay'

const meta = {
  title: 'Overlay',
  component: Overlay,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  args: {
    message: 'Test message'
  }
} satisfies Meta<typeof Overlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
