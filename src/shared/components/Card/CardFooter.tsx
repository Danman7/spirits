import { FC } from 'react'
import components from 'src/shared/styles/components.module.css'

interface CardFooterProps {
  cost: number
}

export const CardFooter: FC<CardFooterProps> = ({ cost }) => (
  <div className={components.cardFooter}>Cost: {cost}</div>
)
