import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from 'src/Game/messages'
import { getOverlayMessage, getPlayableCards } from 'src/Game/GameUtils'
import { MockPlayer1 } from 'src/shared/__mocks__/players'

describe('Game utils', () => {
  it('should return the correct overlay message', () => {
    expect(getOverlayMessage(true, true)).toBe(playerFirstMessage)
    expect(getOverlayMessage(false, true)).toBe(opponentFirstMessage)
    expect(getOverlayMessage(true, false)).toBe(yourTurnMessage)
    expect(getOverlayMessage(false, false)).toBe(opponentTurnMessage)
  })

  it('should return all playable cards for a given player', () => {
    expect(getPlayableCards(MockPlayer1)).toHaveLength(2)
    expect(getPlayableCards({ ...MockPlayer1, coins: 2 })).toHaveLength(1)
    expect(getPlayableCards({ ...MockPlayer1, coins: 1 })).toEqual([
      MockPlayer1.hand[0]
    ])
    expect(getPlayableCards({ ...MockPlayer1, coins: 0 })).toHaveLength(0)
  })
})
