import React from 'react'
import { render, screen } from '@vtex/test-tools/react'
// import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import TotalizerComponent from '../components/Dashboard/Totalizer/index'

type StatsTotalizer = {
  label: string
  value: number
}

jest.mock('vtex.styleguide', () => ({
  Spinner: jest.fn(() => <div role="alert" />),
  Totalizer: jest.fn(() => <div data-testid="totalizer-mock" />),
}))

describe('TotalizerComponent', () => {
  it('shows the spinner while is loading', () => {
    render(<TotalizerComponent item={[]} loading />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders totalizer component when this is not loading', () => {
    const items: StatsTotalizer[] = [{ label: 'Total', value: 1000 }]

    render(<TotalizerComponent item={items} loading={false} />)

    expect(screen.getByTestId('totalizer-mock')).toBeInTheDocument()
  })

  it('Does not shows the spinner when is not loading', () => {
    render(<TotalizerComponent item={[]} loading={false} />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
