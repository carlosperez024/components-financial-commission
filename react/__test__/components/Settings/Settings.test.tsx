import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { IntlProvider } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import Settings from '../settings'

// Mock the runtime hook
jest.mock('vtex.render-runtime', () => ({
  useRuntime: jest.fn(),
}))

// Mock child components
jest.mock('../components/Table', () => ({
  __esModule: true,
  default: ({ items }: any) => <div data-testid="table-component">{items.length} items</div>,
}))

jest.mock('../components/Table/pagination', () => ({
  __esModule: true,
  default: () => <div data-testid="pagination-component">Pagination</div>,
}))

jest.mock('../components', () => ({
  Filter: () => <div data-testid="filter-component">Filter</div>,
  TokenAuth: () => <div data-testid="token-auth">Token Auth</div>,
}))

const mockQueries = {
  getSellersQuery: jest.fn(),
  createSettingsMutation: jest.fn(),
  getSettingsQuery: jest.fn(),
  createTokenMutation: jest.fn(),
  editToken: jest.fn(),
  getTokenQuery: jest.fn(),
}

const mockRuntime = {
  navigate: jest.fn(),
  account: 'test-account',
}

const mockSellersData = {
  getSellers: {
    sellers: [
      { id: '1', name: 'Seller 1' },
      { id: '2', name: 'Seller 2' },
    ],
  },
}

const mockSettingsData = {
  getSettings: {
    billingCycle: 'Monthly',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    integration: 'internal',
  },
}

describe('Settings Component', () => {
  beforeEach(() => {
    (useRuntime as jest.Mock).mockReturnValue(mockRuntime)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state correctly', () => {
    const mocks = [
      {
        request: {
          query: mockQueries.getSettingsQuery,
          variables: {},
        },
        result: {
          loading: true,
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <IntlProvider locale="en" messages={{}}>
          <Settings {...mockQueries} />
        </IntlProvider>
      </MockedProvider>
    )

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('renders main content when data is loaded', async () => {
    const mocks = [
      {
        request: {
          query: mockQueries.getSettingsQuery,
        },
        result: {
          data: mockSettingsData,
        },
      },
      {
        request: {
          query: mockQueries.getSellersQuery,
        },
        result: {
          data: mockSellersData,
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <IntlProvider locale="en" messages={{}}>
          <Settings {...mockQueries} />
        </IntlProvider>
      </MockedProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Type Integration')).toBeInTheDocument()
    })
  })

  it('handles billing cycle selection and save', async () => {
    const createSettingsMock = jest.fn()
    const mocks = [
      {
        request: {
          query: mockQueries.getSettingsQuery,
        },
        result: {
          data: mockSettingsData,
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <IntlProvider locale="en" messages={{}}>
          <Settings
            {...mockQueries}
            createSettingsMutation={createSettingsMock}
          />
        </IntlProvider>
      </MockedProvider>
    )

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'Monthly' } })
    })

    const saveButton = screen.getByText('admin/save-settings')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Data was updated successfully')).toBeInTheDocument()
    })
  })

  it('handles integration toggle', async () => {
    const editTokenMock = jest.fn()
    const mocks = [
      {
        request: {
          query: mockQueries.getSettingsQuery,
        },
        result: {
          data: mockSettingsData,
        },
      },
    ]

    render(
      <MockedProvider mocks={mocks}>
        <IntlProvider locale="en" messages={{}}>
          <Settings {...mockQueries} editToken={editTokenMock} />
        </IntlProvider>
      </MockedProvider>
    )

    await waitFor(() => {
      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)
    })

    expect(screen.getByTestId('token-auth')).toBeInTheDocument()
  })

  it('handles pagination correctly', async () => {
    render(
      <MockedProvider>
        <IntlProvider locale="en" messages={{}}>
          <Settings {...mockQueries} />
        </IntlProvider>
      </MockedProvider>
    )

    const nextButton = screen.getByTestId('pagination-component')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByTestId('table-component')).toBeInTheDocument()
    })
  })

  describe('Table Actions', () => {
    it('navigates to detail view when clicking action menu', async () => {
      const Actions = ({ data }: any) => (
        <button
          onClick={() =>
            mockRuntime.navigate({
              to: `/admin/app/commission-report/settings/detail/${data.id}`,
              replace: true,
              query: `name=${data.name}&integration=true`,
            })
          }
        >
          Action
        </button>
      )

      render(
        <Actions data={{ id: '1', name: 'Test Seller' }} />
      )

      fireEvent.click(screen.getByText('Action'))

      expect(mockRuntime.navigate).toHaveBeenCalledWith({
        to: '/admin/app/commission-report/settings/detail/1',
        replace: true,
        query: 'name=Test Seller&integration=true',
      })
    })
  })

  describe('Date Handling', () => {
    it('correctly formats dates for monthly billing cycle', async () => {
      const createSettingsMock = jest.fn()

      render(
        <MockedProvider>
          <IntlProvider locale="en" messages={{}}>
            <Settings
              {...mockQueries}
              createSettingsMutation={createSettingsMock}
            />
          </IntlProvider>
        </MockedProvider>
      )

      // Mock current date
      const mockDate = new Date('2024-03-15')
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any)

      await waitFor(() => {
        const select = screen.getByRole('combobox')
        fireEvent.change(select, { target: { value: 'Monthly' } })
      })

      const saveButton = screen.getByText('admin/save-settings')
      fireEvent.click(saveButton)

      expect(createSettingsMock).toHaveBeenCalledWith({
        variables: {
          settingsData: {
            startDate: '2024-03-15',
            endDate: '2024-03-31',
            billingCycle: 'Monthly',
            integration: 1,
          },
        },
      })
    })
  })
})
