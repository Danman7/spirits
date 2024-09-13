import { HammeriteNovice, Haunt } from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import {
  generateUUID,
  getCoinsMessage,
  getRandomArrayItem,
  normalizeArrayOfCards,
  normalizeArrayOfPlayers
} from 'src/shared/utils/utils'

it('should generate a UUID', () => {
  expect(generateUUID()).toHaveLength(36)
})

it('should get a random item from an array', () => {
  const array = [1, 2, 3, 4]

  expect(array).toContain(getRandomArrayItem(array))
})

it('should show the proper coins message', () => {
  expect(getCoinsMessage(1)).toBe('1 coin')
  expect(getCoinsMessage(2)).toBe('2 coins')
})

it('should normalize an array of players', () => {
  const normalizedPlayers = normalizeArrayOfPlayers([MockPlayer1, MockPlayer2])

  expect(normalizedPlayers).toEqual({
    [MockPlayer1.id]: MockPlayer1,
    [MockPlayer2.id]: MockPlayer2
  })
})

it('should normalize an array of cards', () => {
  const hammerite = createPlayCardFromPrototype(HammeriteNovice)
  const haunt = createPlayCardFromPrototype(Haunt)

  const normalizedPlayers = normalizeArrayOfCards([hammerite, haunt])

  expect(normalizedPlayers).toEqual({
    [hammerite.id]: hammerite,
    [haunt.id]: haunt
  })
})
