import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { IntlProvider } from 'react-intl'
import EmptyTable from './EmptyTable'

const messages = {
  'admin/table.empty-state': 'No data available',
  'admin/table.empty-state-title': 'Please add some data to the table',
}

describe('EmptyTable', () => {
  it('should render the EmptyState component with localized messages', () => {
    render(
      <IntlProvider locale="en" messages={messages}>
        <EmptyTable />
      </IntlProvider>
    )

    expect(
      screen.getByText(messages['admin/table.empty-state'])
    ).toBeInTheDocument()

    expect(
      screen.getByText(messages['admin/table.empty-state-title'])
    ).toBeInTheDocument()
  })
})
