export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

export const coinToss = () => (Math.random() < 0.5 ? true : false)

export const getRandomArrayItem = <T>(array: T[]) =>
  array.length ? array[Math.floor(Math.random() * array.length)] : null
