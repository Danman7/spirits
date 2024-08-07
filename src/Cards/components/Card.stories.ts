import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Card } from './Card'
import { mockCard } from '../../utils/mocks'
import {
  ElevatedAcolyte,
  GarrettMasterThief,
  HammeriteNovice,
  ViktoriaThiefPawn
} from '../AllCards'
import { createPlayCardFromPrototype } from '../utils'

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

export const IsPlayable: Story = {
  args: {
    card: mockCard,
    isPlayable: true,
    onClick: fn()
  }
}

export const Boosted: Story = {
  args: {
    card: { ...mockCard, strength: (mockCard.strength as number) + 2 },
    isPlayable: true,
    onClick: fn()
  }
}

export const Damaged: Story = {
  args: {
    card: {
      ...createPlayCardFromPrototype(ElevatedAcolyte),
      strength: (ElevatedAcolyte.strength as number) - 1
    },
    isPlayable: true,
    onClick: fn()
  }
}

export const OrderCard: Story = {
  args: {
    card: createPlayCardFromPrototype(HammeriteNovice)
  }
}

export const ShadowCard: Story = {
  args: {
    card: createPlayCardFromPrototype(GarrettMasterThief)
  }
}

export const MultipleFactions: Story = {
  args: {
    card: createPlayCardFromPrototype(ViktoriaThiefPawn)
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
    card: createPlayCardFromPrototype(HammeriteNovice),
    onClick: undefined,
    isFaceDown: true
  }
}

export const ShadowFaceDown: Story = {
  args: {
    card: createPlayCardFromPrototype(GarrettMasterThief),
    onClick: undefined,
    isFaceDown: true
  }
}
