import React from 'react'
import { render, screen, fireEvent } from '@vtex/test-tools/react'
import { IntlProvider } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import DatePickerComponent from '../../../../components/Filter/datePicker/index'

jest.mock('vtex.render-runtime', () => ({
  useRuntime: jest.fn(),
}))

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }: { id: string }) => <span>{id}</span>,
}))

describe('DatePickerComponent', () => {
  const mockChangeDate = jest.fn()
  const mockStartDate = new Date()
  const mockFinalDate = new Date()

  beforeEach(() => {
    mockChangeDate.mockClear()
    ;(useRuntime as jest.Mock).mockReturnValue({ culture: { locale: 'en' } })
  })

  it('renders the date pickers', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <DatePickerComponent
          startDatePicker={mockStartDate}
          finalDatePicker={mockFinalDate}
          changeDate={mockChangeDate}
          today
        />
      </IntlProvider>
    )

    expect(
      screen.getByText(/admin\/table\.title-datepicker-start/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/admin\/table\.title-datepicker-final/i)
    ).toBeInTheDocument()
  })

  it('calls changeDate when start date is changed', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <DatePickerComponent
          startDatePicker={mockStartDate}
          finalDatePicker={mockFinalDate}
          changeDate={mockChangeDate}
          today
        />
      </IntlProvider>
    )

    const startDatePicker = screen.getByLabelText(
      /admin\/table\.title-datepicker-start/i
    )

    fireEvent.change(startDatePicker, { target: { value: '2025-01-10' } })

    expect(mockChangeDate).toHaveBeenCalledWith(new Date('2025-01-10'), 'start')
  })

  it('calls changeDate when final date is changed', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <DatePickerComponent
          startDatePicker={mockStartDate}
          finalDatePicker={mockFinalDate}
          changeDate={mockChangeDate}
          today
        />
      </IntlProvider>
    )

    const finalDatePicker = screen.getByLabelText(
      /admin\/table\.title-datepicker-final/i
    )

    fireEvent.change(finalDatePicker, { target: { value: '2025-01-15' } })

    expect(mockChangeDate).toHaveBeenCalledWith(new Date('2025-01-15'), 'final')
  })
})
