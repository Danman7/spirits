import { Fragment, useState } from 'react'

import {
  hideLogsLink,
  logsTitle,
} from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import {
  OpenLogsIcon,
  LogsPanelWrapper,
  LogsScroll,
  LogItem,
} from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.styles'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

import { Icon, SidePanel, Link } from 'src/shared/components'
import { defaultTheme, Separator } from 'src/shared/styles'
import { LOGS_CONTENT, OPEN_LOGS_ICON } from 'src/shared/test/testIds'

export const LogsPanel: React.FC = () => {
  const {
    state: { logs },
  } = useDuel()

  const [isOpen, setIsOpen] = useState(false)

  const onOpenLogs = () => setIsOpen(true)
  const onHideLogs = () => setIsOpen(false)

  return (
    <LogsPanelWrapper>
      <OpenLogsIcon
        $isVisible={!!logs.length && !isOpen}
        onClick={onOpenLogs}
        data-testid={OPEN_LOGS_ICON}
      >
        <Icon name="Scroll" />
      </OpenLogsIcon>

      <SidePanel isOpen={isOpen} color={defaultTheme.colors.hilight}>
        <h2>{logsTitle}</h2>

        <LogsScroll data-testid={LOGS_CONTENT}>
          {logs.map((log, index) => (
            <Fragment key={`log-item-${index}`}>
              <LogItem>{log}</LogItem>

              <Separator />
            </Fragment>
          ))}
        </LogsScroll>

        <Link onClick={onHideLogs}>{hideLogsLink}</Link>
      </SidePanel>
    </LogsPanelWrapper>
  )
}
