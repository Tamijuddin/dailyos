import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@apollo/react-hooks'
import { TextButton, Input, Loader } from '@dailykit/ui'

// Mutations
import { UPDATE_SUPPLIER_ITEM } from '../../../../../graphql'

import { CloseIcon } from '../../../../../assets/icons'

import {
   TunnelHeader,
   TunnelBody,
   StyledRow,
   StyledInputGroup,
   Highlight,
   InputWrapper,
} from '../styled'
import { StyledSelect } from '../../../styled'

const address = 'apps.inventory.views.forms.item.tunnels.info.'

export default function InfoTunnel({ close, units, formState }) {
   const { t } = useTranslation()

   const [itemName, setItemName] = useState(formState.name || '')
   const [sku, setSku] = useState(formState.sku || '')
   const [unitSize, setUnitSize] = useState(formState.unitSize || '')
   const [unit, setUnit] = useState(formState.unit || units[0].name)
   const [unitPrice, setUnitPrice] = useState(
      formState.prices[0].unitPrice.value || ''
   )
   const [leadTime, setLeadTime] = useState(formState.leadTime.value || '')
   const [leadTimeUnit, setLeadTimeUnit] = useState(
      formState.leadTime.unit || 'days'
   )

   const [errors, setErrors] = useState([])

   const [updateSupplierItem, { loading }] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: () => {
         close(2)
         toast.info('Item information updated')
      },
      onError: error => {
         console.log(error)
         toast.error('Error adding item information. Please try again')
      },
   })

   const handleNext = () => {
      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot update item information !`)
      } else {
         updateSupplierItem({
            variables: {
               id: formState.id,
               object: {
                  name: itemName,
                  sku,
                  unitSize,
                  unit,
                  prices: [{ unitPrice: { unit: '$', value: unitPrice } }],
                  leadTime: { unit: leadTimeUnit, value: leadTime },
               },
            },
         })
      }
   }

   const handleErrors = e => {
      if (!e.target.value.length) return

      const reg = new RegExp('[0-9]+$')
      const { value } = e.target

      const match = reg.test(value)

      if (match) {
         const cleanedErrors = [...errors]
         const index = cleanedErrors.findIndex(
            err => err.path === e.target.name
         )

         if (index >= 0) {
            cleanedErrors.splice(index, 1)
         }
         setErrors(cleanedErrors)
      }

      if (!match) {
         toast.error(`Invalid value for field: ${e.target.name}`)
         setErrors([
            ...errors,
            {
               path: e.target.name,
               message: `Invalid value for field: ${e.target.name}`,
            },
         ])
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
                     label={t(address.concat('item name'))}
                     name="title"
                     value={itemName}
                     onChange={e => setItemName(e.target.value)}
                  />
                  <Input
                     type="text"
                     label={t(address.concat('item sku'))}
                     name="sku"
                     value={sku}
                     onChange={e => setSku(e.target.value)}
                  />
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <Highlight>
                  <StyledInputGroup>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat('unit qty'))}
                           name="unit quantity"
                           value={unitSize}
                           onChange={e => setUnitSize(e.target.value)}
                           onBlur={e => handleErrors(e)}
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={unit}
                           onChange={e => setUnit(e.target.value)}
                        >
                           {units.map(unit => (
                              <option key={unit.id} value={unit.name}>
                                 {unit.name}
                              </option>
                           ))}
                        </StyledSelect>
                     </InputWrapper>
                     <Input
                        type="text"
                        label={t(address.concat('unit price')).concat(':')}
                        name="Unit Price"
                        value={unitPrice}
                        onChange={e => setUnitPrice(e.target.value)}
                        onBlur={e => handleErrors(e)}
                     />
                  </StyledInputGroup>
               </Highlight>
            </StyledRow>
            {/* <StyledRow>
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
            </StyledRow> */}
            <StyledRow>
               <StyledInputGroup>
                  <Highlight>
                     <InputWrapper>
                        <Input
                           type="text"
                           label={t(address.concat('lead time')).concat(':')}
                           name="Lead Time"
                           value={leadTime}
                           onChange={e => setLeadTime(e.target.value)}
                           onBlur={e => handleErrors(e)}
                        />
                        <StyledSelect
                           name="unit"
                           defaultValue={leadTimeUnit}
                           onChange={e => setLeadTimeUnit(e.target.value)}
                        >
                           <option value="days">
                              {t(address.concat('days'))}
                           </option>
                           <option value="weeks">
                              {t(address.concat('weeks'))}
                           </option>
                        </StyledSelect>
                     </InputWrapper>
                  </Highlight>
               </StyledInputGroup>
            </StyledRow>
            {/* <StyledRow>
               <StyledLabel>
                  {t(
                     address.concat(
                        'upload cerificates for the item authentication (if any)'
                     )
                  )}
               </StyledLabel>
               <Highlight></Highlight>
            </StyledRow> */}
         </TunnelBody>
      </>
   )
}
