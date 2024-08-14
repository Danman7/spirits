import { MockPlayer1, MockPlayer2 } from '../utils/mocks'
import { compPlayRandomCard, compPlayTurn } from './ComputerPlayerUtils'
import { GarrettMasterThief, ViktoriaThiefPawn } from '../Cards/AllCards'
import { PlayCard } from '../Cards/types'
import { createPlayCardFromPrototype } from '../Cards/utils'
import { getCardsInHand } from './utils'
import { Player } from './types'

describe('Computer Player utils', () => {
  it('should be able to play a random card from hand within budget', () => {
    const mockPlayCard = jest.fn()

    const mockPlayer = { ...MockPlayer1, coins: 2 }

    const playedCard = compPlayRandomCard(mockPlayer, mockPlayCard) as PlayCard

    expect(getCardsInHand(mockPlayer)).toContain(playedCard)
    expect(playedCard.cost).toBeLessThanOrEqual(mockPlayer.coins)
    expect(mockPlayCard).toHaveBeenCalledWith(playedCard.id)
  })

  it('should not play a card if it doesn not have enough coins', () => {
    const mockPlayCard = jest.fn()

    const mockPlayer: Player = {
      ...MockPlayer1,
      cards: [
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

    expect(mockPlayCard).toHaveBeenCalledWith(getCardsInHand(mockPlayer)[0].id)
    expect(mockEndTurn).toHaveBeenCalled()
  })
})
