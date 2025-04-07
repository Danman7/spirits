import { Fragment, useState } from 'react'

import {
  hideLogsLink,
  logsTitle,
} from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import {
  LogItem,
  LogsPanelWrapper,
  LogsScroll,
  OpenLogsButton,
  OpenLogsIcon,
} from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.styles'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

import { Icon, Link, SidePanel } from 'src/shared/components'
import { defaultTheme, Separator } from 'src/shared/styles'

export const LogsPanel: React.FC = () => {
  const {
    state: { logs },
  } = useDuel()

  const [isOpen, setIsOpen] = useState(false)

  const onOpenLogs = () => setIsOpen(true)
  const onHideLogs = () => setIsOpen(false)

  return (
    <LogsPanelWrapper>
      <OpenLogsButton
        $isVisible={!!logs.length && !isOpen}
        onClick={onOpenLogs}
      >
        <OpenLogsIcon>
          <Icon name="Scroll" size="2em" />
        </OpenLogsIcon>

        <p>
          <strong>{logsTitle}</strong>
        </p>
      </OpenLogsButton>

      <SidePanel isOpen={isOpen} color={defaultTheme.colors.hilight}>
        <h2>{logsTitle}</h2>

        <LogsScroll role="log" aria-live="polite">
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
