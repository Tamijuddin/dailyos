import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { PurchaseOrderContext } from '../../../../../context/purchaseOrder'

const address =
   'apps.inventory.views.forms.purchaseorders.tunnels.selectsupplieritemtunnel.'

export default function AddressTunnel({ close, supplierItems }) {
   const { t } = useTranslation()
   const { purchaseOrderDispatch } = useContext(PurchaseOrderContext)
   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList(supplierItems)

   const handleNext = () => {
      const bulkItemAsShipped = current.bulkItems.find(
         item => item.id === current.bulkItemAsShippedId
      )
      const payload = { ...current, bulkItemAsShipped, bulkItems: [] }
      purchaseOrderDispatch({
         type: 'ADD_SUPPLIER_ITEM',
         payload,
      })
      close(1)
   }
   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('select supplier item'))}
            next={handleNext}
            close={() => close(1)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem type="SSL1" title={current.name} />
            ) : (
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
               />
            )}
            <ListOptions>
               {list
                  .filter(option => option.name.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="SSL1"
                        key={option.id}
                        title={option.name}
                        isActive={option.id === current.id}
                        onClick={() => selectOption('id', option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
