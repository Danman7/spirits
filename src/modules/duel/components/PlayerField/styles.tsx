import { CardOutline } from 'src/shared/components'
import { Pop } from 'src/shared/styles'
import styled, { css } from 'styled-components'

interface StyledPlayerFieldProps {
  $isOnTop: boolean
}

export const StyledPlayerField = styled.div<StyledPlayerFieldProps>`
  height: 50vh;
  display: grid;
  grid-template-columns: 1fr 5fr 1fr;
  grid-template-rows: auto;
  justify-items: center;
  gap: ${({ theme }) => theme.padding};
  grid-template-areas: ${({ $isOnTop }) =>
    $isOnTop
      ? `'discard hand deck'
    'board board board'`
      : `'board board board'
    'discard hand deck'`};
`

export const PlayerBoard = styled.div<StyledPlayerFieldProps>`
  grid-area: board;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  padding: ${({ theme }) => theme.padding};
  align-items: ${({ $isOnTop }) => ($isOnTop ? 'flex-end' : 'flex-start')};
`

export const PlayerHand = styled.div<StyledPlayerFieldProps>`
  grid-area: hand;
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 2;
  z-index: 2;
  height: 64px;
  align-items: ${({ $isOnTop }) => ($isOnTop ? 'flex-end' : 'inherit')};
  align-self: ${({ $isOnTop }) => ($isOnTop ? 'inherit' : 'end')};

  ${CardOutline} {
    position: relative;
    margin: 0 -80px;

    ${({ $isOnTop, theme }) =>
      !$isOnTop &&
      css`
        bottom: 0;
        transition: bottom ${theme.transitionTime};

        &:hover {
          bottom: calc(${theme.card.height} - 64px);
          z-index: 2;
          box-shadow: ${theme.boxShadow.level3};
        }
      `}
  }
`

const FaceDownStack = styled.div<StyledPlayerFieldProps>`
  height: 25px;
  width: ${({ theme }) => theme.card.smallWidth};
  display: flex;
  align-items: ${({ $isOnTop }) => ($isOnTop ? 'flex-end' : 'inherit')};

  ${({ $isOnTop }) =>
    !$isOnTop &&
    `align-self: end;
  cursor: pointer;
  position: relative;`}

  ${CardOutline} {
    position: absolute;
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
}

export const PlayerInfo = styled.h2<PlayerInfoProps>`
  position: fixed;
  right: 1rem;
  z-index: 4;
  font-weight: ${({ $isActive }) => ($isActive ? 800 : 400)};
  top: ${({ $isOnTop }) => ($isOnTop ? '2em' : 'inherit')};
  bottom: ${({ $isOnTop }) => ($isOnTop ? 'inherit' : '2em')};

  ${({ $isActive, theme }) =>
    $isActive &&
    css`
      animation-name: ${Pop};
      display: inline-block;
      animation-duration: ${theme.transitionTime};
      animation-timing-function: ease-in-out;
      animation-iteration-count: 2;
      animation-direction: alternate;
    `}
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
  padding: ${({ theme }) => theme.padding};
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
