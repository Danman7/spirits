import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'

export const playerFirstMessage = 'You go first!'
export const opponentFirstMessage = 'Your opponent goes first!'

export const yourTurnTitle = "It's your turn!"
export const yourTurnMessage =
  'You can click a card to play it, or pass the turn to your opponent.'
export const opponentTurnTitle = "It's your opponent's turn!"

export const redrawMessage =
  'You may click a card to put it from your hand at the bottom of your deck, then draw another one from the top.'
export const initialDrawMessage = `The game begins. Both players draw ${INITIAL_CARD_DRAW_AMOUNT} cards.`

export const passButtonMessage = 'Pass'
export const skipRedrawMessage = 'Skip Redraw'
