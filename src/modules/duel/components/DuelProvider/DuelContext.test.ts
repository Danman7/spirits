import { renderHook } from '@testing-library/react'

import { duelContextError } from 'src/modules/duel/components/DuelProvider/DuelProvider.messages'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

it('should throw an error when useDuel is used outside UserProvider', () => {
  expect(() => {
    renderHook(() => useDuel())
  }).toThrow(duelContextError)
})
