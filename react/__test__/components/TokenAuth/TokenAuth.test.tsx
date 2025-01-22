import React from 'react'
import { render, screen, fireEvent, waitFor } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/client/testing'
import { IntlProvider } from 'react-intl'
import { gql } from '@apollo/client'

import TokenAuth from '../../../components/TokenAuth'

// Mock mutations
const EDIT_TOKEN = gql`
  mutation EditToken($sellerId: String!, $isEnable: Boolean!) {
    editToken(sellerId: $sellerId, isEnable: $isEnable)
  }
`

const CREATE_TOKEN = gql`
  mutation CreateToken($accountId: String!) {
    createToken(accountId: $accountId) {
      autheticationToken
    }
  }
`

const messages = {
  'admin/form-settings.button-new': 'New Token',
}

const mockTokenSeller = {
  getToken: {
    autheticationToken: 'existing-token-123',
  },
}

const mocks = [
  {
    request: {
      query: EDIT_TOKEN,
      variables: { sellerId: '123', isEnable: true },
    },
    result: {
      data: {
        editToken: true,
      },
    },
  },
  {
    request: {
      query: CREATE_TOKEN,
      variables: { accountId: '123' },
    },
    result: {
      data: {
        createToken: {
          autheticationToken: 'new-token-456',
        },
      },
    },
  },
]

const defaultProps = {
  sellerId: '123',
  editToken: EDIT_TOKEN,
  createTokenMutation: CREATE_TOKEN,
  tokenSeller: mockTokenSeller,
  activateToogle: true,
}

const renderComponent = (props = defaultProps) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <IntlProvider messages={messages} locale="en">
        <TokenAuth {...props} />
      </IntlProvider>
    </MockedProvider>
  )
}

describe('TokenAuth Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with initial state', () => {
    renderComponent()

    expect(screen.getByText('Autentication Token')).toBeInTheDocument()
    expect(screen.getByText('Deactivated')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('existing-token-123')
    expect(screen.getByText('New Token')).toBeInTheDocument()
  })

  it('displays existing token from props', () => {
    renderComponent()

    const tokenInput = screen.getByRole('textbox')

    expect(tokenInput).toHaveValue('existing-token-123')
  })

  it('handles toggle activation', async () => {
    renderComponent()

    const toggle = screen.getByRole('switch')

    fireEvent.click(toggle)

    await waitFor(() => {
      expect(toggle).toBeChecked()
      expect(screen.getByText('Activated')).toBeInTheDocument()
    })
  })

  it('enables new token button when toggle is activated', async () => {
    renderComponent()

    const toggle = screen.getByRole('switch')

    fireEvent.click(toggle)

    await waitFor(() => {
      const newTokenButton = screen.getByText('New Token')

      expect(newTokenButton).not.toBeDisabled()
    })
  })

  it('creates new token when button is clicked', async () => {
    renderComponent()

    // First activate the toggle
    const toggle = screen.getByRole('switch')

    fireEvent.click(toggle)

    await waitFor(() => {
      expect(toggle).toBeChecked()
    })

    // Click new token button
    const newTokenButton = screen.getByText('New Token')

    fireEvent.click(newTokenButton)

    // Wait for new token to be displayed
    await waitFor(() => {
      const tokenInput = screen.getByRole('textbox')

      expect(tokenInput).toHaveValue('new-token-456')
    })
  })

  it('disables new token button when toggle is deactivated', () => {
    renderComponent()

    const newTokenButton = screen.getByText('New Token')

    expect(newTokenButton).toBeDisabled()
  })

  it('renders without toggle when activateToogle is false', () => {
    renderComponent({
      ...defaultProps,
      activateToogle: false,
    })

    expect(screen.queryByRole('switch')).not.toBeInTheDocument()
  })

  it('maintains token input as readonly', () => {
    renderComponent()

    const tokenInput = screen.getByRole('textbox')

    expect(tokenInput).toHaveAttribute('readonly')
  })

  it('shows loading state when creating new token', async () => {
    renderComponent()

    // Activate toggle
    const toggle = screen.getByRole('switch')

    fireEvent.click(toggle)

    await waitFor(() => {
      expect(toggle).toBeChecked()
    })

    // Click new token button
    const newTokenButton = screen.getByText('New Token')

    fireEvent.click(newTokenButton)

    // Check for loading state
    await waitFor(() => {
      expect(newTokenButton).toHaveAttribute('disabled')
    })
  })
})
