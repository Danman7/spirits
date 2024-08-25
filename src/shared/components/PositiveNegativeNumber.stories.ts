import type { Meta, StoryObj } from '@storybook/react'

import { PositiveNegativeNumber } from 'src/shared/components/PositiveNegativeNumber'

const meta = {
  title: 'PositiveNegativeNumber',
  component: PositiveNegativeNumber,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof PositiveNegativeNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    base: 3,
    current: 3
  }
}

export const Positive: Story = {
  args: {
    base: 3,
    current: 4
  }
}

export const Negative: Story = {
  args: {
    base: 3,
    current: 2
  }
}
