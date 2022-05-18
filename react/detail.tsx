/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/display-name */
import type { FC } from 'react'
import React, { useState, useEffect } from 'react'
import {
  Layout,
  Tab,
  Tabs,
  PageBlock,
  PageHeader,
  Tag,
  IconVisibilityOff,
  ButtonWithIcon,
  Divider,
  Modal,
} from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import { useLazyQuery } from 'react-apollo'
import type { DocumentNode } from 'graphql'

import { ModalConfirm, TableComponent, Filter, EmptyTable } from './components'
import PaginationComponent from './components/Table/Tablev2/pagination'
import { status } from './constants'

interface DetailProps {
  account?: string
  dataSellers?: any
  ordersQuery: DocumentNode
  invoiceMutation: DocumentNode
  invoicesQuery: DocumentNode
}

const CommissionReportDetail: FC<DetailProps> = (props) => {
  const {
    account,
    ordersQuery,
    invoiceMutation,
    dataSellers,
    invoicesQuery,
  } = props

  const { query } = useRuntime()
  const [startDate, setStartDate] = useState('')
  const [finalDate, setFinalDate] = useState('')
  const [defaultStartDate, setDefaultStartDate] = useState('')
  const [defaultFinalDate, setDefaultFinalDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [itemFrom, setItemFrom] = useState(1)
  const [itemTo, setItemTo] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [optionsSelect, setOptionsSelect] = useState<DataFilter[]>([])
  const [sellerName, setSellerName] = useState(account ?? '')
  const [tabs, setTabs] = useState(1)
  const [dataTableOrders, setDataTableOrders] = useState<any>([])
  const [dataTableInvoice, setDataTableInvoice] = useState<any>([])
  const [openModal, setOpenModal] = useState(false)
  const [dateRate, setDataRate] = useState<any>([])
  const [optionsStatus, setOptionsStatus] = useState<any>([])
  const [statusOrders, setStatusOrders] = useState('')

  const schemaTableInvoice = [
    {
      id: 'id',
      title: 'ID invoice',
      cellRenderer: (cell: CellRendererProps) => {
        return (
          <a
            href="#"
            style={{ color: '#0C389F' }}
            target="_blank"
            rel="noreferrer"
          >
            {cell.data}
          </a>
        )
      },
    },
    {
      id: 'invoiceCreatedDate',
      title: 'Invoice Created Date',
    },
    {
      id: 'status',
      title: 'Status',
    },
  ]

  const schemaTable = [
    {
      id: 'id',
      title: 'Order ID',
      cellRenderer: (cell: CellRendererProps) => {
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            href={`/admin/checkout/#/orders/${cell.data}`}
            style={{ color: '#0C389F' }}
            target="_blank"
            rel="noreferrer"
          >
            {cell.data}
          </a>
        )
      },
    },
    {
      id: 'creationDate',
      title: 'Creation Date',
    },
    {
      id: 'totalOrder',
      title: 'Total Order',
      cellRenderer: (cell: CellRendererProps) => {
        return <span>${cell.data}</span>
      },
    },
    {
      id: 'totalCommission',
      title: 'Total Commission',
      cellRenderer: (cell: CellRendererProps) => {
        return <span>${cell.data}</span>
      },
    },
    {
      id: 'rate',
      title: 'Rate',
      cellRenderer: (cell: any) => {
        return (
          <div>
            <ButtonWithIcon
              icon={<IconVisibilityOff />}
              variation="tertiary"
              onClick={() => {
                setOpenModal(!openModal)
                setDataRate(cell.data)
              }}
            />
          </div>
        )
      },
    },
    {
      id: 'status',
      title: 'Status',
      cellRenderer: (cell: any) => {
        return (
          <Tag bgColor={cell.data.bgColor} color={cell.data.fontColor}>
            {cell.data.status}
          </Tag>
        )
      },
    },
  ]

  /* const { data: dataSellers } = useQuery(sellersQuery, {
    ssr: false,
    pollInterval: 0,
    skip: !sellersQuery,
  }) */

  const [
    getDataOrders,
    { data: dataOrders, loading: loadingDataOrders },
  ] = useLazyQuery(ordersQuery, {
    ssr: false,
    pollInterval: 0,
    variables: {
      searchOrdersParams: {
        dateStart: startDate,
        dateEnd: finalDate,
        sellerName,
        page,
        perpage: pageSize,
        status: statusOrders,
      },
    },
  })

  const [getDataInvoices, { data: dataInvoices }] = useLazyQuery(
    invoicesQuery,
    {
      ssr: false,
      pollInterval: 0,
      variables: {
        sellerInvoiceParams: {
          sellerName,
          dates: {
            startDate,
            endDate: finalDate,
          },
          pagination: {
            page,
            pageSize,
          },
        },
      },
    }
  )

  const formatDate = (valueDate: number) => {
    const validateDate = valueDate <= 9 ? `0${valueDate}` : valueDate

    return validateDate
  }

  useEffect(() => {
    if (sellerName === '' && !query?.sellerName) {
      setDataTableOrders([])
      setDataTableInvoice([])
    }
  }, [query, sellerName])

  useEffect(() => {
    if (optionsStatus.length) {
      return
    }

    const buildSelectStatus: any[] = []

    Object.keys(status).forEach((orderStatus) => {
      buildSelectStatus.push({
        value: { id: orderStatus, name: orderStatus },
        label: orderStatus,
      })
    })
    setOptionsStatus(buildSelectStatus)
  }, [optionsStatus])

  useEffect(() => {
    getDataInvoices()
    if (dataInvoices) {
      setDataTableInvoice(dataInvoices.invoicesBySeller)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInvoices, sellerName])

  useEffect(() => {
    if (!dataSellers) {
      return
    }

    const builtSelectSeller: DataFilter[] = []

    dataSellers.getSellers.sellers.forEach((seller: DataSellerSelect) => {
      builtSelectSeller.push({
        value: { id: seller.id, name: seller.name },
        label: seller.name,
      })
    })
    setOptionsSelect(builtSelectSeller)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSellers])

  useEffect(() => {
    const defaultDate = new Date()
    const defaultStart = new Date(
      defaultDate.getFullYear(),
      defaultDate.getMonth(),
      1
    )

    const defaultStartString =
      `${defaultStart.getFullYear()}-${formatDate(
        defaultStart.getMonth() + 1
      )}-` + `01`

    const valueDate = defaultDate.getDate() - 1
    const valueMonth = defaultDate.getMonth() + 1
    const defaultFinal = `${defaultDate.getFullYear()}-${formatDate(
      valueMonth
    )}-${formatDate(valueDate)}`

    setStartDate(defaultStartString)
    setFinalDate(defaultFinal)
    setDefaultStartDate(defaultStartString)
    setDefaultFinalDate(defaultFinal)
  }, [])

  useEffect(() => {
    getDataOrders()

    if (!dataOrders) {
      return
    }

    const dataTable: any = []

    dataOrders.orders.data.forEach((item: any) => {
      // eslint-disable-next-line array-callback-return
      const keyColor = Object.keys(status).find(
        (itemStatus: any) => itemStatus === item.status
      )

      dataTable.push({
        id: account ? item.sellerOrderId : item.orderId,
        creationDate: item.creationDate.substring(
          0,
          item.creationDate.indexOf('T')
        ),
        totalOrder: item.totalOrderValue,
        totalCommission: item.totalComission,
        rate: item.rate,
        status: {
          status: item.status,
          bgColor: keyColor ? status[keyColor].bgColor : '',
          fontColor: keyColor ? status[keyColor].fontColor : '',
        },
      })
    })
    setDataTableOrders(dataTable)
    setTotalItems(dataOrders.orders.paging.total)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataOrders, sellerName])

  const onNextClick = () => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const nextPage = page + 1

    const currentTo = pageSize * nextPage
    const currentFrom = itemTo + 1

    setItemTo(currentTo)
    setItemFrom(currentFrom)
    setPage(nextPage)
  }

  const changeRows = (row: number) => {
    setPageSize(row)
    setItemTo(row)
    setItemFrom(1)
    setPage(1)
  }

  const onPrevClick = () => {
    const previousPage = page - 1

    const currentTo = itemTo - pageSize
    const currentFrom = itemFrom - pageSize

    setItemTo(currentTo)
    setItemFrom(currentFrom)
    setPage(previousPage)
  }

  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin/navigation.detail-title" />}
        />
      }
    >
      <Modal
        centered
        isOpen={openModal}
        onClose={() => setOpenModal(!openModal)}
      >
        <div className="mb3">
          {dateRate.map((elmRate: any) => (
            <div key={elmRate.itemId}>
              <h2>Item ID: #{elmRate.itemId}</h2>
              <p>
                <b>Name Item: </b> {elmRate.nameItem}
              </p>
              <p>
                <b>Freight Commission Percentage: </b>
                {elmRate.rate.freightCommissionPercentage}%
              </p>
              <p>
                <b>Producto Commission Percentage: </b>
                {elmRate.rate.productCommissionPercentage}%
              </p>
              <Divider />
            </div>
          ))}
        </div>
      </Modal>
      <div className="mt4 mb7">
        {startDate && finalDate && (
          <div className="mt2">
            <PageBlock>
              <div className="mt4 mb5">
                <Filter
                  startDatePicker={new Date(`${startDate}T00:00:00`)}
                  finalDatePicker={new Date(`${finalDate}T00:00:00`)}
                  optionsSelect={optionsSelect}
                  setStartDate={setStartDate}
                  setFinalDate={setFinalDate}
                  defaultStartDate={defaultStartDate}
                  defaultFinalDate={defaultFinalDate}
                  setSellerId={setSellerName}
                  multiValue={false}
                  optionsStatus={optionsStatus}
                  setStatusOrders={setStatusOrders}
                  disableSelect={Boolean(account)}
                />
              </div>
            </PageBlock>
          </div>
        )}
      </div>
      <div className="mt7">
        <Tabs fullWidth>
          <Tab
            label={<FormattedMessage id="admin/table.title-tab-commission" />}
            active={tabs === 1}
            onClick={() => setTabs(1)}
          >
            {dataTableOrders.length > 0 ? (
              <div className="mt5">
                <PageBlock>
                  {statusOrders === 'invoiced' ? (
                    <ModalConfirm
                      buttonMessage={
                        <FormattedMessage id="admin/form-settings.button-invoice" />
                      }
                      messages={{
                        warning: (
                          <FormattedMessage id="admin/modal-setting.warning" />
                        ),
                        confirmation: (
                          <FormattedMessage id="admin/modal-setting.confirmation" />
                        ),
                      }}
                      sellerData={{ startDate, finalDate, sellerName }}
                      invoiceMutation={invoiceMutation}
                    />
                  ) : null}
                  <div className="mt2">
                    <TableComponent
                      schemaTable={schemaTable}
                      items={dataTableOrders}
                      loading={loadingDataOrders}
                    />
                    <PaginationComponent
                      setPageSize={setPageSize}
                      currentPage={itemFrom}
                      pageSize={itemTo}
                      setPage={setPage}
                      totalItems={totalItems}
                      onNextClick={onNextClick}
                      changeRows={changeRows}
                      onPrevClick={onPrevClick}
                    />
                  </div>
                </PageBlock>
              </div>
            ) : (
              <EmptyTable />
            )}
          </Tab>
          <Tab
            label={<FormattedMessage id="admin/table.title-tab-invoices" />}
            active={tabs === 2}
            onClick={() => setTabs(2)}
          >
            <div className="mt5">
              {dataTableInvoice.length > 0 ? (
                <PageBlock>
                  <div>
                    <TableComponent
                      schemaTable={schemaTableInvoice}
                      items={dataTableInvoice}
                      loading={false}
                    />
                  </div>
                </PageBlock>
              ) : (
                <EmptyTable />
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </Layout>
  )
}

export default CommissionReportDetail