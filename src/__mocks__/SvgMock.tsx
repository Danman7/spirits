import { JSX, SVGProps } from 'react'

const MockSvg = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} />
)

export default MockSvg
export const ReactComponent = MockSvg
