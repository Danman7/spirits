import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Link } from 'src/shared/components'

const meta = {
  title: 'Link',
  component: Link,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A general link component with primary color.',
      },
    },
  },

  args: {
    children: 'This is a link',
    onClick: fn(),
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
