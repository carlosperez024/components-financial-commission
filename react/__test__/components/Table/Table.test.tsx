import React from 'react'
import { render, screen } from '@vtex/test-tools/react'
import {
  EXPERIMENTAL_Table as Table,
  EXPERIMENTAL_useTableMeasures as useTableMeasures,
  EXPERIMENTAL_useTableSort as useTableSort,
} from 'vtex.styleguide'

import TableV2 from '../../../components/Table/index'

// Mock vtex.styleguide components
jest.mock('vtex.styleguide', () => ({
  EXPERIMENTAL_Table: jest.fn(({ items, columns }) => (
    <div data-testid="mock-table">
      {items.length} items, {columns.length} columns
    </div>
  )),
  EXPERIMENTAL_useTableMeasures: jest.fn(() => ({
    tableWidth: 800,
    tableHeight: 400,
  })),
  EXPERIMENTAL_useTableSort: jest.fn(() => ({
    sorted: {
      by: null,
      order: null,
    },
    sort: jest.fn(),
  })),
  Spinner: () => <div data-testid="mock-spinner">Loading...</div>,
}))

const mockSchemaTable = [
  {
    id: 'name',
    title: 'Name',
    cellRenderer: ({ data }: { data: string }) => <span>{data}</span>,
  },
  {
    id: 'age',
    title: 'Age',
    cellRenderer: ({ data }: { data: number }) => <span>{data}</span>,
  },
]

const mockItems = [
  { name: 'John Doe', age: 30 },
  { name: 'Jane Smith', age: 25 },
]

const defaultProps = {
  items: mockItems,
  schemaTable: mockSchemaTable,
  loading: false,
  sorting: jest.fn(),
  hiddenColumn: [],
}

describe('TableV2 Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders table with items when data is provided', () => {
    render(<TableV2 {...defaultProps} />)

    const table = screen.getByTestId('mock-table')

    expect(table).toBeInTheDocument()
    expect(table).toHaveTextContent('2 items, 2 columns')
  })

  it('renders spinner when loading', () => {
    render(<TableV2 {...defaultProps} loading />)

    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument()
    expect(screen.queryByTestId('mock-table')).not.toBeInTheDocument()
  })

  it('renders empty table when no items are provided', () => {
    render(<TableV2 {...defaultProps} items={[]} />)

    expect(screen.queryByTestId('mock-table')).not.toBeInTheDocument()
    // Assuming EmptyTable renders some text or element
    expect(screen.getByTestId('empty-table')).toBeInTheDocument()
  })

  it('filters columns based on hiddenColumn prop', () => {
    render(<TableV2 {...defaultProps} hiddenColumn={['age']} />)

    const table = screen.getByTestId('mock-table')

    expect(table).toHaveTextContent('2 items, 1 columns')
  })

  it('calls sorting callback when sort is applied', () => {
    const mockSorting = jest.fn()
    const mockSortedState = {
      by: 'name',
      order: 'ASC',
    }

    // Mock the useTableSort to return a sorted state
    ;(useTableSort as jest.Mock).mockReturnValue({
      sorted: mockSortedState,
      sort: jest.fn(),
    })

    render(<TableV2 {...defaultProps} sorting={mockSorting} />)

    expect(mockSorting).toHaveBeenCalledWith(mockSortedState)
  })

  it('uses table measures hook with correct size', () => {
    render(<TableV2 {...defaultProps} />)

    expect(useTableMeasures).toHaveBeenCalledWith({ size: mockItems.length })
  })

  it('passes correct props to Table component', () => {
    render(<TableV2 {...defaultProps} />)

    expect(Table).toHaveBeenCalledWith(
      expect.objectContaining({
        items: mockItems,
        columns: mockSchemaTable,
        highlightOnHover: true,
      }),
      expect.any(Object)
    )
  })

  it('handles empty hiddenColumn prop correctly', () => {
    render(<TableV2 {...defaultProps} hiddenColumn={[]} />)

    const table = screen.getByTestId('mock-table')

    expect(table).toHaveTextContent('2 items, 2 columns')
  })
})
