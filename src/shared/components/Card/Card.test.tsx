import { CardComponent } from 'src/shared/components'
import { BookOfAsh, BrotherSachelman } from 'src/shared/data'
import { render } from 'src/shared/test'
import { joinStringArrayWithComma } from 'src/shared/utils'

it('should display all UI segments of a card when face up', () => {
  const { name, strength, cost, description, flavor, categories } =
    BrotherSachelman

  const { getByRole, getByText } = render(
    <CardComponent id="1" card={BrotherSachelman} />,
  )

  expect(getByRole('heading', { level: 3 }).textContent).toContain(
    `${name}${strength}`,
  )
  expect(getByText(`Cost: ${cost}`)).toBeTruthy()
  expect(getByText(joinStringArrayWithComma(categories))).toBeTruthy()
  expect(getByText(description[0])).toBeTruthy()
  expect(getByText(flavor)).toBeTruthy()
})

it('should display no strength for an instant', () => {
  const { name } = BookOfAsh
  const { getByRole } = render(<CardComponent id="1" card={BookOfAsh} />)

  expect(getByRole('heading', { level: 3 }).textContent).toContain(name)
})
