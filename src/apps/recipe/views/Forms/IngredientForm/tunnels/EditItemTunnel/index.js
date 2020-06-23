import React from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
   TunnelHeader,
} from '@dailykit/ui'
import { IngredientContext } from '../../../../../context/ingredient'
import { TunnelBody } from '../styled'

const EditItemTunnel = ({ closeTunnel, items }) => {
   const { ingredientState, ingredientDispatch } = React.useContext(
      IngredientContext
   )

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(items)

   React.useEffect(() => {
      if (Object.keys(current).length) {
         ingredientDispatch({
            type: 'EDIT_MODE',
            payload: {
               ...ingredientState.editMode,
               bulkItem:
                  ingredientState.editMode.type === 'realTime' ? current : null,
               sachetItem:
                  ingredientState.editMode.type === 'plannedLot'
                     ? current
                     : null,
            },
         })
         closeTunnel(4)
      }
   }, [current])

   return (
      <>
         <TunnelHeader title="Select Item" close={() => closeTunnel(4)} />
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem type="SSL1" title={current.title} />
               ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder="type what you’re looking for..."
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

export default EditItemTunnel
