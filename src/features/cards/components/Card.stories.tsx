import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
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
import { createDuelCard } from 'src/shared/utils'

const mockCard = createDuelCard(Haunt)

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component:
          'The Card is the fundamental shared component of this project. It has a wide range of UI elements and animations but is controlled solely by props and doesn’t contact the store directly. It also only takes a single onClick and animationEnd for sync purposes.',
      },
    },
  },
  args: {
    card: mockCard,
    onClickCard: undefined,
    isFaceDown: false,
    isSmall: false,
    isAttacking: false,
    isOnTop: false,
  },
  argTypes: {
    card: {
      description:
        'This is a whole DuelCard object that is used to control what and how the component displays. Changes in strength trigger boost and damage animations.',
    },
    isFaceDown: {
      description: 'Determines which side of the card is up.',
    },
    isSmall: {
      description: 'Controls weather to show on board smaller style.',
    },
    isAttacking: {
      description: 'Controls weather to show attacking animation.',
    },
    isOnTop: {
      description: 'Controls the direction of the attacking animation.',
    },
    onClickCard: {
      control: 'radio',
      options: [undefined, 'has onClickCard'],
      description:
        'A callback function for the card’s onClick. If this is defined it also triggers the isActive card animation.',
    },
    onAttackAnimationEnd: {
      description: 'A callback function for the when attack animation is done.',
    },
  },
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
