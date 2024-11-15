import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Provider } from 'react-redux'
import store from 'src/app/store'
import {
  AzaranTheCruel,
  BookOfAsh,
  ElevatedAcolyte,
  GarrettMasterThief,
  HammeriteNovice,
  Haunt,
  ViktoriaThiefPawn,
} from 'src/features/cards/CardBases'
import Card from 'src/features/cards/components/Card'
import { createDuelCard } from 'src/features/cards/utils'

const mockCard = createDuelCard(Haunt)

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
    isAttacking: false,
    isOnTop: false,
  },
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const UniqueAgent: Story = {
  args: {
    card: createDuelCard(AzaranTheCruel),
  },
}

export const Instant: Story = {
  args: {
    card: createDuelCard(BookOfAsh),
  },
}

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
    card: { ...mockCard, strength: mockCard.strength + 2 },
  },
}

const mockAcolyte = createDuelCard(ElevatedAcolyte)

export const Damaged: Story = {
  args: {
    card: {
      ...mockAcolyte,
      strength: mockAcolyte.strength - 1,
    },
  },
}

export const OrderCard: Story = {
  args: {
    card: createDuelCard(HammeriteNovice),
  },
}

export const ShadowCard: Story = {
  args: {
    card: createDuelCard(GarrettMasterThief),
  },
}

export const MultipleFactions: Story = {
  args: {
    card: createDuelCard(ViktoriaThiefPawn),
  },
}

export const FaceDown: Story = {
  args: {
    onClickCard: undefined,
    isFaceDown: true,
  },
}
