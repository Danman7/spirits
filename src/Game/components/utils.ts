export const getOverlayMessage = (
  isPlayerTurn: boolean,
  isFirstTurn: boolean
): string => {
  if (isPlayerTurn && isFirstTurn) {
    return 'You go first!'
  }

  if (!isPlayerTurn && isFirstTurn) {
    return 'Your opponent goes first!'
  }

  if (isPlayerTurn && !isFirstTurn) {
    return "It's your turn!"
  }

  return "It's your opponent's turn!"
}
