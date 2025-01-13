import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Provider } from 'react-redux'

import { setupStore } from 'src/app/store'
import { ElevatedAcolyte, Haunt } from 'src/shared/CardBases'
import { PlayCard } from 'src/features/duel/components/PlayCard'
import { createDuelCard } from 'src/features/duel/utils'

const mockCard = createDuelCard(Haunt)
const playerId = 'player'

const meta = {
  title: 'PlayCard',
  component: PlayCard,
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on.*' },
    docs: {
      description: {
        component:
          'The PlayCard is the duel ready version of the basic Card component. It takes a DuelCard instead of a CardBase as data and communicates with the store only via dispatch. It also handles the visual states and animations required in a duel such as being face down or displaying an attack.',
      },
    },
  },
  args: {
    card: mockCard,
    playerId,
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
  },
  decorators: [(story) => <Provider store={setupStore()}>{story()}</Provider>],
} satisfies Meta<typeof PlayCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallerVariant: Story = {
  args: {
    playerId,
    card: { ...mockCard },
    isSmall: true,
  },
}

export const IsActive: Story = {
  args: {
    playerId,
    onClickCard: fn(),
  },
}

export const Boosted: Story = {
  args: {
    playerId,
    card: { ...mockCard, strength: mockCard.strength + 2 },
  },
}

const mockAcolyte = createDuelCard(ElevatedAcolyte)

export const Damaged: Story = {
  args: {
    playerId,
    card: {
      ...mockAcolyte,
      strength: mockAcolyte.strength - 1,
    },
  },
}

export const FaceDown: Story = {
  args: {
    playerId,
    onClickCard: undefined,
    isFaceDown: true,
  },
}
