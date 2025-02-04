import { Card } from 'src/shared/components'
import { CardBaseName, CardBases } from 'src/shared/data'
import { renderWithProviders } from 'src/shared/rtlRender'
import { joinStringArrayWithComma } from 'src/shared/utils'

it('should display all UI segments of a card when face up', () => {
  const baseName: CardBaseName = 'BrotherSachelman'
  const base = CardBases[baseName]

  const { getByRole, getByText } = renderWithProviders(
    <Card baseName={baseName} id="1" />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${base.name}${base.strength}`,
  )
  expect(getByText(`Cost: ${base.cost}`)).toBeInTheDocument()
  expect(
    getByText(joinStringArrayWithComma(base.categories)),
  ).toBeInTheDocument()
  expect(getByText((base.description as string[])[0])).toBeInTheDocument()
  expect(getByText(base.flavor as string)).toBeInTheDocument()
})

it('should display no strength for an instant', () => {
  const baseName: CardBaseName = 'BookOfAsh'

  const base = CardBases[baseName]
  const { getByRole } = renderWithProviders(<Card baseName={baseName} id="1" />)

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(`${base.name}`)
})
