import type { Meta, StoryObj } from '@storybook/react'
import { Provider } from 'react-redux'
import { RootState, setupStore } from 'src/app/store'
import { PlayCard } from 'src/features/duel/components/'
import { CARD_STACKS } from 'src/features/duel/constants'
import { createDuelCard } from 'src/features/duel/utils'
import {
  stackedOpponentMock,
  stackedPlayerMock,
  stackedStateMock,
} from 'src/shared/__mocks__'
import { ElevatedAcolyte, Haunt } from 'src/shared/CardBases'
import { deepClone } from 'src/shared/utils'

const mockCard = createDuelCard(Haunt)

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
    player: stackedOpponentMock,
    stack: 'hand',
    isOnTop: false,
  },
  argTypes: {
    card: {
      description:
        'This is a whole DuelCard object that is used to control what and how the component displays. Changes in strength trigger boost and damage animations.',
    },
    player: {
      description: 'The player controlling the card.',
    },
    stack: {
      control: 'radio',
      options: CARD_STACKS,
      description:
        'A callback function for the card’s onClick. If this is defined it also triggers the isActive card animation.',
    },
    isOnTop: {
      description: 'Controls the direction of the attacking animation.',
    },
  },
  decorators: [
    (story) => (
      <Provider store={setupStore(stackedStateMock)}>{story()}</Provider>
    ),
  ],
} satisfies Meta<typeof PlayCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SmallerVariant: Story = {
  args: {
    stack: 'board',
  },
}

export const IsActive: Story = {
  args: {
    player: stackedPlayerMock,
  },
}

export const IsAttacking: Story = {
  decorators: [
    (story) => {
      const preloadedState: RootState = deepClone(stackedStateMock)
      preloadedState.duel.attackingAgentId = mockCard.id

      return <Provider store={setupStore(preloadedState)}>{story()}</Provider>
    },
  ],
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

export const FaceDown: Story = {
  args: {
    isOnTop: true,
  },
}
