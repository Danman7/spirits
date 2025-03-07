import type { Meta, StoryObj } from '@storybook/react'
import {
  initialOpponentMock,
  initialPlayerMock,
  opponentId,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/__mocks__/DuelMocks'
import { Board } from 'src/modules/duel/components/Board'
import { DuelProviderWithMiddleware } from 'src/modules/duel/components/DuelProviderWithMiddleware'
import { DuelState } from 'src/modules/duel/DuelTypes'
import { normalizePlayerCards } from 'src/modules/duel/DuelUtils'
import { UserProvider } from 'src/shared/modules/user/components/UserProvider'

const preloadedDuelState: DuelState = {
  ...stackedDuelStateMock,
  players: {
    [playerId]: {
      ...initialPlayerMock,
      income: 2,
      ...normalizePlayerCards({
        deck: ['HammeriteNovice', 'HighPriestMarkander'],
        hand: ['ElevatedAcolyte', 'YoraSkull'],
        board: ['TempleGuard', 'ElevatedAcolyte'],
        discard: ['BrotherSachelman'],
      }),
    },
    [opponentId]: {
      ...initialOpponentMock,
      ...normalizePlayerCards({
        deck: ['BookOfAsh'],
        hand: ['Haunt', 'ViktoriaThiefPawn'],
        board: ['Zombie', 'Haunt'],
        discard: ['AzaranTheCruel'],
      }),
    },
  },
}

const meta = {
  title: 'Board',
  component: Board,
  tags: ['Duel', 'Stateful'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Board hold all required components to conduct a duel.',
      },
    },
  },
  decorators: [
    (story) => (
      <UserProvider preloadedState={userMock}>
        <DuelProviderWithMiddleware preloadedState={preloadedDuelState}>
          {story()}
        </DuelProviderWithMiddleware>
      </UserProvider>
    ),
  ],
} satisfies Meta<typeof Board>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
