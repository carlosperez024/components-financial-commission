import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CommissionReportDetail from '../detail'

const mockProps = {
  account: 'TestAccount',
  ordersQuery: jest.fn(),
  invoiceMutation: jest.fn(),
  dataSellers: {
    getSellers: {
      sellers: [
        { id: '1', name: 'Seller 1' },
        { id: '2', name: 'Seller 2' },
      ],
    },
  },
  invoicesQuery: jest.fn(),
  settingsQuery: jest.fn(),
}

describe('CommissionReportDetail Component', () => {
  test('renders the component with default values', () => {
    render(<CommissionReportDetail {...mockProps} />)

    expect(
      screen.getByText(/admin\/navigation\.detail-title/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/admin\/table\.title-tab-commission/i)
    ).toBeInTheDocument()
  })

  test('allows switching tabs', () => {
    render(<CommissionReportDetail {...mockProps} />)

    const commissionTab = screen.getByText(
      /admin\/table\.title-tab-commission/i
    )
    const invoicesTab = screen.getByText(/admin\/table\.title-tab-invoices/i)

    expect(commissionTab).toBeInTheDocument()
    expect(invoicesTab).toBeInTheDocument()

    fireEvent.click(invoicesTab)
    expect(invoicesTab).toHaveAttribute('aria-selected', 'true')
  })

  test('opens and closes modal', () => {
    render(<CommissionReportDetail {...mockProps} />)

    const openModalButton = screen.getByRole('button', { name: /open modal/i })
    fireEvent.click(openModalButton)

    expect(screen.getByText(/item id:/i)).toBeInTheDocument()

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    expect(screen.queryByText(/item id:/i)).not.toBeInTheDocument()
  })

  test('updates the filter on date change', () => {
    render(<CommissionReportDetail {...mockProps} />)

    const dateInputStart = screen.getByLabelText(/start date/i)
    const dateInputEnd = screen.getByLabelText(/end date/i)

    fireEvent.change(dateInputStart, { target: { value: '2023-01-01' } })
    fireEvent.change(dateInputEnd, { target: { value: '2023-12-31' } })

    expect(dateInputStart).toHaveValue('2023-01-01')
    expect(dateInputEnd).toHaveValue('2023-12-31')
  })
})
