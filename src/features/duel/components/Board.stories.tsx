import { Provider } from 'react-redux'
import type { Meta, StoryObj } from '@storybook/react'
import Board from 'src/features/duel/components/Board'
import { initialState } from 'src/features/duel/slice'
import { createDuelCard } from 'src/features/cards/utils'
import {
  AzaranTheCruel,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardPrototypes'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { configureStoreWithPreloadedState } from 'src/app/store'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Board>

export default meta
type Story = StoryObj<typeof meta>

const guard1 = createDuelCard(TempleGuard)
const guard2 = createDuelCard(TempleGuard)
const acolyte1 = createDuelCard(ElevatedAcolyte)
const acolyte2 = createDuelCard(ElevatedAcolyte)
const novice1 = createDuelCard(HammeriteNovice)
const novice2 = createDuelCard(HammeriteNovice)
const brother = createDuelCard(BrotherSachelman)
const zombie1 = createDuelCard(Zombie)
const zombie2 = createDuelCard(Zombie)
const haunt1 = createDuelCard(Haunt)
const haunt2 = createDuelCard(Haunt)
const azaran = createDuelCard(AzaranTheCruel)

export const Default: Story = {
  decorators: [
    (story) => (
      <Provider
        store={configureStoreWithPreloadedState({
          duel: {
            ...initialState,
            turn: 1,
            activePlayerId: MockPlayer1.id,
            players: {
              [MockPlayer1.id]: {
                ...MockPlayer1,
                cards: {
                  [guard1.id]: guard1,
                  [guard2.id]: guard2,
                  [acolyte1.id]: acolyte1,
                  [acolyte2.id]: acolyte2,
                  [novice1.id]: novice1,
                  [novice2.id]: novice2,
                  [brother.id]: brother,
                },
                deck: [guard1.id, guard2.id, acolyte1.id],
                hand: [brother.id, acolyte2.id],
                board: [novice1.id, novice2.id],
              },
              [MockPlayer2.id]: {
                ...MockPlayer2,
                cards: {
                  [zombie1.id]: zombie1,
                  [zombie2.id]: zombie2,
                  [haunt1.id]: haunt1,
                  [haunt2.id]: haunt2,
                  [azaran.id]: azaran,
                },
                deck: [zombie1.id, haunt1.id, azaran.id],
                hand: [haunt2.id],
                board: [zombie2.id],
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
