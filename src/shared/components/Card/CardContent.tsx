import { FC } from 'react'
import components from 'src/shared/styles/components.module.css'
import { generateUUID } from 'src/shared/utils'

interface CardContentProps {
  description: string[]
  id?: string
  flavor?: string
}

export const CardContent: FC<CardContentProps> = ({
  description,
  id,
  flavor,
}) => (
  <div className={components.cardContent}>
    {description.map((paragraph, index) => (
      <p key={`${id || generateUUID()}-description-${index}`}>{paragraph}</p>
    ))}

    <div className={components.cardFlavor}>
      <small>{flavor}</small>
    </div>
  </div>
)
