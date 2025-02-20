import {
  browsingStackModalTitle,
  closeMessage,
  PlayerCards,
} from 'src/modules/duel'
import {
  CardBrowserModal,
  CardBrowserModalFooter,
  CardList,
} from 'src/modules/duel/components'
import { CardComponent, Link, Modal } from 'src/shared/components'
import { shuffleArray } from 'src/shared/utils'

interface StackBrowseModalProps {
  isOpen: boolean
  browsedStack: string
  browsedCards: PlayerCards
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
