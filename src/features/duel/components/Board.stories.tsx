import type { Meta, StoryObj } from '@storybook/react'
import { Provider } from 'react-redux'
import { setupStore } from 'src/app/store'
import {
  AzaranTheCruel,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie,
} from 'src/shared/CardBases'
import { Board } from 'src/features/duel/components/Board'
import { initialState } from 'src/features/duel/slice'
import {
  initialPlayerMock,
  initialOpponentMock,
  userMock,
} from 'src/shared/__mocks__'
import { normalizePlayerCards } from 'src/features/duel/utils'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'This is the main component for dueling (single and multi-player) that displays both player’s card stacks and gameplay UI. It takes no properties as it gets all information from the app store and distributes it to the nested children.',
      },
    },
  },
} satisfies Meta<typeof Board>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (story) => (
      <Provider
        store={setupStore({
          user: userMock,
          duel: {
            ...initialState,
            activePlayerId: initialPlayerMock.id,
            players: {
              [initialPlayerMock.id]: {
                ...initialPlayerMock,
                ...normalizePlayerCards({
                  deck: [TempleGuard, TempleGuard, ElevatedAcolyte],
                  hand: [BrotherSachelman, ElevatedAcolyte],
                  board: [HammeriteNovice, HammeriteNovice],
                }),
              },
              [initialOpponentMock.id]: {
                ...initialOpponentMock,
                ...normalizePlayerCards({
                  deck: [Zombie, Haunt, AzaranTheCruel],
                  hand: [Haunt],
                  board: [Zombie],
                }),
              },
            },
            phase: 'Player Turn',
          },
        })}
      >
        {story()}
      </Provider>
    ),
  ],
}
