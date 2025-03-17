import {
  redrawingtitle,
  redrawMessage,
  skipRedrawLinkMessage,
} from 'src/modules/duel/components/ActionPanel/ActionPanelMessages'
import { OppponentIsDeciding } from 'src/modules/duel/components/ActionPanel/components/OpponentIsDeciding'
import { Link } from 'src/shared/components/Link'

export const RedrawingPanelContent = ({
  hasPerformedAction,
  onReady,
}: {
  hasPerformedAction: boolean
  onReady: () => void
}) => (
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
