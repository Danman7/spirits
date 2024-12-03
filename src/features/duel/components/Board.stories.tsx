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
} from 'src/features/cards/CardBases'
import Board from 'src/features/duel/components/Board'
import { initialState } from 'src/features/duel/slice'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__'
import { normalizePlayerCards } from 'src/shared/utils'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'This is the main component for dueling (single and multi-player) that displays both player’s card stack and gameplay UI. It takes no properties as it gets all information from the app store and distributes it to the nested children.',
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
          duel: {
            ...initialState,
            turn: 1,
            activePlayerId: MockPlayer1.id,
            players: {
              [MockPlayer1.id]: {
                ...MockPlayer1,
                ...normalizePlayerCards({
                  deck: [TempleGuard, TempleGuard, ElevatedAcolyte],
                  hand: [BrotherSachelman, ElevatedAcolyte],
                  board: [HammeriteNovice, HammeriteNovice],
                }),
              },
              [MockPlayer2.id]: {
                ...MockPlayer2,
                ...normalizePlayerCards({
                  deck: [Zombie, Haunt, AzaranTheCruel],
                  hand: [Haunt],
                  board: [Zombie],
                }),
              },
            },
            playerOrder: [MockPlayer2.id, MockPlayer1.id],
            phase: 'Player Turn',
            loggedInPlayerId: MockPlayer1.id,
          },
        })}
      >
        {story()}
      </Provider>
    ),
  ],
}
