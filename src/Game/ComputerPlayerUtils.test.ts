import { MockPlayer1, MockPlayer2 } from 'src/utils/mocks'
import { compPlayRandomCard, compPlayTurn } from './ComputerPlayerUtils'
import { GarrettMasterThief, ViktoriaThiefPawn } from 'src/Cards/AllCards'
import { PlayCard } from 'src/Cards/types'
import { createPlayCardFromPrototype } from 'src/Cards/utils'

describe('Computer Player utils', () => {
  it('should be able to play a random card from hand within budget', () => {
    const mockPlayCard = jest.fn()

    const mockPlayer = { ...MockPlayer1, coins: 2 }

    const playedCard = compPlayRandomCard(mockPlayer, mockPlayCard) as PlayCard

    expect(mockPlayer.hand).toContain(playedCard)
    expect(playedCard.cost).toBeLessThanOrEqual(mockPlayer.coins)
    expect(mockPlayCard).toHaveBeenCalledWith(playedCard.id)
  })

  it('should not play a card if it doesn not have enough coins', () => {
    const mockPlayCard = jest.fn()

    const mockPlayer = {
      ...MockPlayer1,
      hand: [
        createPlayCardFromPrototype(ViktoriaThiefPawn),
        createPlayCardFromPrototype(GarrettMasterThief)
      ],
      coins: 3
    }

    expect(compPlayRandomCard(mockPlayer, mockPlayCard)).toBeNull()
  })

  it('should be able to play computer turn', () => {
    const mockPlayCard = jest.fn()
    const mockEndTurn = jest.fn()

    const mockPlayer = { ...MockPlayer2, coins: 2 }

    compPlayTurn(mockPlayer, mockPlayCard, mockEndTurn)

    expect(mockPlayCard).toHaveBeenCalledWith(mockPlayer.hand[0].id)
    expect(mockEndTurn).toHaveBeenCalled()
  })
})
