import { renderHook } from '@testing-library/react'
import { useDuel } from 'src/modules/duel/state/DuelContext'
import { duelContextError } from 'src/modules/duel/state/messages'

it('should throw an error when useDuel is used outside UserProvider', () => {
  expect(() => {
    renderHook(() => useDuel())
  }).toThrow(duelContextError)
})
