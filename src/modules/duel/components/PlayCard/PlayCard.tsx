import { motion } from 'motion/react'
import { FC, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getPhase,
  getPlayers,
} from 'src/modules/duel/selectors'
import {
  agentAttack,
  completeRedraw,
  discardCard,
  drawCardFromDeck,
  moveToNextAttackingAgent,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/modules/duel/slice'
import { CardStack } from 'src/modules/duel/types'
import {
  getAttackingAgentIndex,
  getInactivePlayerId,
  triggerPostCardPlay,
} from 'src/modules/duel/utils'
import { getUserId } from 'src/modules/user/selectors'
import { CardContent, CardFooter, CardHeader } from 'src/shared/components'
import { TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'

interface PlayCardProps {
  cardId: string
  playerId: string
  stack: CardStack
  isOnTop?: boolean
}

export const PlayCard: FC<PlayCardProps> = ({
  cardId,
  playerId,
  stack,
  isOnTop = false,
}) => {
  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)
  const players = useAppSelector(getPlayers)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const userId = useAppSelector(getUserId)

  const { hasPerformedAction, coins, cards } = players[playerId]
  const {
    name,
    description,
    flavor,
    categories,
    factions,
    cost,
    base,
    rank,
    strength,
    type,
  } = cards[cardId]

  const isFaceDown = isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)
  const isSmall = ['deck', 'discard', 'board'].includes(stack)
  const isUserActive = playerId === userId && playerId === activePlayerId
  const isAttacking = cardId === attackingAgentId

  const prevStrength = usePrevious(strength)
  const prevIsFaceDown = usePrevious(isFaceDown)

  const [cardFaceAnimation, setCardFaceAnimation] = useState('')
  const [cardOutlineAnimation, setCardOutlineAnimation] = useState('')
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

  const onClick = useMemo(() => {
    if (stack === 'hand' && !hasPerformedAction && !isOnTop) {
      if (phase === 'Player Turn' && isUserActive && cost <= coins) {
        return () => {
          dispatch(playCard({ cardId, playerId, shouldPay: true }))

          triggerPostCardPlay({
            card: cards[cardId],
            playerId,
            dispatch,
          })
        }
      }

      if (phase === 'Redrawing') {
        return () => {
          dispatch(
            putCardAtBottomOfDeck({
              cardId: cardId,
              playerId,
            }),
          )
          dispatch(drawCardFromDeck(playerId))
          dispatch(completeRedraw(playerId))
        }
      }
    }

    return undefined
  }, [
    cardId,
    cards,
    coins,
    cost,
    dispatch,
    hasPerformedAction,
    isOnTop,
    isUserActive,
    phase,
    playerId,
    stack,
  ])

  const onAnimationEnd = () => {
    if (isAttacking) {
      const defendingPlayer =
        players[getInactivePlayerId(players, activePlayerId)]
      const attackingCardIndex = getAttackingAgentIndex(
        players,
        activePlayerId,
        attackingAgentId,
      )

      // Set the defending agent to either the one opposite the attacker,
      // or the last agent on the defending player's board
      const defendingAgentId =
        defendingPlayer.board[attackingCardIndex] ||
        defendingPlayer.board[defendingPlayer.board.length - 1] ||
        ''

      dispatch(
        agentAttack({
          defendingAgentId,
          defendingPlayerId: defendingPlayer.id,
        }),
      )
      dispatch(moveToNextAttackingAgent())
    }
  }

  // Attack animations
  useEffect(() => {
    if (isAttacking) {
      setCardOutlineAnimation('')
      setCardFaceAnimation('')

      setTimeout(() => {
        setCardOutlineAnimation(
          isOnTop
            ? ` ${animations.attackFromTop}`
            : ` ${animations.attackFromBottom}`,
        )
        setCardFaceAnimation(
          isOnTop
            ? ` ${animations.attackFromTopFace}`
            : ` ${animations.attackFromBottomFace}`,
        )
      }, TICK)
    }
  }, [isAttacking, isOnTop])

  // Show or hide card faces.
  useEffect(() => {
    if (prevIsFaceDown !== undefined && prevIsFaceDown !== isFaceDown) {
      if (isFaceDown) {
        setTimeout(() => {
          setShouldShowFront(false)
        }, 500)
      } else {
        setShouldShowFront(true)
      }
    }
  }, [isFaceDown, prevIsFaceDown])

  // Strength animations
  useEffect(() => {
    if (prevStrength !== undefined && prevStrength !== strength) {
      setCardFaceAnimation('')

      setTimeout(() => {
        setCardFaceAnimation(
          prevStrength < strength
            ? ` ${animations.boost}`
            : ` ${animations.damage}`,
        )
      }, TICK)
    }
  }, [strength, prevStrength])

  // Discard on defeat
  useEffect(() => {
    if (type === 'agent' && strength <= 0) {
      dispatch(discardCard({ cardId, playerId }))
    }
  }, [cardId, dispatch, playerId, strength, type])

  return (
    <motion.div
      layout
      layoutId={cardId}
      data-testid={`${CARD_TEST_ID}${cardId}`}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
      initial={false}
      className={`${components.cardOutline}${isSmall ? ` ${components.smallCard}` : ''}${isFaceDown ? ` ${components.cardFlipped}` : ''}${cardOutlineAnimation}`}
    >
      <div className={components.cardPaper}>
        {/* Card Front */}
        {shouldShowFront ? (
          <div
            className={`${components.cardFront}${onClick ? ` ${animations.activeCard}` : ''}${rank === 'unique' ? ` ${components.uniqueCard}` : ''}${cardFaceAnimation}`}
          >
            <CardHeader
              factions={factions}
              categories={categories}
              name={name}
              strength={strength}
              baseStrength={base.strength}
            />

            <CardContent description={description} flavor={flavor} />

            <CardFooter cost={cost} />
          </div>
        ) : null}

        {/* Card Back */}
        <div className={components.cardBack} />
      </div>
    </motion.div>
  )
}
