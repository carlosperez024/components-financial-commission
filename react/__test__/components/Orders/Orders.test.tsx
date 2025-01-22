import React from 'react'
import { render, screen, fireEvent, waitFor } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/client/testing'
import type { DocumentNode } from 'graphql'
import { gql } from 'graphql'

import Orders from '../../../components/Orders/index'

const ordersQueryMock: DocumentNode = gql`
  query OrdersQuery($searchOrdersParams: SearchOrdersParams!) {
    orders(params: $searchOrdersParams) {
      data {
        orderId
        sellerOrderId
        creationDate
        totalOrderValue
        totalComission
        rate
        status
      }
      paging {
        total
      }
    }
  }
`

const dataOrdersMock = [
  {
    request: {
      query: ordersQueryMock,
      variables: {
        searchOrdersParams: {
          dateStart: '2023-01-01',
          dateEnd: '2023-01-31',
          sellerName: 'Test Seller',
          page: 1,
          perpage: 20,
          status: 'invoiced',
        },
      },
    },
    result: {
      data: {
        orders: {
          data: [
            {
              orderId: 'order-1',
              sellerOrderId: 'seller-order-1',
              creationDate: '2023-01-01T12:00:00Z',
              totalOrderValue: 100,
              totalComission: 10,
              rate: 5,
              status: 'invoiced',
            },
            {
              orderId: 'order-2',
              sellerOrderId: 'seller-order-2',
              creationDate: '2023-01-02T12:00:00Z',
              totalOrderValue: 200,
              totalComission: 20,
              rate: 4,
              status: 'pending',
            },
          ],
          paging: {
            total: 2,
          },
        },
      },
    },
  },
]

describe('Orders Component', () => {
  const defaultProps = {
    account: 'test-account',
    sellerName: 'Test Seller',
    ordersQuery: ordersQueryMock,
    startDate: '2023-01-01',
    finalDate: '2023-01-31',
    statusOrders: 'invoiced',
    setDataRate: jest.fn(),
    sellerId: 'seller-123',
    invoiceMutation: jest.fn(),
    setOpenModal: jest.fn(),
    openModal: false,
    dataTableOrders: [],
    setDataTableOrders: jest.fn(),
    validRange: true,
  }

  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={dataOrdersMock} addTypename={false}>
        <Orders {...defaultProps} />
      </MockedProvider>
    )

    expect(screen.getByText('Test Seller')).toBeInTheDocument()
    expect(screen.getByText(/admin\/table-seller-order/i)).toBeInTheDocument()
  })

  it('calls useLazyQuery and updates table with data', async () => {
    render(
      <MockedProvider mocks={dataOrdersMock} addTypename={false}>
        <Orders {...defaultProps} />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Order 1')).toBeInTheDocument()
    })
  })

  it('handles page navigation', async () => {
    render(
      <MockedProvider mocks={dataOrdersMock} addTypename={false}>
        <Orders {...defaultProps} />
      </MockedProvider>
    )

    const nextButton = screen.getByRole('button', { name: /next/i })

    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(defaultProps.setPage).toHaveBeenCalledWith(2)
    })
  })

  it('opens modal on button click', async () => {
    render(
      <MockedProvider mocks={dataOrdersMock} addTypename={false}>
        <Orders {...defaultProps} />
      </MockedProvider>
    )

    const rateButton = screen.getByTestId('rate-button') // Usa un `data-testid` en el botón.

    fireEvent.click(rateButton)

    expect(defaultProps.setOpenModal).toHaveBeenCalledWith(true)
  })
})
