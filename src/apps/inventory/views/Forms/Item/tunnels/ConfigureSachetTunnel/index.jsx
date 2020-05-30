import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { Input, Loader } from '@dailykit/ui'
import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
   Spacer,
   TunnelContainer,
   TunnelHeader,
} from '../../../../../components'
import { ItemContext } from '../../../../../context/item'
import { CREATE_SACHET_ITEM } from '../../../../../graphql'
import { FlexContainer } from '../../../styled'

const address = 'apps.inventory.views.forms.item.tunnels.configuresachettunnel.'

export default function ConfigureSachetTunnel({ close }) {
   const { t } = useTranslation()
   const { state } = useContext(ItemContext)

   const [quantity, setQuantity] = useState('')
   const [par, setPar] = useState('')
   const [maxInventoryLevel, setMaxInventoryLevel] = useState('')

   const [loading, setLoading] = useState(false)

   const [creatSachetItem] = useMutation(CREATE_SACHET_ITEM)

   const handleNext = async () => {
      try {
         setLoading(true)
         const res = await creatSachetItem({
            variables: {
               unitSize: quantity,
               bulkItemId: state.activeProcessing.id,
               unit: state.unit_quantity.unit,
               par,
               maxLevel: maxInventoryLevel,
            },
         })

         if (res?.data?.createSachetItem?.returning[0]?.id) {
            close(9)
            setLoading(false)
            toast.info('Sachet added!')
         }
      } catch (error) {
         close(9)
         setLoading(false)
         console.log(error)
         toast.error('Err! I messed something up :(')
      }
   }

   if (loading) return <Loader />

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat('add sachet'))}
            next={handleNext}
            close={() => close(9)}
            nextAction="Save"
         />

         <Spacer />

         <br />

         <div style={{ width: '30%' }}>
            <Input
               type="text"
               name="quantity"
               value={quantity}
               placeholder={`Sachet Qty (in ${state.unit_quantity.unit})`}
               onChange={e => {
                  const value = parseInt(e.target.value)
                  if (e.target.value.length === 0) setQuantity('')
                  if (value) setQuantity(value)
               }}
            />
         </div>

         <br />

         <FlexContainer
            style={{
               justifyContent: 'space-between',
            }}
         >
            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="text"
                  name="par"
                  value={par}
                  placeholder={t(address.concat('set par level'))}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setPar('')
                     if (value) setPar(value)
                  }}
               />
               <span style={{ marginLeft: '5px' }}>
                  {t(address.concat('pkt'))}
               </span>
            </FlexContainer>

            <FlexContainer style={{ alignItems: 'flex-end', width: '45%' }}>
               <Input
                  type="text"
                  name="inventory level"
                  value={maxInventoryLevel}
                  placeholder={t(address.concat('max inventory level'))}
                  onChange={e => {
                     const value = parseInt(e.target.value)
                     if (e.target.value.length === 0) setMaxInventoryLevel('')
                     if (value) setMaxInventoryLevel(value)
                  }}
               />
               <span style={{ marginLeft: '5px' }}>
                  {t(address.concat('pkt'))}
               </span>
            </FlexContainer>
         </FlexContainer>
      </TunnelContainer>
   )
}
