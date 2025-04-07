import styled from 'styled-components'

import { StyledIcon } from 'src/shared/components/Icon/Icon.styles'
import { transitionMixin } from 'src/shared/styles'

const openLogsIconSize = '42px'

export const OpenLogsIcon = styled.div`
  ${transitionMixin}
  display: flex;
  justify-content: center;
  width: ${openLogsIconSize};
  height: ${openLogsIconSize};
  border-radius: 50%;
  border-width: ${({ theme }) => theme.spacing / 2}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.boxShadow.level2};

  ${StyledIcon} path {
    ${transitionMixin}
  }
`

export const OpenLogsButton = styled.div<{ $isVisible: boolean }>`
  ${transitionMixin}
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing}px;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  cursor: pointer;

  &:hover {
    scale: 1.1;
    color: ${({ theme }) => theme.colors.hilight};

    ${OpenLogsIcon} {
      border-color: ${({ theme }) => theme.colors.hilight};

      ${StyledIcon} path {
        fill: ${({ theme }) => theme.colors.hilight};
      }
    }
  }

  &:active {
    scale: 0.9;
  }
`

export const LogsPanelWrapper = styled.div`
  min-height: ${openLogsIconSize};
  position: relative;
`

export const LogsScroll = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

export const LogItem = styled.div`
  padding: 0.5em 0;
`
