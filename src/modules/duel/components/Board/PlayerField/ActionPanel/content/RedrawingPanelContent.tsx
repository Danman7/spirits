import {
  redrawingtitle,
  redrawMessage,
  skipRedrawLinkMessage,
} from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'
import { OppponentIsDeciding } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/content'

import { Link } from 'src/shared/components'

export const RedrawingPanelContent: React.FC<{
  hasPerformedAction: boolean
  onReady: () => void
}> = ({ hasPerformedAction, onReady }) => (
  <>
    <h3>{redrawingtitle}</h3>
    {hasPerformedAction ? (
      <OppponentIsDeciding />
    ) : (
      <p>
        {redrawMessage}
        <Link onClick={onReady}>{skipRedrawLinkMessage}</Link>.
      </p>
    )}
  </>
)
