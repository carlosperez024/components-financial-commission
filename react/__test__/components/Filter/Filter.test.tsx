import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Filter from '../../../components/Filter/index'
import { useRuntime } from 'vtex.render-runtime'

jest.mock('vtex.render-runtime', () => ({
  useRuntime: jest.fn(),
}))

const mockSetQuery = jest.fn()

describe('Filter Component', () => {
  beforeEach(() => {
    (useRuntime as jest.Mock).mockReturnValue({
      query: {},
      setQuery: mockSetQuery,
    })
  })

  it('renders correctly with default props', () => {
    render(
      <Filter
        optionsSelect={[]}
        optionsStatus={[]}
        setSellerId={jest.fn()}
        setStatusOrders={jest.fn()}
        setTotalItems={jest.fn()}
        filterDates={jest.fn()}
        defaultDate={{ today: true }}
        disableSelect={false}
      />
    )

    expect(screen.getByText('Filter')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls setQuery when applying filters', () => {
    render(
      <Filter
        optionsSelect={[
          { value: '1', label: 'Seller 1' },
          { value: '2', label: 'Seller 2' },
        ]}
        optionsStatus={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        setSellerId={jest.fn()}
        setStatusOrders={jest.fn()}
        setTotalItems={jest.fn()}
        filterDates={jest.fn()}
        defaultDate={{ today: true }}
        disableSelect={false}
      />
    )

    const filterButton = screen.getByRole('button', { name: /Filter/i })
    fireEvent.click(filterButton)

    expect(mockSetQuery).toHaveBeenCalled()
  })

  it('resets filters when clicking the delete button', () => {
    const mockSetSellerId = jest.fn()
    const mockSetTotalItems = jest.fn()

    render(
      <Filter
        optionsSelect={[]}
        optionsStatus={[]}
        setSellerId={mockSetSellerId}
        setTotalItems={mockSetTotalItems}
        filterDates={jest.fn()}
        defaultDate={{ today: true }}
        disableSelect={false}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /Delete/i })
    fireEvent.click(deleteButton)

    expect(mockSetSellerId).toHaveBeenCalledWith('')
    expect(mockSetTotalItems).toHaveBeenCalledWith(0)
  })

  it('handles changes in date filters', () => {
    const mockFilterDates = jest.fn()

    render(
      <Filter
        optionsSelect={[]}
        optionsStatus={[]}
        setSellerId={jest.fn()}
        setTotalItems={jest.fn()}
        filterDates={mockFilterDates}
        defaultDate={{ today: true }}
        disableSelect={false}
      />
    )

    const datePickers = screen.getAllByRole('textbox')
    fireEvent.change(datePickers[0], { target: { value: '2023-01-01' } })
    fireEvent.change(datePickers[1], { target: { value: '2023-12-31' } })

    expect(mockFilterDates).toHaveBeenCalled()
  })
})
