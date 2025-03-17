import { FC } from 'react'
import { LoadingDots } from 'src/shared/components/LoadingMessage/LoadingDots'

export const LoadingMessage: FC<{ message: string }> = ({ message }) => (
  <>
    {message}
    <LoadingDots />
  </>
)
