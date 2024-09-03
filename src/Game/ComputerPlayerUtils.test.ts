import {
  compPlayRandomCard,
  compPlayTurn,
  compSkipRedraw
} from 'src/Game/ComputerPlayerUtils'
import { Player, PlayerIndex } from 'src/shared/redux/StateTypes'
import {
  GarrettMasterThief,
  HammeriteNovice,
  TempleGuard,
  ViktoriaThiefPawn
} from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { EMPTY_PLAYER } from 'src/Game/constants'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'

const playedCard = createPlayCardFromPrototype(HammeriteNovice)

const mockPlayer: Player = {
  ...EMPTY_PLAYER,
  name: 'CPU Player',
  hand: [createPlayCardFromPrototype(TempleGuard), playedCard],
  coins: 2
}

const playerIndex: PlayerIndex = 1

it('should be able to play a random card from hand within budget', () => {
  const mockDispatch = jest.fn()

  const player: Player = { ...mockPlayer }

  expect(player.board).toHaveLength(0)
  expect(player.hand).toHaveLength(2)

  compPlayRandomCard(player, playerIndex, mockDispatch)

  expect(mockDispatch).toHaveBeenCalledWith(
    GameActions.playCardFromHand({ playedCard, playerIndex })
  )
})

it('should not play a card if it doesn not have enough coins', () => {
  const mockDispatch = jest.fn()

  const player: Player = {
    ...mockPlayer,
    hand: [
      createPlayCardFromPrototype(ViktoriaThiefPawn),
      createPlayCardFromPrototype(GarrettMasterThief)
    ],
    coins: 3
  }

  compPlayRandomCard(player, playerIndex, mockDispatch)

  expect(mockDispatch).not.toHaveBeenCalled()
})

it('should be able to play computer turn', () => {
  const mockDispatch = jest.fn()

  const player: Player = { ...mockPlayer }

  compPlayTurn(player, playerIndex, mockDispatch)

  expect(mockDispatch).toHaveBeenCalledWith(
    GameActions.playCardFromHand({ playedCard, playerIndex })
  )

  expect(mockDispatch).toHaveBeenCalledWith(GameActions.endTurn())
})

it('should be able to skip redraw', () => {
  const mockDispatch = jest.fn()

  compSkipRedraw(playerIndex, mockDispatch)

  expect(mockDispatch).toHaveBeenCalledWith(
    GameActions.completeRedraw(playerIndex)
  )
})
