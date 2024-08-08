import '@testing-library/jest-dom'
import { render, screen } from 'src/utils/test-utils'
import { PositiveNegativeNumber } from './PositiveNegativeNumber'
import { defaultTheme } from 'src/theme'

const base = 3

describe('Card Component', () => {
  it('should show a positive number', async () => {
    const value = base + 1

    render(<PositiveNegativeNumber base={3} current={value} />)

    expect(await screen.queryByText(value)).toHaveStyle({
      color: defaultTheme.colors.positive
    })
  })

  it('should show a negative number', async () => {
    const value = base - 1

    render(<PositiveNegativeNumber base={3} current={value} />)

    expect(await screen.queryByText(value)).toHaveStyle({
      color: defaultTheme.colors.negative
    })
  })
})
