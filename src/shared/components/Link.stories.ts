import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Link from 'src/shared/components/Link'

const meta = {
  title: 'Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'This is a link',
    onClick: fn(),
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
