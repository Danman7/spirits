import type { Meta, StoryObj } from '@storybook/react'

import {
  AzaranTheCruel,
  BookOfAsh,
  GarrettMasterThief,
  HammeriteNovice,
  Haunt,
  ViktoriaThiefPawn,
} from 'src/features/cards/CardBases'
import { Card } from 'src/features/cards/components/Card'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Card is the fundamental shared component of this project. It displays all the necessary UI parts of a card without any animations or communicating with the store.',
      },
    },
  },
  args: {
    card: Haunt,
  },
  argTypes: {
    card: {
      description:
        'This is a card base object that stores only the required props for creating card instances.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const UniqueAgent: Story = {
  args: {
    card: AzaranTheCruel,
  },
}

export const Instant: Story = {
  args: {
    card: BookOfAsh,
  },
}

export const OrderCard: Story = {
  args: {
    card: HammeriteNovice,
  },
}

export const ShadowCard: Story = {
  args: {
    card: GarrettMasterThief,
  },
}

export const MultipleFactions: Story = {
  args: {
    card: ViktoriaThiefPawn,
  },
}
