import { renderHook } from '@testing-library/react'
import { useUser } from 'src/shared/modules/user/state/UserContext'

test('useUser throws an error when used outside UserProvider', () => {
  expect(() => {
    renderHook(() => useUser())
  }).toThrow('useUser must be used within a UserProvider')
})
