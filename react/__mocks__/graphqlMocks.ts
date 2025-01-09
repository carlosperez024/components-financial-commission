export const invoicesQueryMock = {
  request: {
    query: INVOICES_QUERY,
    variables: {
      sellerInvoiceParams: {
        sellerName: 'SellerTest',
        dates: {
          startDate: '2023-01-01',
          endDate: '2023-01-31',
        },
        pagination: {
          page: 1,
          pageSize: 20,
        },
      },
    },
  },
  result: {
    data: {
      invoicesBySeller: {
        data: [
          { id: '1', invoiceCreatedDate: '2023-01-01', status: 'Completed' },
        ],
        pagination: { total: 1 },
      },
    },
  },
}
