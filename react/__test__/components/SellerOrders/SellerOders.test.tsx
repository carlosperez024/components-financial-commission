import React from 'react'
import { render, screen, fireEvent, waitFor } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'
import { IntlProvider } from 'react-intl'
import gql from 'graphql-tag'

import SellerOrders from '../components/SellerOrders/index'

jest.mock('../components/ModalConfirm', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Commission Report</div>),
}))

jest.mock('../components/Table', () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div>
      <button>Next</button>
      <div>table-seller-order</div>
    </div>
  )),
}))

jest.mock('../components/Table/pagination', () => ({
  __esModule: true,
  default: jest.fn(() => <div>Mocked PaginationComponent</div>),
}))

// Mock queries
const ORDERS_QUERY = gql`
  query GetOrders($searchOrdersParams: SearchOrdersInput!) {
    orders(searchOrdersParams: $searchOrdersParams) {
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

const SETTINGS_QUERY = gql`
  query GetSettings {
    getSettings {
      integration
    }
  }
`

// Mock data
const mockOrders = {
  orders: {
    data: [
      {
        orderId: '1234',
        sellerOrderId: 'SO-1234',
        creationDate: '2023-01-01T10:00:00',
        totalOrderValue: 100,
        totalComission: 10,
        rate: [{ value: 0.1, type: 'percentage' }],
        status: 'invoiced',
      },
    ],
    paging: {
      total: 1,
    },
  },
}

const mockSettings = {
  getSettings: {
    integration: 'test-integration',
  },
}

const mocks = [
  {
    request: {
      query: ORDERS_QUERY,
      variables: {
        searchOrdersParams: {
          dateStart: '2023-01-01',
          dateEnd: '2023-01-31',
          sellerName: 'SellerTest',
          page: 1,
          perpage: 20,
          status: 'invoiced',
        },
      },
    },
    result: { data: mockOrders },
  },
  {
    request: {
      query: SETTINGS_QUERY,
    },
    result: { data: mockSettings },
  },
]

const mockSetDataRate = jest.fn()
const mockSetDataTableOrders = jest.fn()
const mockSetOpenModal = jest.fn()

const defaultProps = {
  ordersQuery: ORDERS_QUERY,
  settingsQuery: SETTINGS_QUERY,
  invoiceMutation: gql`
    mutation {
      dummy
    }
  `,
  sellerName: 'SellerTest',
  startDate: '2023-01-01',
  finalDate: '2023-01-31',
  statusOrders: 'invoiced',
  setDataRate: mockSetDataRate,
  sellerId: '123',
  setOpenModal: mockSetOpenModal,
  openModal: false,
  dataTableOrders: [],
  setDataTableOrders: mockSetDataTableOrders,
  validRange: true,
}

describe('SellerOrders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en">
          <SellerOrders {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    expect(screen.getByText(/table-seller-order/i)).toBeInTheDocument()
  })

  it('fetches and displays orders when query resolves', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en">
          <SellerOrders {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(mockSetDataTableOrders).toHaveBeenCalled()
    })

    expect(screen.getByText('$100')).toBeInTheDocument()
    expect(screen.getByText('$10')).toBeInTheDocument()
  })

  it('handles pagination correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en">
          <SellerOrders {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    const nextButton = screen.getByText(/Next/i)

    fireEvent.click(nextButton)

    // Check if pagination state updates
    await waitFor(() => {
      expect(screen.getByText('21-40')).toBeInTheDocument()
    })
  })

  it('opens rate modal when clicking view button', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en">
          <SellerOrders {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    await waitFor(() => {
      const viewButton = screen.getByRole('button')

      fireEvent.click(viewButton)
    })

    expect(mockSetOpenModal).toHaveBeenCalledWith(true)
    expect(mockSetDataRate).toHaveBeenCalled()
  })

  it('clears table data when seller name is empty', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <IntlProvider locale="en">
          <SellerOrders {...defaultProps} sellerName="" />
        </IntlProvider>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(mockSetDataTableOrders).toHaveBeenCalledWith([])
    })
  })
})
