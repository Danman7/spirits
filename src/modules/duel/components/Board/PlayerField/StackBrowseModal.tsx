import {
  browsingStackModalTitle,
  closeMessage,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.messages'
import {
  CardBrowserModal,
  CardBrowserModalFooter,
  CardList,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.styles'
import type { DuelCards } from 'src/modules/duel/state'

import { Link, Modal } from 'src/shared/components'
import { CardComponent } from 'src/shared/modules/cards'
import { shuffleArray } from 'src/shared/shared.utils'

interface StackBrowseModalProps {
  isOpen: boolean
  browsedStack: string
  browsedCards: DuelCards
  onClose: () => void
}

export const StackBrowseModal: React.FC<StackBrowseModalProps> = ({
  isOpen,
  browsedStack,
  browsedCards,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen}>
      <CardBrowserModal>
        <h1>{`${browsingStackModalTitle} ${browsedStack}`} </h1>
        <CardList>
          {shuffleArray(Object.entries(browsedCards)).map(([id, card]) => (
            <CardComponent
              key={`${id}-browse`}
              id={`${id}-browse`}
              card={card}
            />
          ))}
        </CardList>

        <CardBrowserModalFooter>
          <Link onClick={onClose}>{closeMessage}</Link>
        </CardBrowserModalFooter>
      </CardBrowserModal>
    </Modal>
  )
}
