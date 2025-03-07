import { FC } from 'react'
import { LoadingDot } from 'src/shared/components/LoadingMessage/LoadingMessageStyles'

export const LoadingMessage: FC<{ message: string }> = ({ message }) => (
  <>
    {message}
    <LoadingDot>.</LoadingDot>
    <LoadingDot>.</LoadingDot>
    <LoadingDot>.</LoadingDot>
  </>
)
