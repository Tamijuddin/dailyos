import React, { useContext, useEffect } from 'react'
import {
   List,
   ListSearch,
   ListOptions,
   ListItem,
   TagGroup,
   Tag,
   useMultiList,
   ComboButton,
} from '@dailykit/ui'

import { InventoryProductContext } from '../../../../../context/product/inventoryProduct'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import { Content } from '../../styled'
import AddIcon from '../../../../../assets/icons/Add'

export default function AccompanimentType({ close }) {
   const { inventoryProductState, inventoryProductDispatch } = useContext(
      InventoryProductContext
   )
   const [search, setSearch] = React.useState('')

   useEffect(() => {
      inventoryProductState.itemView.accompaniments.forEach(recipe => {
         selectOption('id', recipe.id)
      })
   }, [])

   const [list, selected, selectOption] = useMultiList([
      { id: 1, title: 'Beverages' },
      { id: 2, title: 'Salads' },
      { id: 3, title: 'Sauces' },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title={`Select Accompaniment Types for: ${inventoryProductState.currentInventoryItem.title}`}
            close={() => {
               close(6)
            }}
            next={() => {
               inventoryProductDispatch({
                  type: 'ADD_ACCOMPANIMENT_TYPES',
                  payload: selected,
               })
               close(6)
            }}
            nextAction="Save"
         />
         <Spacer />

         <List>
            <Content>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
               />
               <ComboButton type="ghost" onClick={() => {}}>
                  <AddIcon />
                  New
               </ComboButton>
            </Content>
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
                  .filter(option => option.title.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="MSL1"
                        key={option.id}
                        title={option.title}
                        onClick={() => selectOption('id', option.id)}
                        isActive={selected.find(item => item.id === option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
