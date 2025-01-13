import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import SettingsTable from '../../../components/SettingsTable/index'

const mockSchemaTable = [
  {
    id: 'actions',
    title: 'Actions',
  },
  {
    id: 'totalComission',
    title: 'Total Commission',
  },
  {
    id: 'totalOrderValue',
    title: 'Total Amount',
  },
  {
    id: 'ordersCount',
    title: 'Total Orders',
  },
  {
    id: 'name',
    title: 'Seller Name',
  },
]

const messages = {
  'admin/table-actions': 'Actions',
  'admin/table-total-commission': 'Total Commission',
  'admin/table-total-amount': 'Total Amount',
  'admin/table-total-order': 'Total Orders',
  'admin/table-seller-name': 'Seller Name',
}

const renderComponent = () => {
  return render(
    <IntlProvider messages={messages} locale="en">
      <SettingsTable schemaTable={mockSchemaTable} />
    </IntlProvider>
  )
}

describe('SettingsTable Component', () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderComponent()

    // Check if the settings button is rendered
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('opens modal when clicking settings button', () => {
    renderComponent()

    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    // Check if modal is opened
    expect(screen.getByText('Choose the columns to display')).toBeInTheDocument()
  })

  it('displays all column options in modal', () => {
    renderComponent()

    // Open modal
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    // Check if all column options are displayed
    expect(screen.getByText('Actions')).toBeInTheDocument()
    expect(screen.getByText('Total Commission')).toBeInTheDocument()
    expect(screen.getByText('Total Amount')).toBeInTheDocument()
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('Seller Name')).toBeInTheDocument()
  })

  it('toggles column visibility when clicking toggle button', async () => {
    renderComponent()

    // Open modal
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    // Find and click first toggle
    const firstToggle = screen.getByRole('switch', { name: 'Actions' })
    fireEvent.click(firstToggle)

    // Check if toggle is checked
    await waitFor(() => {
      expect(firstToggle).toBeChecked()
    })

    // Click again to uncheck
    fireEvent.click(firstToggle)

    // Check if toggle is unchecked
    await waitFor(() => {
      expect(firstToggle).not.toBeChecked()
    })
  })

  it('closes modal when clicking close button', () => {
    renderComponent()

    // Open modal
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    // Find and click close button
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    // Check if modal is closed
    expect(screen.queryByText('Choose the columns to display')).not.toBeInTheDocument()
  })

  it('maintains toggle state between modal opens', async () => {
    renderComponent()

    // Open modal
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    // Toggle a column
    const toggle = screen.getByRole('switch', { name: 'Actions' })
    fireEvent.click(toggle)

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    // Reopen modal
    fireEvent.click(settingsButton)

    // Check if toggle state persisted
    await waitFor(() => {
      const toggleAfterReopen = screen.getByRole('switch', { name: 'Actions' })
      expect(toggleAfterReopen).toBeChecked()
    })
  })

  it('handles multiple column toggles correctly', async () => {
    renderComponent()

    // Open modal
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)

    // Toggle multiple columns
    const actionsToggle = screen.getByRole('switch', { name: 'Actions' })
    const commissionToggle = screen.getByRole('switch', { name: 'Total Commission' })

    fireEvent.click(actionsToggle)
    fireEvent.click(commissionToggle)

    // Verify both toggles are checked
    await waitFor(() => {
      expect(actionsToggle).toBeChecked()
      expect(commissionToggle).toBeChecked()
    })
  })
})
