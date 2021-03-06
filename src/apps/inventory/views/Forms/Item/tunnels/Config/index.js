import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   ButtonTile,
   IconButton,
   Input,
   Loader,
   Tag,
   TagGroup,
   Text,
   Tunnel,
   Tunnels,
   useTunnel,
   TunnelHeader,
} from '@dailykit/ui'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Nutrition from '../../../../../../../shared/components/Nutrition/index'
import EditIcon from '../../../../../../recipe/assets/icons/Edit'
import { ItemContext } from '../../../../../context/item'
import {
   CREATE_BULK_ITEM,
   UNITS_SUBSCRIPTION,
   UPDATE_BULK_ITEM,
   UPDATE_SUPPLIER_ITEM,
} from '../../../../../graphql'
import { StyledSelect } from '../../../styled'
import handleNumberInputErrors from '../../../utils/handleNumberInputErrors'
import AllergensTunnel from '../Allergens'
import NutritionTunnel from '../NutritionTunnel'
import {
   Highlight,
   InputWrapper,
   StyledInputGroup,
   StyledLabel,
   StyledRow,
   TunnelBody,
   ImageContainer,
} from '../styled'
import PhotoTunnel from './PhotoTunnel'

const address = 'apps.inventory.views.forms.item.tunnels.config.'

