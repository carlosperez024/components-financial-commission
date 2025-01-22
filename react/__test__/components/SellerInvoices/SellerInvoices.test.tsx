import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { IntlProvider } from 'react-intl'
import { gql } from 'graphql-tag'

import SellerInvoices from '../../../components/SellerInvoices/index'

const mockSetDataTableInvoice = jest.fn()

const INVOICES_QUERY = gql`
  query InvoicesBySeller($sellerInvoiceParams: SellerInvoiceParams!) {
    invoicesBySeller(sellerInvoiceParams: $sellerInvoiceParams) {
      data {
        id
        invoiceCreatedDate
        status
      }
      pagination {
        total
      }
    }
  }
`

const invoicesQueryMock = {
  request: {
    query: INVOICES_QUERY,
    variables: {
      sellerInvoiceParams: {
        sellerName: 'SellerTest',
        dates: {
          startDate: '2023-01-01',
          endDate: '2023-01-31',
        },
        pagination: {
          page: 1,
          pageSize: 20,
        },
      },
    },
  },
  result: {
    data: {
      invoicesBySeller: {
        data: [
          { id: '1', invoiceCreatedDate: '2023-01-01', status: 'Completed' },
        ],
        pagination: { total: 1 },
      },
    },
  },
}

const defaultProps = {
  invoicesQuery: invoicesQueryMock,
  sellerName: 'SellerTest',
  startDate: '2023-01-01',
  finalDate: '2023-01-31',
  dataTableInvoice: [],
  setDataTableInvoice: mockSetDataTableInvoice,
}

describe('SellerInvoices Component', () => {
  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProvider locale="en">
          <SellerInvoices {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    expect(screen.getByText(/table-seller-invoice/i)).toBeInTheDocument()
  })

  it('fetches and displays invoices when query resolves', async () => {
    render(
      <MockedProvider mocks={[invoicesQueryMock]} addTypename={false}>
        <IntlProvider locale="en">
          <SellerInvoices {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    expect(screen.getByText(/table-seller-invoice/i)).toBeInTheDocument()

    await screen.findByText(/Invoice #1/i)

    expect(screen.getByText(/Invoice #1/i)).toBeInTheDocument()
  })

  it('handles pagination actions correctly', async () => {
    render(
      <MockedProvider mocks={[invoicesQueryMock]} addTypename={false}>
        <IntlProvider locale="en">
          <SellerInvoices {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    const nextButton = screen.getByText(/Next/i)

    fireEvent.click(nextButton)

    expect(mockSetDataTableInvoice).toHaveBeenCalled()
  })
})
