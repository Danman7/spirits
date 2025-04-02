import { renderHook } from '@testing-library/react'

import { useUser } from 'src/shared/modules/user/components/useUser'
import { userContextError } from 'src/shared/modules/user/User.messages'

it('should throw an error when useUser is used outside UserProvider', () => {
  expect(() => {
    renderHook(() => useUser())
  }).toThrow(userContextError)
})
