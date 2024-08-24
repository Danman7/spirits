import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import { mockCard } from '../../utils/mocks'
import {
  ElevatedAcolyte,
  GarrettMasterThief,
  HammeriteNovice,
  ViktoriaThiefPawn
} from '../AllCards'
import { createPlayCardFromPrototype } from '../CardUtils'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' }
  },
  tags: ['autodocs'],
  args: {
    card: mockCard,
    isFaceDown: false,
    isActive: false,
    isSmaller: false
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallerVariant: Story = {
  args: {
    card: { ...mockCard },
    isSmaller: true
  }
}

export const IsActive: Story = {
  args: {
    isActive: true
  }
}

export const Boosted: Story = {
  args: {
    card: { ...mockCard, strength: (mockCard.strength as number) + 2 }
  }
}

export const Damaged: Story = {
  args: {
    card: {
      ...createPlayCardFromPrototype(ElevatedAcolyte),
      strength: (ElevatedAcolyte.strength as number) - 1
    }
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

export const FaceDown: Story = {
  args: {
    onClickCard: undefined,
    isFaceDown: true
  }
}
