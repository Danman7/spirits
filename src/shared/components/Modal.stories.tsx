import type { Meta, StoryObj } from '@storybook/react'
import { motion } from 'framer-motion'

import Modal from 'src/shared/components/Modal'
import { SlideInOutContentVariants } from 'src/shared/animations'

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
        <motion.h1 variants={SlideInOutContentVariants}>
          This is a test
        </motion.h1>
        <motion.div variants={SlideInOutContentVariants}>
          You can put any ReactNode as Modal content.
        </motion.div>
      </>
    ),
  },
}
