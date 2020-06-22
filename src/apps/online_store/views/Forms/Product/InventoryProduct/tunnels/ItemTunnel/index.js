import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'
import { UPDATE_INVENTORY_PRODUCT } from '../../../../../../graphql'
import { TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.itemtunnel.'

export default function ItemTunnel({ state, close, items }) {
   const { t } = useTranslation()
   const { productState } = React.useContext(InventoryProductContext)

   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [list, current, selectOption] = useSingleList(items)

   const [updateProduct] = useMutation(UPDATE_INVENTORY_PRODUCT, {
      variables: {
         id: state.id,
         set: {
            supplierItemId:
               productState.meta.itemType === 'inventory' ? current.id : null,
            sachetItemId:
               productState.meta.itemType === 'sachet' ? current.id : null,
         },
      },
      onCompleted: () => {
         toast.success('Item added!')
         close(3)
         close(2)
      },
      onError: () => {
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const add = () => {
      if (busy) return
      setBusy(true)
      updateProduct()
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select an item'))}
            right={{
               action: add,
               title: busy
                  ? t(address.concat('adding'))
                  : t(address.concat('add')),
            }}
            close={() => close(3)}
         />
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(
                        address.concat("type what you're looking for")
                     )}
                  />
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL1"
                           key={option.id}
                           title={option.title}
                           isActive={option.id === current.id}
                           onClick={() => selectOption('id', option.id)}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </>
   )
}
