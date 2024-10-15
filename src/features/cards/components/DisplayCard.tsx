import { FC } from 'react'

import { DisplayCardProps } from 'src/features/cards/types'
import { getFactionColor, joinCardTypes } from 'src/features/cards/utils'

import styles from 'src/shared/styles/styles.module.css'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'

const DisplayCardComponent: FC<DisplayCardProps> = ({ card }) => {
  const {
    id,
    name,
    description,
    flavor,
    types,
    factions,
    cost,
    prototype,
    kind,
  } = card

  const strength = kind === 'agent' ? card.strength : undefined

  return (
    <div className={styles.card}>
      <div
        className={styles.cardHeader}
        style={{ background: getFactionColor(factions) }}
      >
        <h4 className={styles.cardTitle}>
          <div style={{ textAlign: 'center', flexGrow: 2 }}>{name}</div>
          {kind === 'agent' && strength && (
            <div>
              <PositiveNegativeNumber
                current={strength}
                base={prototype.strength}
              />
            </div>
          )}
        </h4>
        <h5 className={styles.cardTypes}>{joinCardTypes(types)}</h5>
      </div>
      <div className={styles.cardContent}>
        {description.map((paragraph, index) => (
          <p key={`${id}-description-${index}`}>{paragraph}</p>
        ))}

        <small className={styles.cardFlavor}>{flavor}</small>
      </div>
      <div className={styles.cardFooter}>Cost: {cost}</div>
    </div>
  )
}

export default DisplayCardComponent
