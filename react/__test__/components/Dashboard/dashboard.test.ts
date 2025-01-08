import React from 'react'
import { render, screen } from '@testing-library/react'
import TotalizerComponent from './TotalizerComponent'
import { Totalizer } from 'vtex.styleguide'

type StatsTotalizer = {
  label: string
  value: number
}

jest.mock('vtex.styleguide', () => ({
  ...jest.requireActual('vtex.styleguide'),
  Totalizer: jest.fn(() => <div data-testid="totalizer-mock"></div>),
}))

describe('TotalizerComponent', () => {
  test('It shows the spinner while is loading', () => {
    render(<TotalizerComponent item={[]} loading={true} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  test('It renders totalizer component when this is not loading', () => {
    const items: StatsTotalizer[] = [{ label: 'Total', value: 1000 }]

    render(<TotalizerComponent item={items} loading={false} />)

    expect(screen.getByTestId('totalizer-mock')).toBeInTheDocument()
  })

  test('Does not shows the spinner when is not loading', () => {
    render(<TotalizerComponent item={[]} loading={false} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
