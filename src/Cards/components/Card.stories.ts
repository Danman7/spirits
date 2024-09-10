import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Card from 'src/Cards/components/Card'
import {
  ElevatedAcolyte,
  GarrettMasterThief,
  HammeriteNovice,
  Haunt,
  ViktoriaThiefPawn
} from 'src/Cards/CardPrototypes'
import { PlayCard } from 'src/Cards/CardTypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'

const mockCard: PlayCard = createPlayCardFromPrototype(Haunt)

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
    animate: 'default',
    onClickCard: undefined
  },
  argTypes: {
    animate: {
      control: 'select',
      options: ['normal', 'small', 'active']
    }
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallerVariant: Story = {
  args: {
    card: { ...mockCard },
    animate: 'small'
  }
}

export const IsActive: Story = {
  args: {
    onClickCard: fn(),
    animate: 'active'
  }
}

export const Boosted: Story = {
  args: {
    card: { ...mockCard, strength: mockCard.strength + 2 }
  }
}

export const Damaged: Story = {
  args: {
    card: {
      ...createPlayCardFromPrototype(ElevatedAcolyte),
      strength: ElevatedAcolyte.strength - 1
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
