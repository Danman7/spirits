import type { Meta, StoryObj } from '@storybook/react'
import { motion } from 'motion/react'

import { SlideInOutOpacityVariants } from 'src/shared/animations'
import Modal from 'src/shared/components/Modal'

const meta = {
  title: 'Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    children: 'Testing modal message',
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const StringContent: Story = {}

export const NodeContent: Story = {
  args: {
    children: (
      <>
        <motion.h1 variants={SlideInOutOpacityVariants}>
          This is a test
        </motion.h1>
        <motion.p variants={SlideInOutOpacityVariants}>
          You can put any ReactNode as Modal content.
        </motion.p>
      </>
    ),
  },
}
