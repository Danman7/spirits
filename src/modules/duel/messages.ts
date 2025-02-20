import { INITIAL_CARDS_DRAWN_IN_DUEL } from 'src/modules/duel'

// ACTION PANEL
export const redrawingtitle = 'Redrawing Phase'
export const yourTurnTitle = 'Your turn'
export const opponentTurnTitle = "Opponent's turn"
export const yourTurnMessage = 'Play a card or'
export const redrawMessage = 'Click on a card in your hand to replace it or'
export const opponentDecidingMessage = 'Waiting for opponent'
export const passButtonMessage = 'pass.'
export const skipRedrawLinkMessage = 'skip redraw.'

// DUEL MODAL
export const initialDrawMessage = `The duel begins! Both players draw ${INITIAL_CARDS_DRAWN_IN_DUEL} cards.`
export const firstPlayerMessage = 'goes first!'
export const victoryMessage = 'has won the duel!'

// BROWSE STACK MODAL
export const browsingStackModalTitle = 'Browsing your shufled'
export const closeMessage = 'Close'

// ERROR HANDLING
export const invalidFirstPlayerIdError =
  'Invalid firstPlayerId passed to startDuel.'
