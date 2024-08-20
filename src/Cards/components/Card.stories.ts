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
import { createPlayCardFromPrototype } from '../CardUtils'
import { CardState } from '../CardTypes'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    card: mockCard,
    onClickCard: fn(),
    isFaceDown: false,
    isPlayable: false
  }
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OnTheBoard: Story = {
  args: {
    card: { ...mockCard, state: CardState.OnBoard }
  }
}

export const NotClickable: Story = {
  args: {
    onClickCard: undefined
  }
}

export const IsPlayable: Story = {
  args: {
    isPlayable: true
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

export const ChaosFaceDown: Story = {
  args: {
    onClickCard: undefined,
    isFaceDown: true
  }
}

export const OrderFaceDown: Story = {
  args: {
    card: createPlayCardFromPrototype(HammeriteNovice),
    onClickCard: undefined,
    isFaceDown: true
  }
}

export const ShadowFaceDown: Story = {
  args: {
    card: createPlayCardFromPrototype(GarrettMasterThief),
    onClickCard: undefined,
    isFaceDown: true
  }
}
