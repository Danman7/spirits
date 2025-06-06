import styled, { css } from 'styled-components'

import { CardMovementWrapper } from 'src/modules/duel/components/Board/PlayerField/PlayCard/PlayCard.styles'

import { CardOutline } from 'src/shared/modules/cards'
import { Color } from 'src/shared/shared.types'
import { Box, transitionMixin } from 'src/shared/styles'

interface StyledPlayerFieldProps {
  $isOnTop: boolean
}

export const StyledPlayerField = styled.div<StyledPlayerFieldProps>`
  display: grid;
  gap: ${({ theme }) => theme.spacing}px;
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-rows: ${({ $isOnTop, theme }) =>
    $isOnTop
      ? `${theme.spacing * 9}px ${theme.spacing * 2}px ${theme.spacing * 30}px`
      : `${theme.spacing * 30}px ${theme.spacing * 2}px ${theme.spacing * 9}px`};
  justify-items: center;
  align-items: center;
  grid-template-areas: ${({ $isOnTop }) =>
    $isOnTop
      ? `'discard hand deck'
    'panels info info' 'board board board'`
      : `'board board board' 'panels info info'
    'discard hand deck'`};
  align-items: ${({ $isOnTop }) => ($isOnTop ? 'flex-end' : 'flex-start')};
`

export const PlayerBoard = styled.div<StyledPlayerFieldProps>`
  grid-area: board;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  align-items: anchor-center;
  align-self: ${({ $isOnTop }) => ($isOnTop ? 'flex-end' : 'flex-start')};

  ${CardMovementWrapper} {
    transform-origin: ${({ $isOnTop }) =>
      $isOnTop ? 'bottom center' : 'top center'};
  }
`

export const PlayerHand = styled.div<StyledPlayerFieldProps>`
  grid-area: hand;
  display: flex;

  ${CardMovementWrapper} {
    ${({ $isOnTop }) =>
      !$isOnTop &&
      css`
        &:hover {
          z-index: 2;
        }
      `}
  }

  ${CardOutline} {
    margin-left: -${({ theme }) => theme.spacing * 10}px;
    margin-right: -${({ theme }) => theme.spacing * 10}px;

    ${({ $isOnTop, theme }) =>
      !$isOnTop &&
      css`
        &:hover {
          margin-top: calc(-${theme.card.height}px + ${theme.spacing * 9}px);
          box-shadow: ${theme.boxShadow.level3};
        }
      `}
  }
`

const FaceDownStack = styled.div<StyledPlayerFieldProps>`
  position: relative;
  cursor: ${({ $isOnTop }) => ($isOnTop ? 'auto' : 'pointer')};
  display: grid;

  ${CardMovementWrapper} {
    pointer-events: none;
    grid-area: ${({ $isOnTop }) => ($isOnTop ? 1 : 2)} / 1;
  }
`

export const PlayerDeck = styled(FaceDownStack)`
  grid-area: deck;
`

export const PlayerDiscard = styled(FaceDownStack)`
  grid-area: discard;
`

interface PlayerInfoProps extends StyledPlayerFieldProps {
  $isActive: boolean
  $color: Color
}

export const PlayerInfo = styled(Box)<PlayerInfoProps>`
  ${transitionMixin}
  text-align: left;
  grid-area: info;
  border-radius: ${({ theme }) => `${theme.spacing}px 0 0 ${theme.spacing}px`};
  display: flex;
  justify-self: end;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ $color }) => $color};
  padding: 0.5em;
  z-index: 3;
  padding: ${({ $isActive }) =>
    $isActive ? '0.5em 2em 0.5em 0.5em' : '0.5em'};
  align-self: ${({ $isOnTop }) => ($isOnTop ? 'self-start' : 'self-end')};
`

export const CardBrowserModal = styled.div`
  position: relative;
  overflow: auto;
  height: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  width: 820px;
  padding-bottom: 2em;

  h1 {
    padding-bottom: 1em;
  }
`

export const CardBrowserModalFooter = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing}px;
  backdrop-filter: blur(10px);
`

export const CardList = styled.div`
  display: flex;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  flex-grow: 2;
  align-content: center;
`

export const LeftPanelsWrapper = styled.div`
  grid-area: panels;
  width: ${({ theme }) => theme.spacing * 16}px;
  justify-self: left;
  align-self: end;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 0 1em;
`

export const StackLabel = styled.div`
  text-align: center;
`
