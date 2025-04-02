import { useActionPanelContent } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/hooks/useActionPanelContent'

import { SidePanel } from 'src/shared/components'

export const ActionPanel: React.FC = () => (
  <SidePanel isOpen={true}>{useActionPanelContent()}</SidePanel>
)
