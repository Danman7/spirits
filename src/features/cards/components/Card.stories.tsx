import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Provider } from 'react-redux'
import { storeConfiguration } from 'src/app/store'
import {
  ElevatedAcolyte,
  GarrettMasterThief,
  HammeriteNovice,
  Haunt,
  ViktoriaThiefPawn,
} from 'src/features/cards/CardPrototypes'
import Card from 'src/features/cards/components/Card'
import { DuelAgent } from 'src/features/cards/types'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'

const mockCard = createPlayCardFromPrototype(Haunt) as DuelAgent

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
  },
  tags: ['autodocs'],
  args: {
    card: mockCard,
    onClickCard: undefined,
    isFaceDown: false,
    isSmall: false,
  },
  decorators: [
    (story) => (
      <Provider store={configureStore(storeConfiguration)}>{story()}</Provider>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallerVariant: Story = {
  args: {
    card: { ...mockCard },
    isSmall: true,
  },
}

export const IsActive: Story = {
  args: {
    onClickCard: fn(),
  },
}

export const Boosted: Story = {
  args: {
    card: { ...mockCard, strength: mockCard.strength + 2 } as DuelAgent,
  },
}

export const Damaged: Story = {
  args: {
    card: {
      ...createPlayCardFromPrototype(ElevatedAcolyte),
      strength: ElevatedAcolyte.strength - 1,
    } as DuelAgent,
  },
}

export const OrderCard: Story = {
  args: {
    card: createPlayCardFromPrototype(HammeriteNovice),
  },
}

export const ShadowCard: Story = {
  args: {
    card: createPlayCardFromPrototype(GarrettMasterThief),
  },
}

export const MultipleFactions: Story = {
  args: {
    card: createPlayCardFromPrototype(ViktoriaThiefPawn),
  },
}

export const FaceDown: Story = {
  args: {
    onClickCard: undefined,
    isFaceDown: true,
  },
}
