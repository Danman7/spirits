import { render } from 'src/utils/testUtils'
import { Map, Scenarios } from 'src/world'

const { regions, width, height } = Scenarios.TestScenario

describe('Map component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Map width={width} height={height} regions={regions} />
    )

    expect(container).toMatchSnapshot()
  })
})
