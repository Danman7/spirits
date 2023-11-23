import { render } from '@testing-library/react'
import { Region, Scenarios } from 'src/world'

describe('Region component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Region key="1" {...Scenarios.Mythosia.regions[0]} />
    )

    expect(container).toMatchSnapshot()
  })
})
