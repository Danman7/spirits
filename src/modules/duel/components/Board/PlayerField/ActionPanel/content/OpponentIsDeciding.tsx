import { opponentDecidingMessage } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'

import { LoadingMessage } from 'src/shared/components'

export const OppponentIsDeciding: React.FC = () => (
  <LoadingMessage message={opponentDecidingMessage} />
)
