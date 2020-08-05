import { IconButton, Loader, TextButton, Text, Tag } from '@dailykit/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { reactFormatter, ReactTabulator } from 'react-tabulator'

import { AddIcon } from '../../../assets/icons'
import { Context } from '../../../context/tabs'
import { StyledHeader, StyledWrapper } from '../styled'
import { PURCHASE_ORDERS_SUBSCRIPTION } from '../../../graphql'
import tableOptions from '../tableOption'
import { FlexContainer } from '../../Forms/styled'

const address = 'apps.inventory.views.listings.purchaseorders.'

export default function PurchaseOrders() {
   const { t } = useTranslation()
   const { dispatch } = React.useContext(Context)

   const addTab = (title, view) => {
      dispatch({ type: 'ADD_TAB', payload: { type: 'forms', title, view } })
   }

   const { loading, data: { purchaseOrderItems = [] } = {} } = useSubscription(
      PURCHASE_ORDERS_SUBSCRIPTION,
      {
         onError: error => {
            toast.error('Error! Please try reloading the page')
            console.log(error)
         },
      }
   )

   const tableRef = React.useRef()

   const rowClick = (e, row) => {
      const { id, status } = row._row.data
      dispatch({
         type: 'SET_PURCHASE_WORK_ORDER',
         payload: {
            id,
            status,
         },
      })
      addTab('Purchase Order', 'purchaseOrder')
   }

   const columns = [
      { title: 'Status', field: 'status', headerFilter: true },
      {
         title: 'Item',
         field: 'supplierItem',
         headerFilter: false,
         formatter: reactFormatter(<SupplierItemName />),
      },
      {
         title: 'Type',
         field: 'packaging',
         headerFilter: false,
         formatter: reactFormatter(<LabelItem />),
      },
   ]

   if (loading) return <Loader />

   return (
      <>
         <StyledWrapper>
            <StyledHeader>
               <Text as="title">{t(address.concat('purchase orders'))}</Text>
               <FlexContainer>
                  <TextButton
                     type="outline"
                     onClick={() => tableRef.current.table.clearHeaderFilter()}
                  >
                     Clear Filters
                  </TextButton>
                  <span style={{ width: '10px' }} />
                  <IconButton
                     type="solid"
                     onClick={() =>
                        addTab('New Purchase Order', 'purchaseOrder')
                     }
                  >
                     <AddIcon color="#fff" size={24} />
                  </IconButton>
               </FlexContainer>
            </StyledHeader>

            <div style={{ width: '90%', margin: '0 auto' }}>
               <ReactTabulator
                  ref={tableRef}
                  columns={columns}
                  data={purchaseOrderItems}
                  rowClick={rowClick}
                  options={tableOptions}
               />
            </div>
         </StyledWrapper>
      </>
   )
}

function SupplierItemName({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   console.log(data)
   if (data.supplierItem && data.supplierItem.name)
      return data.supplierItem.name
   if (data.packaging && data.packaging.packagingName)
      return data.packaging.packagingName
   return 'NA'
}

function LabelItem({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   if (data.supplierItem && data.supplierItem.name)
      return <Tag color="primary">Supplier Item</Tag>
   if (data.packaging && data.packaging.packagingName)
      return <Tag color="success">Packaging</Tag>
   return <Tag color="danger">NA</Tag>
}
