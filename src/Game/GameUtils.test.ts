import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from 'src/Game/messages'
import { getPlayerTurnModalContent, getPlayableCards } from 'src/Game/GameUtils'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/Game/constants'
import { Player } from 'src/shared/redux/StateTypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { HammeriteNovice, TempleGuard } from 'src/Cards/CardPrototypes'

test('return the correct overlay message for new player turn', () => {
  expect(getPlayerTurnModalContent(true, true)).toBe(playerFirstMessage)
  expect(getPlayerTurnModalContent(false, true)).toBe(opponentFirstMessage)
  expect(getPlayerTurnModalContent(true, false)).toBe(yourTurnMessage)
  expect(getPlayerTurnModalContent(false, false)).toBe(opponentTurnMessage)
})

test('return all playable cards for a given player', () => {
  const mockBudgetPlayer: Player = {
    ...EMPTY_PLAYER,
    id: 'player3',
    name: 'Hume',
    coins: DEFAULT_COINS_AMOUNT,
    hand: [
      createPlayCardFromPrototype(TempleGuard),
      createPlayCardFromPrototype(HammeriteNovice)
    ]
  }

  expect(getPlayableCards(mockBudgetPlayer)).toHaveLength(2)
  expect(getPlayableCards({ ...mockBudgetPlayer, coins: 2 })).toHaveLength(1)
  expect(getPlayableCards({ ...mockBudgetPlayer, coins: 1 })).toEqual([
    mockBudgetPlayer.hand[1]
  ])
  expect(getPlayableCards({ ...mockBudgetPlayer, coins: 0 })).toHaveLength(0)
})
