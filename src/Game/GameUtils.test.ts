import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from './messages'
import {
  getCardsInHand,
  getOverlayMessage,
  getPlayableCards
} from './GameUtils'
import { MockPlayer1 } from '../utils/mocks'

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
      getCardsInHand(MockPlayer1)[0]
    ])
    expect(getPlayableCards({ ...MockPlayer1, coins: 0 })).toHaveLength(0)
  })
})
