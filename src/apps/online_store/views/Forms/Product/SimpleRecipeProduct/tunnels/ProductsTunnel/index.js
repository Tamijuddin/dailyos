import React from 'react'
import { useMutation } from '@apollo/react-hooks'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   Tag,
   TagGroup,
   Text,
   TextButton,
   useMultiList,
} from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CloseIcon } from '../../../../../../assets/icons'
import { SimpleProductContext } from '../../../../../../context/product/simpleProduct'
import { UPDATE_SIMPLE_RECIPE_PRODUCT } from '../../../../../../graphql'
import { TunnelBody, TunnelHeader } from '../styled'

const address =
   'apps.online_store.views.forms.product.inventoryproduct.tunnels.productstunnel.'

const ProductsTunnel = ({ state, close, products }) => {
   const { t } = useTranslation()
   const { productState } = React.useContext(SimpleProductContext)

   const [busy, setBusy] = React.useState(false)
   const [search, setSearch] = React.useState('')
   const [list, selected, selectOption] = useMultiList(products)

   //Mutation
   const [updateProduct] = useMutation(UPDATE_SIMPLE_RECIPE_PRODUCT, {
      onCompleted: () => {
         toast.success('Products added!')
         close(5)
         close(4)
      },
      onError: error => {
         console.log(error)
         toast.error('Error')
         setBusy(false)
      },
   })

   // Handlers
   const save = () => {
      if (busy) return
      setBusy(true)
      const accompaniments = state.accompaniments
      const products = selected.map(el => {
         return {
            id: el.id,
            name: el.name,
            discount: {
               value: '',
            },
         }
      })
      accompaniments[productState.meta.accompanimentTabIndex].products = [
         ...accompaniments[productState.meta.accompanimentTabIndex].products,
         ...products,
      ]
      updateProduct({
         variables: {
            id: state.id,
            set: {
               accompaniments,
            },
         },
      })
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(5)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <Text as="title">
                  {t(address.concat('select products to add'))}
               </Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy
                     ? t(address.concat('saving'))
                     : t(address.concat('save'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder={t(
                     address.concat("type what you're looking for")
                  )}
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
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProductsTunnel
