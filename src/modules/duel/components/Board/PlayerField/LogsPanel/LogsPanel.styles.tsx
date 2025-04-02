import styled from 'styled-components'

import { StyledIcon } from 'src/shared/components/Icon/Icon.styles'
import { transitionMixin } from 'src/shared/styles'

const size = '42px'

export const OpenLogsIcon = styled.div<{ $isVisible: boolean }>`
  ${transitionMixin}
  cursor: pointer;
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: ${size};
  height: ${size};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  border-radius: 50%;
  border-width: 3px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  transition-property: all;
  box-shadow: ${({ theme }) => theme.boxShadow.level2};

  ${StyledIcon} path {
    ${transitionMixin}
    transition-property: all;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};

    ${StyledIcon} path {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }

  &:active {
    scale: 0.9;
  }
`

export const LogsPanelWrapper = styled.div`
  min-height: ${size};
  position: relative;
`

export const LogsScroll = styled.div`
  max-height: 300px;
  overflow-y: auto;
`

export const LogItem = styled.div`
  padding: 0.5em 0;
`
