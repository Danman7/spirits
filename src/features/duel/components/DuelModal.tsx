import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  browsingStackModalTitle,
  closeMessage,
  initialDrawMessage,
  opponentFirst,
  playerFirst,
  victoryMessage,
} from 'src/features/duel/messages'
import {
  getBrowsedStack,
  getPhase,
  getUserPlayer,
} from 'src/features/duel/selectors'
import { setBrowsedStack } from 'src/features/duel/slice'
import { Card } from 'src/shared/components/Card'
import { Link } from 'src/shared/components/Link'
import { Modal } from 'src/shared/components/Modal'
import { PHASE_MODAL_TIMEOUT } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import components from 'src/shared/styles/components.module.css'
import { shuffleArray } from 'src/shared/utils'

const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, PHASE_MODAL_TIMEOUT)
}

export interface DuelModalProps {
  isLoggedInPlayerActive: boolean
  playerNames: string[]
  victoriousPlayerName?: string
  onDuelModalCloseEnd: () => void
}

export const DuelModal: FC<DuelModalProps> = ({
  isLoggedInPlayerActive,
  playerNames,
  victoriousPlayerName,
  onDuelModalCloseEnd,
}) => {
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false)
  const dispatch = useAppDispatch()
  const player = useAppSelector(getUserPlayer)
  const browsedStack = useAppSelector(getBrowsedStack)
  const phase = useAppSelector(getPhase)
  const previousBrowsedStack = usePrevious(browsedStack)
  const { cards } = player

  const duelModalContent: ReactNode = useMemo(() => {
    switch (phase) {
      case 'Initial Draw':
        return (
          <>
            <h1>{`${playerNames[0]} vs ${playerNames[1]}`}</h1>
            <p>{initialDrawMessage}</p>
            <h3>{isLoggedInPlayerActive ? playerFirst : opponentFirst}</h3>
          </>
        )

      case 'Duel End':
        return <h1>{`${victoriousPlayerName} ${victoryMessage}`}</h1>
    }

    if (browsedStack) {
      return (
        <>
          <div className={components.cardBrowserModal}>
            <h1>{`${browsingStackModalTitle} ${browsedStack}`} </h1>
            <div className={components.cardList}>
              {shuffleArray(player[browsedStack]).map((cardId) => (
                <Card key={`${cardId}-browse`} card={cards[cardId]} />
              ))}
            </div>

            <div className={components.cardBrowseModalFooter}>
              <Link onClick={() => dispatch(setBrowsedStack(''))}>
                {closeMessage}
              </Link>
            </div>
          </div>
        </>
      )
    }
  }, [
    browsedStack,
    cards,
    isLoggedInPlayerActive,
    phase,
    player,
    playerNames,
    victoriousPlayerName,
    dispatch,
  ])

  // Modal visibility based on duel phase
  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        flashModal(setIsDuelModalOpen)
        break

      case 'Duel End':
        setIsDuelModalOpen(true)
        break
    }
  }, [phase])

  // Modal visibility based on browsed card stack
  useEffect(() => {
    if (
      browsedStack ||
      (previousBrowsedStack !== undefined &&
        previousBrowsedStack !== browsedStack)
    ) {
      setIsDuelModalOpen(!!browsedStack)
    }
  }, [browsedStack, previousBrowsedStack])

  return (
    <Modal isOpen={isDuelModalOpen} onClosingComplete={onDuelModalCloseEnd}>
      {duelModalContent}
    </Modal>
  )
}
