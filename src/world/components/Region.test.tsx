import { render } from 'src/utils/testUtils'
import { Region, Scenarios } from 'src/world'

describe('Region component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Region key="1" {...Scenarios.TestScenario.regions[0]} />
    )

    expect(container).toMatchSnapshot()
  })
})
