import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   useMultiList,
   TunnelHeader,
} from '@dailykit/ui'
import React from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'

import { TunnelContainer } from '../../../../components'
import { UPDATE_SACHET_WORK_ORDER } from '../../../../graphql'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

const onError = error => {
   console.log(error)
   toast.error(error.message)
}

export default function SelectLabelTemplateTunnel({ close, state }) {
   const { t } = useTranslation()

   const [search, setSearch] = React.useState('')
   const [data] = React.useState([
      {
         id: 1,
         title: 'Slip Name',
      },
      { id: 2, title: 'Bar Code' },
      {
         id: 3,
         title: 'Sachet Quantity',
      },
      { id: 4, title: 'Supplier Name' },
      { id: 5, title: 'Packaging date' },
   ])

   const [list, selected, selectOption] = useMultiList(data || [])

   const [updateSachetWorkOrder] = useMutation(UPDATE_SACHET_WORK_ORDER, {
      onCompleted: () => {
         toast.info('Work Order updated successfully!')
         close(1)
      },
      onError,
   })

   const handleNext = () => {
      updateSachetWorkOrder({
         variables: {
            id: state.id,
            set: {
               label: selected,
            },
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select label templates'))}
            close={() => close(1)}
            right={{ title: 'Save', action: handleNext }}
         />
         <TunnelContainer>
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
               />
               {selected.length > 0 && (
                  <TagGroup style={{ margin: '8px 0' }}>
                     {selected.map(option => (
                        <Tag
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                        >
                           {option.title}
                        </Tag>
                     ))}
                  </TagGroup>
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="MSL1"
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                           isActive={selected.find(
                              item => item.id === option.id
                           )}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelContainer>
      </>
   )
}
