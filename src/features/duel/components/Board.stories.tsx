import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import type { Meta, StoryObj } from '@storybook/react'

import Board from 'src/features/duel/components/Board'
import { initialState } from 'src/features/duel/slice'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'
import {
  AzaranTheCruel,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie
} from 'src/features/cards/CardPrototypes'
import { DuelPhase } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { storeConfiguration } from 'src/app/store'

const meta = {
  title: 'Board',
  component: Board,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Board>

export default meta
type Story = StoryObj<typeof meta>

const guard1 = createPlayCardFromPrototype(TempleGuard)
const guard2 = createPlayCardFromPrototype(TempleGuard)
const acolyte1 = createPlayCardFromPrototype(ElevatedAcolyte)
const acolyte2 = createPlayCardFromPrototype(ElevatedAcolyte)
const novice1 = createPlayCardFromPrototype(HammeriteNovice)
const novice2 = createPlayCardFromPrototype(HammeriteNovice)
const brother = createPlayCardFromPrototype(BrotherSachelman)
const zombie1 = createPlayCardFromPrototype(Zombie)
const zombie2 = createPlayCardFromPrototype(Zombie)
const haunt1 = createPlayCardFromPrototype(Haunt)
const haunt2 = createPlayCardFromPrototype(Haunt)
const azaran = createPlayCardFromPrototype(AzaranTheCruel)

export const Default: Story = {
  decorators: [
    story => (
      <Provider
        store={configureStore({
          ...storeConfiguration,
          preloadedState: {
            duel: {
              turn: 1,
              players: {
                [MockPlayer1.id]: {
                  ...MockPlayer1,
                  isActive: true,
                  cards: {
                    [guard1.id]: guard1,
                    [guard2.id]: guard2,
                    [acolyte1.id]: acolyte1,
                    [acolyte2.id]: acolyte2,
                    [novice1.id]: novice1,
                    [novice2.id]: novice2,
                    [brother.id]: brother
                  },
                  deck: [guard1.id, guard2.id, acolyte1.id],
                  hand: [brother.id, acolyte2.id],
                  board: [novice1.id, novice2.id]
                },
                [MockPlayer2.id]: {
                  ...MockPlayer2,
                  cards: {
                    [zombie1.id]: zombie1,
                    [zombie2.id]: zombie2,
                    [haunt1.id]: haunt1,
                    [haunt2.id]: haunt2,
                    [azaran.id]: azaran
                  },
                  deck: [zombie1.id, haunt1.id, azaran.id],
                  hand: [haunt2.id],
                  board: [zombie2.id]
                }
              },
              playerOrder: [MockPlayer2.id, MockPlayer1.id],
              phase: DuelPhase.PLAYER_TURN,
              loggedInPlayerId: initialState.loggedInPlayerId
            }
          }
        })}
      >
        {story()}
      </Provider>
    )
  ]
}
