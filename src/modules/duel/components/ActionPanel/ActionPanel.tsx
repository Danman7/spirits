import { useActionPanelContent } from 'src/modules/duel/components/ActionPanel/ActionPanelHooks'
import { SidePanel } from 'src/shared/components/SidePanel'

export const ActionPanel: React.FC = () => (
  <SidePanel isOpen={true}>{useActionPanelContent()}</SidePanel>
)
