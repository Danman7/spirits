import type { Meta, StoryObj } from '@storybook/react'

import { Icon } from 'src/shared/components'
import { Icons } from 'src/shared/components/Icon/AvailableIcons'
import { IconName } from 'src/shared/components/Icon/Icon.types'
import { defaultTheme } from 'src/shared/styles/defaultTheme'

const meta = {
  title: 'Icon',
  component: Icon,
  tags: ['Common', 'Stateless'],
  parameters: { layout: 'centered' },
  args: { color: defaultTheme.colors.text, name: 'Scroll', isSmall: false },
  argTypes: {
    color: { control: 'color', description: 'Controls the color of the SVG.' },
    name: {
      control: 'select',
      options: Object.keys(Icons) as IconName[],
      description: 'Select an icon from the available options.',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomColor: Story = {
  args: { color: defaultTheme.colors.chaosFaction, name: 'Coins' },
}

export const Small: Story = { args: { isSmall: true, name: 'Hourglass' } }
