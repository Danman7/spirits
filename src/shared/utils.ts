export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

export const getRandomArrayItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]

export const getCoinsMessage = (coins: number) =>
  `${coins} ${coins > 1 ? 'coins' : 'coin'}`
