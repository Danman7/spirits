import { DUEL_INITIAL_CARDS_DRAWN } from 'src/features/duel/constants'

export const yourTurnTitle = 'Your turn'
export const opponentTurnTitle = "Opponent's turn"
export const yourTurnMessage = 'Play a card or'
export const redrawMessage = 'Click on a card in your hand to replace it or'
export const opponentDecidingMessage = 'Waiting for opponent'
export const playerFirst = 'You go first!'
export const opponentFirst = 'Your opponent goes first!'
export const passButtonMessage = 'pass.'
export const skipRedrawLinkMessage = 'skip redraw.'
export const victoryMessage = 'has won the duel!'
export const closeMessage = 'Close'
export const initialDrawMessage = `The duel begins! Both players draw ${DUEL_INITIAL_CARDS_DRAWN} cards.`

export const invalidFirstPlayerIdError =
  'Invalid firstPlayerId passed to startDuel.'
