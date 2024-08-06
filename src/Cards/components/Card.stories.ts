import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Card } from './Card'
import { mockCard } from '../../utils/mocks'
import {
  GarrettMasterThief,
  HammeriteNovice,
  ViktoriaThiefPawn
} from '../AllCards'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: { onClick: fn() }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    card: mockCard,
    onClick: fn()
  }
}

export const NotClickable: Story = {
  args: {
    card: mockCard,
    onClick: undefined
  }
}

export const OrderCard: Story = {
  args: {
    card: { ...HammeriteNovice, id: '1' }
  }
}

export const ShadowCard: Story = {
  args: {
    card: { ...GarrettMasterThief, id: '1' }
  }
}

export const MultipleFactions: Story = {
  args: {
    card: { ...ViktoriaThiefPawn, id: '1' }
  }
}

export const ChaosFaceDown: Story = {
  args: {
    card: mockCard,
    onClick: undefined,
    isFaceDown: true
  }
}

export const OrderFaceDown: Story = {
  args: {
    card: { ...HammeriteNovice, id: '1' },
    onClick: undefined,
    isFaceDown: true
  }
}

export const ShadowFaceDown: Story = {
  args: {
    card: { ...GarrettMasterThief, id: '1' },
    onClick: undefined,
    isFaceDown: true
  }
}
