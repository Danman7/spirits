import type { Meta, StoryObj } from '@storybook/react'
import {
  opponentId,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/__mocks__/duelMocks'
import { Board } from 'src/modules/duel/components/Board'
import { DuelProviderWithMiddleware } from 'src/modules/duel/components/DuelProviderWithMiddleware'
import { normalizeStateCards } from 'src/modules/duel/duelUtils'
import { UserProvider } from 'src/shared/modules/user/components/UserProvider'

const preloadedDuelState = normalizeStateCards(stackedDuelStateMock, {
  [playerId]: {
    deck: ['HammeriteNovice', 'HighPriestMarkander'],
    hand: ['ElevatedAcolyte', 'YoraSkull'],
    board: ['TempleGuard', 'ElevatedAcolyte'],
    discard: ['BrotherSachelman'],
  },
  [opponentId]: {
    deck: ['BookOfAsh'],
    hand: ['Haunt', 'ViktoriaThiefPawn'],
    board: ['Zombie', 'Haunt'],
    discard: ['AzaranTheCruel'],
  },
})

preloadedDuelState.players[playerId].income = 2

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
