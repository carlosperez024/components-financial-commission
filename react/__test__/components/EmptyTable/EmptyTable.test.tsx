import React from 'react'
import { render, screen } from '@vtex/test-tools/react'
import '@testing-library/jest-dom'
import { IntlProvider } from 'react-intl'

import EmptyTable from '../components/EmptyTable/index'

jest.mock('vtex.styleguide', () => ({
  EmptyState: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))

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
