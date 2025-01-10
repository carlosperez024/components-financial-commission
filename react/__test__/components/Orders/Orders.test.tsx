import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import Orders from './Orders'
import { ordersQueryMock, dataOrdersMock } from './__mocks__/graphqlMocks'

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

  test('renders without crashing', () => {
    render(
      <MockedProvider mocks={dataOrdersMock} addTypename={false}>
        <Orders {...defaultProps} />
      </MockedProvider>
    )

    expect(screen.getByText('Test Seller')).toBeInTheDocument()
    expect(screen.getByText(/admin\/table-seller-order/i)).toBeInTheDocument()
  })

  test('calls useLazyQuery and updates table with data', async () => {
    render(
      <MockedProvider mocks={dataOrdersMock} addTypename={false}>
        <Orders {...defaultProps} />
      </MockedProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Order 1')).toBeInTheDocument()
    })
  })

  test('handles page navigation', async () => {
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

  test('opens modal on button click', async () => {
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
