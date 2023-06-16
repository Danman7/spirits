import { render } from '@testing-library/react'
import { Map, Region, Scenarios } from 'src/regions'

describe('Map component', () => {
  it('should render correctly', () => {
    const { container } = render(
      <Map width={1400} height={800}>
        {Scenarios.Mythosia.map(region => (
          <Region key={region.id} {...region} />
        ))}
      </Map>
    )

    expect(container).toMatchSnapshot()
  })
})
