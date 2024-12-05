import { FC } from 'react'

import animations from 'src/shared/styles/animations.module.css'

const LoadingMessage: FC<{ message: string }> = ({ message }) => (
  <>
    {message}
    <span className={animations.loadingDots}>.</span>
    <span className={animations.loadingDots}>.</span>
    <span className={animations.loadingDots}>.</span>
    <span className={animations.loadingDots}>.</span>
  </>
)

export default LoadingMessage
