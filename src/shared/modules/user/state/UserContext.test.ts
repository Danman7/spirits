import { renderHook } from '@testing-library/react'
import { userContextError } from 'src/shared/modules/user/UserMessages'
import { useUser } from 'src/shared/modules/user/state/UserContext'

it('should throw an error when useUser is used outside UserProvider', () => {
  expect(() => {
    renderHook(() => useUser())
  }).toThrow(userContextError)
})
