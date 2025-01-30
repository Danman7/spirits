import type { Meta, StoryObj } from '@storybook/react'
import { Card } from 'src/shared/components'

const meta = {
  title: 'Card',
  component: Card,
  tags: ['Common', 'Stateless'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This is the project’s fundamental stateless component. It is used on various modules to display both static reference cards and dynamically updated instances of card bases. Its only mandatory property is a card base name which is used to find the prototype from which this instance was made. It also takes an array of optional properties which potentially control its animation and styles. The Card doesn’t contact the store, so it is usually paired with a stateful wrapper on the various modules.',
      },
    },
  },
  args: {
    baseName: 'Haunt',
    id: '',
    isAttacking: false,
    isFaceDown: false,
    isSmall: false,
    attacksFromAbove: false,
  },
  argTypes: {
    baseName: {
      description:
        'This is the name of the base object this card was created from.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const UniqueAgent: Story = {
  args: {
    baseName: 'AzaranTheCruel',
  },
}

export const Instant: Story = {
  args: {
    baseName: 'BookOfAsh',
  },
}

export const OrderCard: Story = {
  args: {
    baseName: 'HammeriteNovice',
  },
}

export const ShadowCard: Story = {
  args: {
    baseName: 'GarrettMasterThief',
  },
}

export const MultipleFactions: Story = {
  args: {
    baseName: 'ViktoriaThiefPawn',
  },
}
