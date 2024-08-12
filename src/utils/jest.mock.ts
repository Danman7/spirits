jest.mock('animejs', () => {
  const originalModule = jest.requireActual('animejs')

  const mockedLibrary = {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => ({
      play: jest.fn()
    }))
  }

  mockedLibrary.default.remove = jest.fn()

  return mockedLibrary
})
