import { FC, ReactNode, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import {
  CardBrowserModal,
  CardBrowserModalFooter,
  CardList,
} from 'src/modules/duel/components'
import {
  getBrowsedStack,
  getIsBrowsingStack,
  getPlayers,
  setIsBrowsingStack,
  browsingStackModalTitle,
  closeMessage,
} from 'src/modules/duel'
import { getUserId } from 'src/modules/user'
import { Card, Link, Modal } from 'src/shared/components'
import { shuffleArray } from 'src/shared/utils'

export const StackBrowseModal: FC = () => {
  const dispatch = useAppDispatch()
  const isBrowsingStack = useAppSelector(getIsBrowsingStack)
  const browsedStack = useAppSelector(getBrowsedStack)
  const players = useAppSelector(getPlayers)
  const userId = useAppSelector(getUserId)

  const player = players[userId]

  const onCloseModal = () => dispatch(setIsBrowsingStack(false))

  const StackBrowseModalContent: ReactNode = useMemo(() => {
    if (browsedStack) {
      return (
        <CardBrowserModal>
          <h1>{`${browsingStackModalTitle} ${browsedStack}`} </h1>
          <CardList>
            {shuffleArray(player[browsedStack]).map((cardId) => (
              <Card
                key={`${cardId}-browse`}
                id={`${cardId}-browse`}
                baseName={player.cards[cardId].baseName}
                currentCard={player.cards[cardId]}
              />
            ))}
          </CardList>

          <CardBrowserModalFooter>
            <Link onClick={onCloseModal}>{closeMessage}</Link>
          </CardBrowserModalFooter>
        </CardBrowserModal>
      )
    }
  }, [player, browsedStack])

  return <Modal isOpen={isBrowsingStack}>{StackBrowseModalContent}</Modal>
}
