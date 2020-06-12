import {
   IconButton,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   Loader,
} from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { useSubscription } from '@apollo/react-hooks'
import moment from 'moment'

import { AddIcon } from '../../../assets/icons'
import { StyledHeader, StyledWrapper } from '../styled'
import WorkOrderTypeTunnel from './WorkOrderTypeTunnel'
import { Context } from '../../../context/tabs'
import {
   BULK_WORK_ORDERS_SUBSCRIPTION,
   SACHET_WORK_ORDERS_SUBSCRIPTION,
} from '../../../graphql'

const address = 'apps.inventory.views.listings.workorders.'

export default function WorkOrders() {
   const { t } = useTranslation()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)

   const {
      data: bulkWorkOrdersData,
      loading: bulkWorkOrderLoading,
   } = useSubscription(BULK_WORK_ORDERS_SUBSCRIPTION)

   const {
      data: sachetWorkOrdersData,
      loading: sachetWorkOrderLoading,
   } = useSubscription(SACHET_WORK_ORDERS_SUBSCRIPTION)

   if (bulkWorkOrderLoading && sachetWorkOrderLoading) return <Loader />

   let data = []

   if (
      bulkWorkOrdersData &&
      bulkWorkOrdersData.bulkWorkOrders &&
      sachetWorkOrdersData &&
      sachetWorkOrdersData.sachetWorkOrders
   ) {
      data = [
         ...bulkWorkOrdersData.bulkWorkOrders.map(bulkOrders => ({
            ...bulkOrders,
            type: 'bulk',
         })),
         ...sachetWorkOrdersData.sachetWorkOrders.map(sachetOrders => ({
            ...sachetOrders,
            type: 'sachet',
         })),
      ]
   }

   return (
      <>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <WorkOrderTypeTunnel close={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <Text as="h1">{t(address.concat('work orders'))}</Text>
               <IconButton type="solid" onClick={() => openTunnel(1)}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledHeader>

            <DataTable data={data} />

            <br />
         </StyledWrapper>
      </>
   )
}

function DataTable({ data }) {
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const rowClick = (e, row) => {
      const { id, type, status } = row._row.data
      if (type === 'bulk') {
         dispatch({
            type: 'SET_BULK_WORK_ORDER',
            payload: {
               id,
               status,
            },
         })
         addTab('Bulk Work Order', 'bulkOrder')
      } else {
         dispatch({
            type: 'SET_SACHET_WORK_ORDER',
            payload: {
               id,
               status,
            },
         })
         addTab('Sachet Work Order', 'sachetOrder')
      }
   }

   const tableRef = React.useRef()

   const options = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      resizableColumns: true,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
   }

   const columns = [
      { title: 'Status', field: 'status', headerFilter: true },
      {
         title: 'Scheduled On',
         field: 'scheduledOn',
         headerFilter: false,
         hozAlign: 'center',
         formatter: reactFormatter(<ShowDate />),
      },
      {
         title: 'User Assigned',
         field: 'user',
         formatter: reactFormatter(<UserName />),
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'Station Assigned',
         field: 'station',
         formatter: reactFormatter(<StationName />),
         headerFilter: false,
         hozAlign: 'center',
      },
      {
         title: 'Type',
         field: 'type',
         formatter: reactFormatter(<FormatType />),
         headerFilter: false,
         hozAlign: 'center',
      },
   ]

   return (
      <div style={{ width: '95%', margin: '0 auto' }}>
         <ReactTabulator
            ref={tableRef}
            columns={columns}
            data={data}
            rowClick={rowClick}
            options={options}
         />
      </div>
   )
}

function ShowDate({
   cell: {
      _cell: { value },
   },
}) {
   return <>{moment(value).format('MMM Do YY')}</>
}

function UserName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.firstName) return <>{value.firstName}</>
   return 'NA'
}

function StationName({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.name) return <>{value.name}</>
   return 'NA'
}

function FormatType({
   cell: {
      _cell: { value },
   },
}) {
   if (value)
      return <>{value === 'bulk' ? 'Bulk Work Order' : 'Sachet Work Order'}</>

   return 'NA'
}
