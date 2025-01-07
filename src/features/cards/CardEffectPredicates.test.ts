import {
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
} from 'src/features/cards/CardBases'
import {
  BookOfAshPredicate,
  BrotherSachelmanOnPlayPredicate,
  ElevatedAcolytePredicate,
  HammeriteNoviceOnPlayPredicate,
} from 'src/features/cards/CardEffectPredicates'
import { EMPTY_PLAYER } from 'src/features/duel/constants'
import { playCard } from 'src/features/duel/slice'
import { createDuelCard } from 'src/features/duel/utils'
import {
  initialPlayerMock,
  mockRootState,
  playerId,
} from 'src/shared/__mocks__'
import { DuelCard } from 'src/shared/types'

const mockCardId = 'mock-card-id'

const getPlayCardAction = (card?: DuelCard) => ({
  type: playCard.type,
  payload: { cardId: card ? card.id : mockCardId, playerId },
})

const getCurrentState = (card?: DuelCard) => ({
  ...mockRootState,
  duel: {
    ...mockRootState.duel,
    players: card
      ? {
          [playerId]: {
            ...EMPTY_PLAYER,
            cards: {
              [card.id]: card,
            },
          },
        }
      : { [playerId]: initialPlayerMock },
  },
})

it('should trigger BrotherSachelmanOnPlayPredicate accordingly', () => {
  const card = createDuelCard(BrotherSachelman)

  expect(
    BrotherSachelmanOnPlayPredicate(
      getPlayCardAction(card),
      getCurrentState(card),
    ),
  ).toEqual(true)
  expect(
    BrotherSachelmanOnPlayPredicate(getPlayCardAction(), getCurrentState()),
  ).toEqual(false)
})

it('should trigger HammeriteNoviceOnPlayPredicate accordingly', () => {
  const card = createDuelCard(HammeriteNovice)

  expect(
    HammeriteNoviceOnPlayPredicate(
      getPlayCardAction(card),
      getCurrentState(card),
    ),
  ).toEqual(true)
  expect(
    HammeriteNoviceOnPlayPredicate(getPlayCardAction(), getCurrentState()),
  ).toEqual(false)
})

it('should trigger BookOfAshPredicate accordingly', () => {
  const card = createDuelCard(BookOfAsh)

  expect(
    BookOfAshPredicate(getPlayCardAction(card), getCurrentState(card)),
  ).toEqual(true)
  expect(BookOfAshPredicate(getPlayCardAction(), getCurrentState())).toEqual(
    false,
  )
})

it('should trigger ElevatedAcolytePredicate accordingly', () => {
  const card = createDuelCard(ElevatedAcolyte)

  expect(
    ElevatedAcolytePredicate(getPlayCardAction(card), getCurrentState(card)),
  ).toEqual(true)
  expect(
    ElevatedAcolytePredicate(getPlayCardAction(), getCurrentState()),
  ).toEqual(false)
})
