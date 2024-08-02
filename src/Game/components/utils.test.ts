import {
  playerFirstMessage,
  opponentFirstMessage,
  yourTurnMessage,
  opponentTurnMessage
} from '../messages'
import { getOverlayMessage } from './utils'

describe('Game components utils', () => {
  it('should return the correct overlay message', () => {
    expect(getOverlayMessage(true, true)).toBe(playerFirstMessage)
    expect(getOverlayMessage(false, true)).toBe(opponentFirstMessage)
    expect(getOverlayMessage(true, false)).toBe(yourTurnMessage)
    expect(getOverlayMessage(false, false)).toBe(opponentTurnMessage)
  })
})
