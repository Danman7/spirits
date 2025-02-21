import {
  browsingStackModalTitle,
  closeMessage,
} from 'src/modules/duel/components/PlayerField/messages'
import {
  CardBrowserModal,
  CardBrowserModalFooter,
  CardList,
} from 'src/modules/duel/components/PlayerField/styles'
import { PlayerCards } from 'src/modules/duel/types'
import { Link } from 'src/shared/components/Link'
import { Modal } from 'src/shared/components/Modal'
import { CardComponent } from 'src/shared/modules/cards/components/Card'
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
