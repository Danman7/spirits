import { opponentDecidingMessage } from 'src/modules/duel/components/ActionPanel/ActionPanelMessages'
import { LoadingMessage } from 'src/shared/components/LoadingMessage'

export const OppponentIsDeciding = () => (
  <LoadingMessage message={opponentDecidingMessage} />
)
