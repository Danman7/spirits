import { render } from '@testing-library/react'
import { Map, Scenarios } from 'src/world'

describe('Map component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Map width={1400} height={800} regions={Scenarios.Mythosia} />
    )

    expect(container).toMatchSnapshot()
  })
})
