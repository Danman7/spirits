import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from 'src/Game/messages'
import { getOverlayMessage, getPlayableCards } from 'src/Game/GameUtils'
import { mockBudgetPlayer } from 'src/shared/__mocks__/players'

it('should return the correct overlay message', () => {
  expect(getOverlayMessage(true, true)).toBe(playerFirstMessage)
  expect(getOverlayMessage(false, true)).toBe(opponentFirstMessage)
  expect(getOverlayMessage(true, false)).toBe(yourTurnMessage)
  expect(getOverlayMessage(false, false)).toBe(opponentTurnMessage)
})

it('should return all playable cards for a given player', () => {
  expect(getPlayableCards(mockBudgetPlayer)).toHaveLength(2)
  expect(getPlayableCards({ ...mockBudgetPlayer, coins: 2 })).toHaveLength(1)
  expect(getPlayableCards({ ...mockBudgetPlayer, coins: 1 })).toEqual([
    mockBudgetPlayer.hand[1]
  ])
  expect(getPlayableCards({ ...mockBudgetPlayer, coins: 0 })).toHaveLength(0)
})
