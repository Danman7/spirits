import { motion } from 'motion/react'
import { forwardRef, useEffect, useState } from 'react'

import { CardProps } from 'src/features/cards/types'
import { ColoredNumber } from 'src/shared/components/ColoredNumber'
import { TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'

const CardComponent = motion.create(
  forwardRef<HTMLDivElement, CardProps>(
    (
      {
        card,
        isSmall = false,
        isFaceDown = false,
        isAttacking = false,
        isOnTop = false,
        onClickCard,
        onAttackAnimationEnd,
      },
      ref,
    ) => {
      const {
        id,
        name,
        description,
        flavor,
        categories,
        factions,
        cost,
        base,
        rank,
        strength,
      } = card

      const prevStrength = usePrevious(strength)

      const [cardStrengthAnimation, setCardStrengthAnimation] = useState('')
      const [cardAttackAnimation, setCardAttackAnimation] = useState('')

      const onClick = onClickCard ? () => onClickCard(id) : undefined

      const onAnimationEnd = () => {
        if (isAttacking && onAttackAnimationEnd) {
          onAttackAnimationEnd()
        }
      }

      useEffect(() => {
        if (prevStrength !== undefined && prevStrength !== strength) {
          setCardStrengthAnimation('')

          setTimeout(() => {
            setCardStrengthAnimation(
              prevStrength < strength ? animations.boost : animations.damage,
            )
          }, TICK)
        }
      }, [strength, prevStrength])

      useEffect(() => {
        if (isAttacking) {
          setCardAttackAnimation('')

          setTimeout(() => {
            setCardAttackAnimation(
              isOnTop
                ? ` ${animations.attackFromTop}`
                : ` ${animations.attackFromBottom}`,
            )
          }, TICK)
        }
      }, [isAttacking, isOnTop])

      return isFaceDown ? (
        <motion.div
          ref={ref}
          className={`${components.card} ${components.cardBack} ${isSmall ? components.smallCard : ''}`}
        />
      ) : (
        <motion.div
          ref={ref}
          data-testid={`${CARD_TEST_ID}${id}`}
          onAnimationEnd={onAnimationEnd}
          onClick={onClick}
          className={`${components.cardAnimationWrapper} ${isSmall ? components.smallCard : ''} ${onClickCard ? animations.activeCard : ''} ${rank === 'unique' ? components.uniqueCard : ''}  ${cardStrengthAnimation}`}
        >
          <div className={`${components.card}${cardAttackAnimation}`}>
            <div
              className={components.cardHeader}
              style={{ background: getFactionColor(factions) }}
            >
              <h3 className={components.cardTitle}>
                <span>{name}</span>
                {!!strength && (
                  <ColoredNumber current={strength} base={base.strength} />
                )}
              </h3>

              <small>{joinCardCategories(categories)}</small>
            </div>
            <div className={components.cardContent}>
              {description.map((paragraph, index) => (
                <p key={`${id}-description-${index}`}>{paragraph}</p>
              ))}

              <small className={components.cardFlavor}>{flavor}</small>
            </div>
            <div className={components.cardFooter}>Cost: {cost}</div>
          </div>
        </motion.div>
      )
    },
  ),
  {
    forwardMotionProps: true,
  },
)

export default CardComponent
