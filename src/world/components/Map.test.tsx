import { render } from '@testing-library/react'
import { Map, Scenarios } from 'src/world'

const { regions, width, height } = Scenarios.Mythosia

describe('Map component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Map width={width} height={height} regions={regions} />
    )

    expect(container).toMatchSnapshot()
  })
})
