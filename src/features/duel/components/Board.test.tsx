import '@testing-library/jest-dom'

import Board from 'src/features/duel/components/Board'
import {
  initialDrawMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import {
  fireEvent,
  render,
  screen,
  cleanup,
  waitFor,
} from 'src/shared/test-utils'
import { DuelState } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'

import { RootState } from 'src/app/store'
import {
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'

const haunt = createPlayCardFromPrototype(Haunt)
const book = createPlayCardFromPrototype(BookOfAsh)
const brother = createPlayCardFromPrototype(BrotherSachelman)
const novice = createPlayCardFromPrototype(HammeriteNovice)

const mockPlayers: DuelState['players'] = {
  [MockPlayer2.id]: {
    ...MockPlayer2,
    cards: {
      [haunt.id]: haunt,
      [book.id]: book,
    },
    deck: [],
    hand: [haunt.id],
    discard: [book.id],
  },
  [MockPlayer1.id]: {
    ...MockPlayer1,
    isActive: true,
    cards: {
      [brother.id]: brother,
      [novice.id]: novice,
    },
    deck: [],
    hand: [brother.id],
    discard: [novice.id],
  },
}

const mockGameState: DuelState = {
  turn: 1,
  players: mockPlayers,
  playerOrder: [MockPlayer2.id, MockPlayer1.id],
  phase: 'Player Turn',
  loggedInPlayerId: MockPlayer1.id,
}

let preloadedState: RootState

beforeEach(() => {
  preloadedState = { duel: { ...mockGameState } }
})

afterEach(() => {
  cleanup()
})

test('show the general UI elements', () => {
  render(<Board />, {
    preloadedState,
  })

  const { players, playerOrder } = preloadedState.duel

  const playerInfos = screen.getAllByRole('heading', { level: 2 })

  playerInfos.forEach((element, index) => {
    expect(element).toHaveTextContent(
      `${players[playerOrder[index]].name} / ${players[playerOrder[index]].coins}`,
    )
  })
})

test('initial draw of cards', () => {
  preloadedState.duel.phase = 'Initial Draw'

  render(<Board />, {
    preloadedState,
  })

  const { players, playerOrder } = preloadedState.duel

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    `${players[playerOrder[0]].name} vs ${players[playerOrder[1]].name}`,
  )

  expect(screen.getByText(initialDrawMessage)).toBeInTheDocument()
})

test('redraw a card', async () => {
  const zombie1 = createPlayCardFromPrototype(Zombie)
  const zombie2 = createPlayCardFromPrototype(Zombie)
  const acolyte = createPlayCardFromPrototype(ElevatedAcolyte)
  const novice2 = createPlayCardFromPrototype(HammeriteNovice)
  const guard = createPlayCardFromPrototype(TempleGuard)

  preloadedState.duel.phase = 'Redrawing Phase'
  preloadedState.duel.players = {
    [MockPlayer2.id]: {
      ...mockPlayers[MockPlayer2.id],
      cards: {
        ...mockPlayers[MockPlayer2.id].cards,
        [zombie1.id]: zombie1,
        [zombie2.id]: zombie2,
      },
      isReady: true,
      hand: [...mockPlayers[MockPlayer2.id].hand, zombie1.id, zombie2.id],
    },
    [MockPlayer1.id]: {
      ...mockPlayers[MockPlayer1.id],
      cards: {
        ...mockPlayers[MockPlayer1.id].cards,
        [novice2.id]: novice2,
        [guard.id]: guard,
        [acolyte.id]: acolyte,
      },
      deck: [acolyte.id],
      hand: [...mockPlayers[MockPlayer1.id].hand, novice2.id, guard.id],
    },
  }

  render(<Board />, {
    preloadedState,
  })

  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
    'Redrawing Phase',
  )

  expect(screen.getByText(redrawMessage)).toBeInTheDocument()

  expect(screen.getByRole('button')).toHaveTextContent(skipRedrawMessage)

  fireEvent.click(screen.getByText(guard.name))

  expect(screen.getByText(ElevatedAcolyte.name)).toBeInTheDocument()

  expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
})

test('skip redraw', async () => {
  preloadedState.duel.phase = 'Redrawing Phase'
  preloadedState.duel.players = {
    [MockPlayer2.id]: {
      ...mockPlayers[MockPlayer2.id],
      isReady: true,
    },
    [MockPlayer1.id]: {
      ...mockPlayers[MockPlayer1.id],
    },
  }

  render(<Board />, {
    preloadedState,
  })

  fireEvent.click(screen.getByRole('button'))

  expect(await screen.findByText(yourTurnTitle)).toBeInTheDocument()
})

test('play a card from hand', async () => {
  const { players } = preloadedState.duel

  const activePlayer = players[MockPlayer1.id]

  const playedCard = activePlayer.cards[activePlayer.hand[0]]

  render(<Board />, {
    preloadedState,
  })

  expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()

  expect(screen.getByRole('button')).toHaveTextContent(passButtonMessage)

  fireEvent.click(screen.getByText(playedCard.name))

  const playerInfos = screen.getAllByRole('heading', { level: 2 })

  expect(playerInfos[1]).toHaveTextContent(
    `${activePlayer.name} / ${activePlayer.coins - playedCard.cost}`,
  )

  expect(screen.getByText(opponentTurnTitle)).toBeInTheDocument()

  expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
    `${playedCard.name}${playedCard.strength}`,
  )
})

test('pass the turn', () => {
  render(<Board />, {
    preloadedState,
  })

  expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()

  fireEvent.click(screen.getByRole('button'))

  expect(screen.getByText(opponentTurnTitle)).toBeInTheDocument()

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('play a card as CPU and end the turn', async () => {
  preloadedState.duel.players = {
    [MockPlayer2.id]: { ...mockPlayers[MockPlayer2.id], isCPU: true },
    [MockPlayer1.id]: mockPlayers[MockPlayer1.id],
  }

  render(<Board />, {
    preloadedState,
  })

  const cpuPlayer = preloadedState.duel.players[MockPlayer2.id]
  const playedCPUCard = cpuPlayer.cards[cpuPlayer.hand[0]]

  expect(screen.queryByText(playedCPUCard.name)).not.toBeInTheDocument()

  fireEvent.click(screen.getByText(passButtonMessage))

  expect(screen.getByText(opponentTurnTitle)).toBeInTheDocument()

  await waitFor(
    () => {
      expect(screen.getByText(playedCPUCard.name)).toBeInTheDocument()
    },
    { timeout: 3000 },
  )

  await waitFor(
    () => {
      expect(screen.getByText(yourTurnTitle)).toBeInTheDocument()
    },
    { timeout: 3000 },
  )
})
