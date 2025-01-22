/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@vtex/test-tools/react'

import FilterBarComponent from '../../../../components/Filter/filterBar/index'
import '@testing-library/jest-dom/extend-expect'

jest.mock('vtex.styleguide', () => ({
  FilterBar: ({
    alwaysVisibleFilters,
    statements,
    onChangeStatements,
    clearAllFiltersButtonLabel,
    options,
  }: any) => (
    <div data-testid="filter-bar">
      <span>{clearAllFiltersButtonLabel}</span>
      <div>
        {alwaysVisibleFilters.map((filter: string) => (
          <div key={filter} data-testid={`filter-${filter}`}>
            {filter}
          </div>
        ))}
      </div>
      {options.totalOrders.verbs.map((verb: { label: string }) => (
        <div key={verb.value} data-testid={`verb-${verb.value}`}>
          {verb.label}
        </div>
      ))}
    </div>
  ),
}))

describe('FilterBarComponent', () => {
  it('should render the FilterBar with the correct elements', () => {
    render(<FilterBarComponent />)

    const clearButton = screen.getByText('Clear Filters')

    expect(clearButton).toBeInTheDocument()

    const totalOrdersFilter = screen.getByTestId('filter-totalOrders')

    expect(totalOrdersFilter).toBeInTheDocument()

    const verbs = ['is', 'is not', 'contains']

    verbs.forEach((verb) => {
      const verbElement = screen.getByTestId(`verb-${verb}`)

      expect(verbElement).toBeInTheDocument()
      expect(verbElement).toHaveTextContent(verb)
    })
  })

  it('should render the correct number of verbs for totalOrders', () => {
    render(<FilterBarComponent />)

    const verbs = screen.getAllByTestId(/verb-/)

    expect(verbs).toHaveLength(3)
  })
})
