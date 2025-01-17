import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { IntlProvider } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import SettingsDetail from '../settingsDetail'

// Mock the runtime hook
jest.mock('vtex.render-runtime', () => ({
  useRuntime: jest.fn(),
}))

// Mock the mutations and queries
const mockCreateTokenMutation = jest.fn()
const mockEditToken = jest.fn()
const mockGetTokenQuery = jest.fn()
const mockCreateSettingsMutation = jest.fn()
const mockGetSettingsQuery = jest.fn()

const defaultProps = {
  createTokenMutation: mockCreateTokenMutation,
  editToken: mockEditToken,
  getTokenQuery: mockGetTokenQuery,
  createSettingsMutation: mockCreateSettingsMutation,
  getSettingsQuery: mockGetSettingsQuery,
}

const mockRuntime = {
  navigate: jest.fn(),
  route: {
    params: {
      sellerId: '123',
    },
  },
  query: {
    name: 'Test Seller',
    integration: 'true',
  },
}

describe('SettingsDetail', () => {
  beforeEach(() => {
    (useRuntime as jest.Mock).mockReturnValue(mockRuntime)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with basic elements', () => {
    render(
      <MockedProvider>
        <IntlProvider locale="en" messages={{}}>
          <SettingsDetail {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    expect(screen.getByText('Billing cycle')).toBeInTheDocument()
    expect(screen.getByText('SAVE')).toBeInTheDocument()
  })

  it('handles billing cycle selection', async () => {
    render(
      <MockedProvider>
        <IntlProvider locale="en" messages={{}}>
          <SettingsDetail {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'Monthly' } })

    const saveButton = screen.getByText('SAVE')
    fireEvent.click(saveButton)

    // Wait for the mutation to be called
    await waitFor(() => {
      expect(mockCreateSettingsMutation).toHaveBeenCalled()
    })
  })

  it('displays success alert after saving settings', async () => {
    const mockSettingsData = {
      data: {
        createSettings: {
          billingCycle: 'Monthly',
          startDate: '2024-03-01',
          endDate: '2024-03-31',
        },
      },
    }

    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <IntlProvider locale="en" messages={{}}>
          <SettingsDetail {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    // Simulate successful settings creation
    await waitFor(() => {
      // Update the component state with mock data
      const successAlert = screen.getByText('Data was updated successfully')
      expect(successAlert).toBeInTheDocument()
    })
  })

  it('navigates back when clicking on header link', () => {
    render(
      <MockedProvider>
        <IntlProvider locale="en" messages={{}}>
          <SettingsDetail {...defaultProps} />
        </IntlProvider>
      </MockedProvider>
    )

    const linkButton = screen.getByText('admin/navigation.settings')
    fireEvent.click(linkButton)

    expect(mockRuntime.navigate).toHaveBeenCalledWith({
      to: '/admin/app/commission-report/settings/',
    })
  })
})