export default function ConfigTunnel({ close, formState }) {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(ItemContext)
   const [errors, setErrors] = useState([])
   const [units, setUnits] = useState([])

   const bulkItem = formState.bulkItemAsShipped

   const [parLevel, setParLevel] = useState(bulkItem?.parLevel || '')
   const [maxValue, setMaxValue] = useState(bulkItem?.maxLevel || '')
   const [unit, setUnit] = useState(
      bulkItem?.unit || formState?.unit || units[0]?.name
   )
   const [laborTime, setLaborTime] = useState(bulkItem?.labor?.value || '')
   const [laborUnit, setLaborUnit] = useState(bulkItem?.labor?.unit || 'hours')
   const [yieldPercentage, setYieldPercentage] = useState(
      bulkItem?.yield?.value || ''
   )
   const [shelfLife, setShelfLife] = useState(bulkItem?.shelfLife?.value || '')
   const [shelfLifeUnit, setShelfLifeUnit] = useState(
      bulkItem?.shelfLife?.unit || 'hours'
   )
   const [bulkDensity, setBulkDensity] = useState(bulkItem?.bulkDensity || '')

   const { loading: unitsLoading } = useSubscription(UNITS_SUBSCRIPTION, {
      onSubscriptionData: input => {
         const data = input.subscriptionData.data.units
         setUnits(data)
      },
   })

   const [
      allergensTunnel,
      openAllergensTunnel,
      closeAllergensTunnel,
   ] = useTunnel(1)

   const [
      nutritionTunnel,
      openNutritionTunnel,
      closeNutritionTunnel,
   ] = useTunnel(1)

   const [photoTunnel, openPhotoTunnel, closePhotoTunnel] = useTunnel(1)

   const [updateSupplierItem] = useMutation(UPDATE_SUPPLIER_ITEM, {
      onCompleted: () => {
         close(4)
         toast.success('Bulk Item as Shipped Added!')
      },
      onError: error => {
         console.log(error)
         toast.error('Error adding bulk item as shipped. Please try again')
         close(4)
      },
   })
   const [createBulkItem, { loading: createBulkItemLoading }] = useMutation(
      CREATE_BULK_ITEM,
      {
         onCompleted: data => {
            updateSupplierItem({
               variables: {
                  id: formState.id,
                  object: {
                     bulkItemAsShippedId: data.createBulkItem.returning[0].id,
                  },
               },
            })
         },
         onError: error => {
            console.log(error)
            toast.error('Error creating bulk item. Please try again')
            close(2)
         },
      }
   )

   const [udpateBulkItem, { loading: updateBulkItemLoading }] = useMutation(
      UPDATE_BULK_ITEM,
      {
         onCompleted: () => {
            close(2)
            dispatch({
               type: 'SET_ACTIVE_PROCESSING',
               payload: {
                  ...formState.bulkItemAsShipped,
                  unit, // string
                  yield: { value: yieldPercentage },
                  shelfLife: { unit: shelfLifeUnit, value: shelfLife },
                  parLevel: +parLevel,
                  nutritionInfo: state.processing.nutrients || {},
                  maxLevel: +maxValue,
                  labor: { value: laborTime, unit: laborUnit },
                  bulkDensity: +bulkDensity,
                  allergens: state.processing.allergens,
               },
            })
            toast.success('Bulk Item updated successfully !')
         },
         onError: error => {
            console.log(error)
            toast.error('Error updating bulk item as shipped. Please try again')
            close(2)
         },
      }
   )

   const handleSave = () => {
      if (!parLevel || !maxValue)
         return toast.error('Please fill the form properly')

      if (errors.length) {
         errors.forEach(err => toast.error(err.message))
         toast.error(`Cannot update item information !`)
      } else if (formState.bulkItemAsShippedId) {
         udpateBulkItem({
            variables: {
               id: formState.bulkItemAsShippedId,
               object: {
                  unit, // string
                  yield: { value: yieldPercentage },
                  shelfLife: { unit: shelfLifeUnit, value: shelfLife },
                  parLevel: +parLevel,
                  nutritionInfo: state.processing.nutrients || {},
                  maxLevel: +maxValue,
                  labor: { value: laborTime, unit: laborUnit },
                  bulkDensity: +bulkDensity,
                  allergens: state.processing.allergens,
               },
            },
         })
      } else {
         createBulkItem({
            variables: {
               processingName: state.processing.title,
               itemId: formState.id,
               unit, // string
               yield: { value: yieldPercentage },
               shelfLife: { unit: shelfLifeUnit, value: shelfLife },
               parLevel: +parLevel,
               nutritionInfo: state.processing.nutrients || {},
               maxLevel: +maxValue,
               labor: { value: laborTime, unit: laborUnit },
               bulkDensity: +bulkDensity,
               allergens: state.processing.allergens,
            },
         })
      }
   }

   if (createBulkItemLoading || updateBulkItemLoading || unitsLoading)
      return <Loader />

   return (
      <>
         <Tunnels tunnels={allergensTunnel}>
            <Tunnel layer={1} style={{ overflowY: 'auto' }}>
               <AllergensTunnel close={() => closeAllergensTunnel(1)} />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={nutritionTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <NutritionTunnel close={closeNutritionTunnel} />
            </Tunnel>
         </Tunnels>

         <Tunnels tunnels={photoTunnel}>
            <Tunnel style={{ overflowY: 'auto' }} layer={1}>
               <PhotoTunnel close={closePhotoTunnel} bulkItem={bulkItem} />
            </Tunnel>
         </Tunnels>

         <TunnelHeader
            title={t(address.concat('configure processing'))}
            close={() => close(2)}
            right={{ title: t(address.concat('save')), action: handleSave }}
         />

         <TunnelBody>
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('set par level'))}
                        name="par level"
                        value={parLevel}
                        onChange={e => setParLevel(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('max inventory level'))}
                        name="max inventory level"
                        value={maxValue}
                        onChange={e => setMaxValue(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </InputWrapper>
               </StyledInputGroup>
            </StyledRow>

            <StyledRow>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text as="title">Select Unit:</Text>
                  <span style={{ width: '10px' }} />
                  <StyledSelect
                     name="unit"
                     value={unit}
                     onChange={e => setUnit(e.target.value)}
                  >
                     {units.map(unit => (
                        <option key={unit.id} value={unit.name}>
                           {unit.name}
                        </option>
                     ))}
                  </StyledSelect>
               </div>
            </StyledRow>

            <StyledRow>
               <StyledLabel>
                  {t(address.concat('processing information'))}
               </StyledLabel>
            </StyledRow>
            {bulkItem?.id && (
               <StyledRow>
                  {bulkItem?.image ? (
                     <ImageContainer>
                        <div>
                           <span
                              role="button"
                              tabIndex="0"
                              onClick={() => openPhotoTunnel(1)}
                              onKeyDown={e =>
                                 e.charCode === 13 && openPhotoTunnel(1)
                              }
                           >
                              <EditIcon />
                           </span>
                        </div>
                        <img src={bulkItem.image} alt="processing" />
                     </ImageContainer>
                  ) : (
                     <ButtonTile
                        type="primary"
                        size="sm"
                        text={t(address.concat('add photo to your processing'))}
                        helper={t(
                           address.concat(
                              'upto 1MB - only JPG, PNG, PDF allowed'
                           )
                        )}
                        onClick={() => openPhotoTunnel(1)}
                     />
                  )}
               </StyledRow>
            )}
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('labour time per 100gm'))}
                        name="labor time"
                        value={laborTime}
                        onChange={e => setLaborTime(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={laborUnit}
                        onChange={e => setLaborUnit(e.target.value)}
                     >
                        <option value="hours">{t('units.hours')}</option>
                        <option value="minutes">{t('units.minutes')}</option>
                     </StyledSelect>
                  </InputWrapper>

                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('percentage of yield'))}
                        name="yield"
                        value={yieldPercentage}
                        onChange={e => setYieldPercentage(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                     <span>%</span>
                  </InputWrapper>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledInputGroup>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('shelf life'))}
                        name="shelf life"
                        value={shelfLife}
                        onChange={e => setShelfLife(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                     <StyledSelect
                        name="unit"
                        defaultValue={shelfLifeUnit}
                        onChange={e => setShelfLifeUnit(e.target.value)}
                     >
                        <option value="hours">{t('units.hours')}</option>
                        <option value="minutes">{t('units.minutes')}</option>
                     </StyledSelect>
                  </InputWrapper>
                  <InputWrapper>
                     <Input
                        type="number"
                        label={t(address.concat('bulk dnesity'))}
                        name="bulk density"
                        value={bulkDensity}
                        onChange={e => setBulkDensity(e.target.value)}
                        onBlur={e =>
                           handleNumberInputErrors(e, errors, setErrors)
                        }
                     />
                  </InputWrapper>
               </StyledInputGroup>
            </StyledRow>
            <StyledRow>
               <StyledLabel
                  style={{
                     width: '100%',
                     display: 'flex',
                     justifyContent: 'space-between',
                  }}
               >
                  <div>{t(address.concat('nutritions per 100gm'))}</div>
                  <IconButton
                     onClick={() => {
                        dispatch({
                           type: 'SET_NUTRI_TARGET',
                           payload: 'processing',
                        })
                        openNutritionTunnel(1)
                     }}
                     type="ghost"
                  >
                     <EditIcon color="#555b6e" />
                  </IconButton>
               </StyledLabel>
               {state.processing.nutrients?.totalFat ||
               state.processing.nutrients?.calories ? (
                  <Nutrition
                     data={{
                        calories: state.processing.nutrients.calories,
                        totalFat: state.processing.nutrients.totalFat,
                        transFat: state.processing.nutrients.transFat,
                        saturatedFat: state.processing.nutrients.saturatedFat,
                        cholesterol: state.processing.nutrients.cholesterol,
                        sodium: state.processing.nutrients.sodium,
                        totalCarbohydrates:
                           state.processing.nutrients.totalCarbohydrates,
                        dietaryFibre: state.processing.nutrients.dietaryFibre,
                        sugars: state.processing.nutrients.sugars,
                        protein: state.processing.nutrients.protein,
                        vitaminA: state.processing.nutrients.vitaminA,
                        vitaminC: state.processing.nutrients.vitaminC,
                        iron: state.processing.nutrients.iron,
                        calcium: state.processing.nutrients.calcium,
                     }}
                  />
               ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add nutritions'))}
                     onClick={e => {
                        dispatch({
                           type: 'SET_NUTRI_TARGET',
                           payload: 'processing',
                        })
                        openNutritionTunnel(1)
                     }}
                  />
               )}
            </StyledRow>
            <StyledRow>
               <StyledLabel>{t(address.concat('allergens'))}</StyledLabel>
               {state.processing.allergens.length ? (
                  <Highlight pointer onClick={() => openAllergensTunnel(1)}>
                     <TagGroup>
                        {state.processing.allergens.map(el => (
                           <Tag key={el.id}> {el.title} </Tag>
                        ))}
                     </TagGroup>
                  </Highlight>
               ) : (
                  <ButtonTile
                     type="secondary"
                     text={t(address.concat('add allergens'))}
                     onClick={() => openAllergensTunnel(1)}
                  />
               )}
            </StyledRow>
         </TunnelBody>
      </>
   )
}
