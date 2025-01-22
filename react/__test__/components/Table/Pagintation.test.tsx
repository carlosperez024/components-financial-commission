import React from 'react'
import { render, screen, fireEvent } from '@vtex/test-tools/react'
import { IntlProvider } from 'react-intl'
import { Pagination } from 'vtex.styleguide'

import PaginationComponent from '../../../components/Table/pagination'

// Mock vtex.styleguide Pagination component
jest.mock('vtex.styleguide', () => ({
  Pagination: jest.fn(
    ({
      onNextClick,
      onPrevClick,
      onRowsChange,
      currentItemFrom,
      currentItemTo,
      totalItems,
    }) => (
      <div data-testid="mock-pagination">
        <button onClick={onPrevClick} data-testid="prev-button">
          Previous
        </button>
        <select data-testid="rows-select" onChange={onRowsChange}>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
        <span data-testid="pagination-info">
          {currentItemFrom}-{currentItemTo} of {totalItems}
        </span>
        <button onClick={onNextClick} data-testid="next-button">
          Next
        </button>
      </div>
    )
  ),
}))

const messages = {
  'admin/table.pagination-textOf': 'of',
  'admin/table.pagination-show': 'Show',
}

const defaultProps = {
  currentPage: 1,
  pageSize: 20,
  totalItems: 100,
  changeRows: jest.fn(),
  onNextClick: jest.fn(),
  onPrevClick: jest.fn(),
}

const renderComponent = (props = defaultProps) => {
  return render(
    <IntlProvider messages={messages} locale="en">
      <PaginationComponent {...props} />
    </IntlProvider>
  )
}

describe('PaginationComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders pagination when there are items', () => {
    renderComponent()

    expect(screen.getByTestId('mock-pagination')).toBeInTheDocument()
  })

  it('does not render pagination when there are no items', () => {
    renderComponent({ ...defaultProps, totalItems: 0 })

    expect(screen.queryByTestId('mock-pagination')).not.toBeInTheDocument()
  })

  it('calls onNextClick when next button is clicked', () => {
    renderComponent()

    const nextButton = screen.getByTestId('next-button')

    fireEvent.click(nextButton)

    expect(defaultProps.onNextClick).toHaveBeenCalledTimes(1)
  })

  it('calls onPrevClick when previous button is clicked', () => {
    renderComponent()

    const prevButton = screen.getByTestId('prev-button')

    fireEvent.click(prevButton)

    expect(defaultProps.onPrevClick).toHaveBeenCalledTimes(1)
  })

  it('calls changeRows with correct value when rows per page is changed', () => {
    renderComponent()

    const rowsSelect = screen.getByTestId('rows-select')

    fireEvent.change(rowsSelect, { target: { value: '30' } })

    expect(defaultProps.changeRows).toHaveBeenCalledWith(30)
  })

  it('displays correct pagination information', () => {
    renderComponent()

    const paginationInfo = screen.getByTestId('pagination-info')

    expect(paginationInfo).toHaveTextContent('1-20 of 100')
  })

  it('renders with custom page size', () => {
    renderComponent({
      ...defaultProps,
      currentPage: 1,
      pageSize: 30,
    })

    const paginationInfo = screen.getByTestId('pagination-info')

    expect(paginationInfo).toHaveTextContent('1-30 of 100')
  })

  it('renders with custom current page', () => {
    renderComponent({
      ...defaultProps,
      currentPage: 21,
      pageSize: 40,
    })

    const paginationInfo = screen.getByTestId('pagination-info')

    expect(paginationInfo).toHaveTextContent('21-40 of 100')
  })

  it('verifies Pagination component receives correct props', () => {
    renderComponent()

    expect(Pagination).toHaveBeenCalledWith(
      expect.objectContaining({
        rowsOptions: [20, 30, 40, 50],
        currentItemFrom: 1,
        currentItemTo: 20,
        totalItems: 100,
      }),
      expect.any(Object)
    )
  })
})
