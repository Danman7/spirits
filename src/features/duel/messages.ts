import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'

export const redrawingPhaseModalTitle = 'Redrawing Phase'

export const yourTurnTitle = "It's your turn!"
export const yourTurnMessage =
  'You draw a card. Then you can click a card in your hand to play it, or pass.'
export const opponentTurnTitle = "It's your opponent's turn!"
export const opponentTurnMessage =
  'They draw a card, then either play a card from their hand or pass.'

export const redrawMessage =
  'You may replace one card from your hand by clicking on it. You will put it at the bottom of your deck then draw the top card from your deck.'
export const initialDrawMessage = `The game begins. Both players draw ${INITIAL_CARD_DRAW_AMOUNT} cards from their decks into their hands.`

export const passButtonMessage = 'Pass'
export const skipRedrawMessage = 'Skip Redraw'
