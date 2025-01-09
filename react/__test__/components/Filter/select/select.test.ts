import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SelectComponent from './SelectComponent'

describe('SelectComponent', () => {
  const mockSetDataFilter = jest.fn()
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]

  const defaultProps = {
    dataFilter: [],
    customLabel: 'Select an Option',
    options,
    setDataFilter: mockSetDataFilter,
    multi: false,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the component with the correct label and options', () => {
    render(<SelectComponent {...defaultProps} />)

    expect(screen.getByText('Select an Option')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  it('calls setDataFilter with a single value when multi is false', () => {
    render(<SelectComponent {...defaultProps} />)

    const select = screen.getByRole('combobox')

    fireEvent.change(select, { target: { value: 'option1' } })

    expect(mockSetDataFilter).toHaveBeenCalledWith([{ value: 'option1', label: 'Option 1' }])
  })

  it('calls setDataFilter with multiple values when multi is true', () => {
    const multiProps = { ...defaultProps, multi: true }
    render(<SelectComponent {...multiProps} />)

    const select = screen.getByRole('combobox')

    fireEvent.change(select, { target: { value: 'option1' } })
    fireEvent.change(select, { target: { value: 'option2' } })

    expect(mockSetDataFilter).toHaveBeenCalledWith([
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ])
  })
})
