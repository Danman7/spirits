import { useState } from 'react'
import {
  hideLogsLink,
  logsTitle,
} from 'src/modules/duel/components/LogsPanel/messages'
import {
  OpenLogsIcon,
  LogsPanelWrapper,
  LogsScroll,
} from 'src/modules/duel/components/LogsPanel/styles'
import { useDuel } from 'src/modules/duel/state/DuelContext'
import { Icon } from 'src/shared/components/Icon'
import { Link } from 'src/shared/components/Link'
import { SidePanel } from 'src/shared/components/SidePanel'
import { defaultTheme } from 'src/shared/styles/theme'
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
            <div key={`log-item-${index}`}>{log}</div>
          ))}
        </LogsScroll>
        <Link onClick={onHideLogs}>{hideLogsLink}</Link>
      </SidePanel>
    </LogsPanelWrapper>
  )
}
