import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'

// Mutations
import { CREATE_SUPPLIER_ITEM } from '../../../../../graphql'

import { TextButton, Input, Loader } from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelHeader,
   TunnelBody,
   StyledRow,
   StyledInputGroup,
   Highlight,
   InputWrapper,
   StyledSelect,
   StyledLabel,
} from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.item.tunnels.info.'

export default function InfoTunnel({ close, next }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(ItemContext)
   const [loading, setLoading] = useState(false)

   const [createSupplierItem] = useMutation(CREATE_SUPPLIER_ITEM)

   const handleNext = async () => {
      setLoading(true)

      if (
         !state.title ||
         !state.supplier.id ||
         !state.unit_quantity.value ||
         !state.unit_quantity.unit
      )
         return setLoading(false)

      const res = await createSupplierItem({
         variables: {
            name: state.title,
            supplierId: state.supplier.id,
            unit: state.unit_quantity.unit,
            unitSize: +state.unit_quantity.value,
         },
      })

      if (res?.data?.createSupplierItem) {
         setLoading(false)
         dispatch({
            type: 'ADD_ITEM_ID',
            payload: res?.data?.createSupplierItem?.returning[0]?.id,
         })
         close()
         next()
         toast.success('Item created!')
      }
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon size={24} />
               </span>
               <span>{t(address.concat('item information'))}</span>
            </div>
            <div>
               <TextButton type="solid" onClick={handleNext}>
                  {t(address.concat('next'))}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <Input
                     type="text"
                     label={t(address.concat("item name"))}
                     name="title"
                     value={state.title}
                     onChange={e =>
                        dispatch({
                           type: 'TITLE',
                           payload: { title: e.target.value },
                        })
                     }
                  />
                  <Input
                     type="text"
                     label={t(address.concat("item sku"))}
                     name="sku"
                     value={state.sku}
                     onChange={e =>
                        dispatch({
                           type: 'SKU',
                           payload: { sku: e.target.value },
                        })
                     }
                  />
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <Highlight>
                  <StyledInputGroup>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat("unit qty").concat(':'))}
                           name="unit_quantity"
                           value={state.unit_quantity.value}
                           onChange={e =>
                              dispatch({
                                 type: 'QUANTITY',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.unit_quantity.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'QUANTITY',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="gram">{t('units.gram')}</option>
                           <option value="loaf">{t('units.loaf')}</option>
                        </StyledSelect>
                     </InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat("unit price")).concat(':')}
                        name="unit_price"
                        value={state.unit_price.unit + state.unit_price.value}
                        onChange={e =>
                           dispatch({
                              type: 'PRICE',
                              payload: {
                                 name: 'value',
                                 value: e.target.value.substring(1),
                              },
                           })
                        }
                     />
                  </StyledInputGroup>
               </Highlight>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat("case qty")).concat(':')}
                           name="case_quantity"
                           value={state.case_quantity.value}
                           onChange={e =>
                              dispatch({
                                 type: 'CASE',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.case_quantity.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'CASE',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="unit">{t(address.concat('unit'))}</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat("minimum order value")).concat(':')}
                           name="minimum_order_value"
                           value={state.min_order_value.value}
                           onChange={e =>
                              dispatch({
                                 type: 'MIN_ORDER',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.min_order_value.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'MIN_ORDER',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="cs">{t('units.cs')}</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat("lead time")).concat(':')}
                           name="lead_time"
                           value={state.lead_time.value}
                           onChange={e =>
                              dispatch({
                                 type: 'LEAD_TIME',
                                 payload: {
                                    name: 'value',
                                    value: e.target.value,
                                 },
                              })
                           }
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={state.lead_time.unit}
                           onChange={e =>
                              dispatch({
                                 type: 'LEAD_TIME',
                                 payload: {
                                    name: e.target.name,
                                    value: e.target.value,
                                 },
                              })
                           }
                        >
                           <option value="days">{t(address.concat('days'))}</option>
                           <option value="weeks">{t(address.concat('weeks'))}</option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledLabel>
                  {t(address.concat('upload cerificates for the item authentication (if any)'))}
               </StyledLabel>
               <Highlight></Highlight>
            </StyledRow>
         </TunnelBody>
      </>
   )
}