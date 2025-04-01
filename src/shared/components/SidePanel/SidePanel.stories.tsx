import type { Meta, StoryObj } from '@storybook/react'
import { LeftPanelsWrapper } from 'src/modules/duel/components/PlayerField/PlayerFieldStyles'
import { Link } from 'src/shared/components/Link'
import { SidePanel } from 'src/shared/components/SidePanel/SidePanel'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'

const meta = {
  title: 'SidePanel',
  component: SidePanel,
  tags: ['Common', 'Stateless'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'This is a small floating card that slides in and out to the left. It serves the purpose of displaying timely messages that may include optional user action. Its appearance and disappearance are animated.',
      },
    },
  },
  decorators: [
    (story) => (
      <div style={{ width: '100%', height: '300px' }}>
        <LeftPanelsWrapper>{story()}</LeftPanelsWrapper>
      </div>
    ),
  ],
  args: { isOpen: true, children: 'Testing SidePanel message' },
  argTypes: {
    isOpen: {
      description:
        'Controls whether the SidePanel should be shown or hidden. Internal state syncs this with the animations.',
    },
    children: {
      description: 'Determines what is shown inside the SidePanel box.',
    },
  },
} satisfies Meta<typeof SidePanel>

export default meta
type Story = StoryObj<typeof meta>

export const StringContent: Story = {}

export const NodeContent: Story = {
  args: {
    children: (
      <>
        <h2>This is a test</h2>
        <p>You can put any ReactNode as SidePanel content.</p>
        <Link onClick={() => {}}>A link</Link>
      </>
    ),
  },
}

export const CustomColor: Story = {
  args: { color: defaultTheme.colors.hilight },
}
