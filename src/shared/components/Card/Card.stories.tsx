import type { Meta, StoryObj } from '@storybook/react'
import { Card } from 'src/shared/components'
import {
  AzaranTheCruel,
  BookOfAsh,
  CardBases,
  GarrettMasterThief,
  HammeriteNovice,
  Haunt,
  HighPriestMarkander,
  ViktoriaThiefPawn,
} from 'src/shared/data'

const meta = {
  title: 'Card',
  component: Card,
  tags: ['Common', 'Stateless'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This is the project’s fundamental stateless component. It is used on various modules to display both static reference cards and dynamically updated instances of card bases. Its only mandatory properties are a unique id and a card base name which is used to find the prototype from which this instance was made. It also takes an array of optional properties which potentially control its animation and styles. The Card doesn’t contact the store, so it is usually paired with a stateful wrapper on the various modules.',
      },
    },
  },
  args: {
    card: Haunt,
    id: 'unique-id',
    isFaceDown: false,
    isSmall: false,
    isAttacking: false,
    isAttackingFromAbove: false,
    onClick: undefined,
  },
  argTypes: {
    card: {
      options: Object.values(CardBases),
      description:
        'If this component is to display a dynamic instance of a Card, it must know the difference between its base and current stats.',
    },
    id: {
      description:
        'A unique id must be provided for unique keys of child elements.',
    },
    isFaceDown: {
      description: 'Controls whether the face or back of the card is visible.',
    },
    isSmall: {
      description:
        'Cards in certain stacks should be smaller than regular size.',
    },
    isAttacking: {
      description:
        'Controls whether the attacking animation is triggered. It runs only one cycle.',
    },
    isAttackingFromAbove: {
      description:
        'If a card is on the top player’s board, its attack animation is different.',
    },
    onClick: {
      description:
        'An optional onClick function that determines if the isActive styles apply.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'An example of a non-unique agent card from the Chaos faction.',
      },
    },
  },
}

export const FaceDown: Story = {
  args: {
    isFaceDown: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'When a card should be face down only its back is displayed.',
      },
    },
  },
}

export const SmallVariant: Story = {
  args: {
    isSmall: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'When in some stacks a card should be smaller in size.',
      },
    },
  },
}

export const Active: Story = {
  args: {
    onClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'I a card has a defined onClick property its isActive animation applies.',
      },
    },
  },
}

export const UniqueAgent: Story = {
  args: {
    card: AzaranTheCruel,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Unique cards have a different border. A deck could only include a single copy of unique cards.',
      },
    },
  },
}

export const Instant: Story = {
  args: {
    card: BookOfAsh,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Instants have no strength. They are played, have some effect, and are immediately removed from the board.',
      },
    },
  },
}

export const OrderCard: Story = {
  args: {
    card: HighPriestMarkander,
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of an Order faction card.',
      },
    },
  },
}

export const ShadowCard: Story = {
  args: {
    card: GarrettMasterThief,
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of an Shadow faction card.',
      },
    },
  },
}

export const MultipleFactions: Story = {
  args: {
    card: ViktoriaThiefPawn,
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of a multi-factions card.',
      },
    },
  },
}

export const BoostedAgent: Story = {
  args: {
    card: { ...Haunt, strength: Haunt.strength + 1 },
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of an agent with more strength that its base.',
      },
    },
  },
}

export const DamagedAgent: Story = {
  args: {
    card: { ...HammeriteNovice, strength: HammeriteNovice.strength - 1 },
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of an agent with less strength that its base.',
      },
    },
  },
}
