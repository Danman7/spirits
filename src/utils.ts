export const getRandomItemFromArray = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) {
    return undefined // Return undefined if array is empty
  }
  const randomIndex = Math.floor(Math.random() * arr.length) // Generate random index
  return arr[randomIndex] // Return item at random index
}
