import { FC, ReactNode, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  CardBrowserModal,
  CardBrowserModalFooter,
  CardList,
} from 'src/modules/duel/components'
import {
  browsingStackModalTitle,
  closeMessage,
} from 'src/modules/duel/messages'
import {
  getBrowsedStack,
  getIsBrowsingStack,
  getPlayers,
} from 'src/modules/duel/selectors'
import { setIsBrowsingStack } from 'src/modules/duel/slice'
import { getUserId } from 'src/modules/user/selectors'
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
