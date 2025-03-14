import { renderHook } from '@testing-library/react'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { duelContextError } from 'src/modules/duel/state/duelStateMessages'

it('should throw an error when useDuel is used outside UserProvider', () => {
  expect(() => {
    renderHook(() => useDuel())
  }).toThrow(duelContextError)
})
