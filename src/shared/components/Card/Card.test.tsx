import { Card } from 'src/shared/components'
import { BookOfAsh, BrotherSachelman } from 'src/shared/data'
import { renderWithProviders } from 'src/shared/rtlRender'
import { joinStringArrayWithComma } from 'src/shared/utils'

it('should display all UI segments of a card when face up', () => {
  const { name, strength, cost, description, flavor, categories } =
    BrotherSachelman

  const { getByRole, getByText } = renderWithProviders(
    <Card id="1" card={BrotherSachelman} />,
  )

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(
    `${name}${strength}`,
  )
  expect(getByText(`Cost: ${cost}`)).toBeInTheDocument()
  expect(getByText(joinStringArrayWithComma(categories))).toBeInTheDocument()
  expect(getByText(description[0])).toBeInTheDocument()
  expect(getByText(flavor)).toBeInTheDocument()
})

it('should display no strength for an instant', () => {
  const { name } = BookOfAsh
  const { getByRole } = renderWithProviders(<Card id="1" card={BookOfAsh} />)

  expect(getByRole('heading', { level: 3 })).toHaveTextContent(name)
})
