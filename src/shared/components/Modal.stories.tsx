import type { Meta, StoryObj } from '@storybook/react'
import { motion } from 'framer-motion'
import { Provider } from 'react-redux'
import { configureStoreWithPreloadedState } from 'src/app/store'
import { MockPlayerTurnState } from 'src/features/duel/__mocks__'
import InitialPhaseModal from 'src/features/duel/components/modals/InitialPhaseModal'
import PlayerTurnModal from 'src/features/duel/components/modals/PlayerTurnModal'
import RedrawPhaseModal from 'src/features/duel/components/modals/RedrawPhaseModal'
import VictoryModal from 'src/features/duel/components/modals/VictoryModal'
import { SlideInOutContentVariants } from 'src/shared/animations'
import Modal from 'src/shared/components/Modal'

const meta = {
  title: 'Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    hasOverlay: false,
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
        <motion.p variants={SlideInOutContentVariants}>
          You can put any ReactNode as Modal content.
        </motion.p>
      </>
    ),
  },
}

export const Overlay: Story = {
  args: {
    hasOverlay: true,
    children: (
      <>
        <motion.h1 variants={SlideInOutContentVariants}>
          This modal has an overlay
        </motion.h1>
        <motion.p variants={SlideInOutContentVariants}>
          It provides more focus.
        </motion.p>
      </>
    ),
  },
}

export const InitialPhase: Story = {
  decorators: [
    (story) => (
      <Provider
        store={configureStoreWithPreloadedState({
          duel: {
            ...MockPlayerTurnState,
            phase: 'Pre-duel',
          },
        })}
      >
        {story()}
      </Provider>
    ),
  ],
  args: {
    children: <InitialPhaseModal />,
  },
}

export const RedrawPhase: Story = {
  decorators: [
    (story) => (
      <Provider
        store={configureStoreWithPreloadedState({
          duel: {
            ...MockPlayerTurnState,
            phase: 'Redrawing Phase',
          },
        })}
      >
        {story()}
      </Provider>
    ),
  ],
  args: {
    children: <RedrawPhaseModal />,
  },
}

export const PlayerTurn: Story = {
  decorators: [
    (story) => (
      <Provider
        store={configureStoreWithPreloadedState({
          duel: {
            ...MockPlayerTurnState,
            phase: 'Player Turn',
          },
        })}
      >
        {story()}
      </Provider>
    ),
  ],
  args: {
    children: <PlayerTurnModal />,
  },
}

export const Victory: Story = {
  decorators: [
    (story) => (
      <Provider
        store={configureStoreWithPreloadedState({
          duel: {
            ...MockPlayerTurnState,
            phase: 'Player Turn',
          },
        })}
      >
        {story()}
      </Provider>
    ),
  ],
  args: {
    hasOverlay: true,
    children: <VictoryModal victorName="Garrett" />,
  },
}
