import { render } from '@testing-library/react'
import { Region, Scenarios } from 'src/regions'

describe('Region component', () => {
  it('should render correctly', () => {
    const { container } = render(<Region key="1" {...Scenarios.Mythosia[0]} />)

    expect(container).toMatchSnapshot()
  })
})
