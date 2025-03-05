import { JSX, SVGProps } from 'react'

const MockSvg = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} />
)

export default MockSvg // For default imports
export const ReactComponent = MockSvg // For named imports
