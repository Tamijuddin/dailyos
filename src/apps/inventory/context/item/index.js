import React from 'react'

export const ItemContext = React.createContext()

export const state = {
   id: null,
   form_meta: {
      shipped: false,
   },
   supplier: '',
   title: '',
   sku: '',
   unit_quantity: {
      value: '',
      unit: 'gram',
   },
   unit_price: {
      unit: '$',
      value: '',
   },
   case_quantity: {
      unit: '',
      value: '',
   },
   min_order_value: {
      unit: '',
      value: '',
   },
   lead_time: {
      unit: 'hours',
      value: '',
   },
   processing: {
      id: null,
      name: '',
      unit: 'gram',
      par_level: {
         value: '',
         unit: '',
      },
      max_inventory_level: {
         value: '',
         unit: '',
      },
      labor_time: {
         value: '',
         unit: 'hours',
      },
      yield: '',
      shelf_life: {
         value: '',
         unit: 'hours',
      },
      bulk_density: '',
      allergens: [],
   },
   activeProcessing: {},
   derivedProcessings: [],
   configurable: {},
   activeSachet: {},
   nutriTarget: '',
   derAction: '',
}

export const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'ADD_ITEM_ID':
         return { ...state, id: payload }
      case 'META': {
         return {
            ...state,
            form_meta: {
               ...state.form_meta,
               [payload.name]: payload.value,
            },
            processing: { ...state.processing, shipped: true },
         }
      }
      case 'SUPPLIER': {
         return {
            ...state,
            supplier: payload,
         }
      }
      case 'TITLE': {
         return {
            ...state,
            title: payload.title,
         }
      }
      case 'SKU': {
         return {
            ...state,
            sku: payload.sku,
         }
      }
      case 'QUANTITY': {
         return {
            ...state,
            unit_quantity: {
               ...state.unit_quantity,
               [payload.name]: payload.value,
            },
         }
      }
      case 'PRICE': {
         return {
            ...state,
            unit_price: {
               ...state.unit_price,
               [payload.name]: payload.value,
            },
         }
      }
      case 'CASE': {
         return {
            ...state,
            case_quantity: {
               ...state.case_quantity,
               [payload.name]: payload.value,
            },
         }
      }
      case 'MIN_ORDER': {
         return {
            ...state,
            min_order_value: {
               ...state.min_order_value,
               [payload.name]: payload.value,
            },
         }
      }
      case 'LEAD_TIME': {
         return {
            ...state,
            lead_time: {
               ...state.lead_time,
               [payload.name]: payload.value,
            },
         }
      }
      case 'PROCESSING': {
         return {
            ...state,
            processing: {
               ...state.processing,
               ...payload,
               sachets: [],
               shipped: true,
            },
         }
      }
      case 'PAR_LEVEL': {
         return {
            ...state,
            processing: {
               ...state.processing,
               par_level: {
                  ...state.processing.par_level,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'MAX_INVENTORY_LEVEL': {
         return {
            ...state,
            processing: {
               ...state.processing,
               max_inventory_level: {
                  ...state.processing.max_inventory_level,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'LABOR_TIME': {
         return {
            ...state,
            processing: {
               ...state.processing,
               labor_time: {
                  ...state.processing.labor_time,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'YIELD': {
         return {
            ...state,
            processing: {
               ...state.processing,
               yield: payload.value,
            },
         }
      }
      case 'SHELF_LIFE': {
         return {
            ...state,
            processing: {
               ...state.processing,
               shelf_life: {
                  ...state.processing.shelf_life,
                  [payload.name]: payload.value,
               },
            },
         }
      }
      case 'BULK_DENSITY': {
         return {
            ...state,
            processing: {
               ...state.processing,
               bulk_density: payload.value,
            },
         }
      }
      case 'ALLERGENS': {
         return {
            ...state,
            processing: {
               ...state.processing,
               allergens: payload.value,
            },
         }
      }

      case 'SET_ACTIVE_PROCESSING':
         return { ...state, activeProcessing: payload }

      case 'ADD_DERIVED_PROCESSING':
         const newDerivedProcessings = [...state.derivedProcessings]
         const index = newDerivedProcessings.findIndex(
            proc => proc.id === payload.id
         )

         if (index >= 0) {
            newDerivedProcessings.splice(index, 1, {
               ...payload,
               title: payload.name,
            })
         } else {
            newDerivedProcessings.push({ ...payload, title: payload.name })
         }

         return { ...state, derivedProcessings: newDerivedProcessings }

      case 'ADD_CONFIGURABLE_PROCESSING':
         return { ...state, configurable: payload }

      case 'CONFIGURE_DERIVED_PROCESSING':
         const {
            id,
            par,
            unit,
            maxInventoryLevel,

            laborTime,
            laborUnit,
            yieldPercentage,
            shelfLife,
            shelfLifeUnit,
            bulkDensity,
         } = payload
         const configuredDerivedProcessings = [...state.derivedProcessings]
         const activeConfigurable = configuredDerivedProcessings.findIndex(
            config => config.id === state.configurable.id
         )
         configuredDerivedProcessings.splice(activeConfigurable, 1, {
            ...state.configurable,
            id,
            unit,
            par_level: { value: par },
            max_inventory_level: {
               value: maxInventoryLevel,
            },
            labor_time: { unit: laborUnit, value: laborTime },
            yield: yieldPercentage,
            shelf_life: { unit: shelfLifeUnit, value: shelfLife },
            bulk_density: bulkDensity,
            sachets: [],
         })
         return { ...state, derivedProcessings: configuredDerivedProcessings }

      case 'ADD_ALLERGENS_FOR_DERIVED_PROCESSING':
         return {
            ...state,
            configurable: { ...state.configurable, allergens: payload },
         }

      // case 'CONFIGURE_NEW_SACHET':
      //    if (state.activeProcessing.shipped) {
      //       const sachets = [...state.processing.sachets]
      //       const index = sachets.findIndex(
      //          sachet => sachet.quantity === payload.quantity
      //       )
      //       if (index >= 0) {
      //          sachets.splice(index, 1, {
      //             id: payload.id,
      //             quantity: payload.quantity,
      //             parLevel: payload.par,
      //             maxInventoryLevel: payload.maxInventoryLevel,
      //          })
      //       } else {
      //          sachets.push({
      //             id: payload.id,
      //             quantity: payload.quantity,
      //             parLevel: payload.par,
      //             maxInventoryLevel: payload.maxInventoryLevel,
      //          })
      //       }
      //       return {
      //          ...state,
      //          processing: { ...state.processing, sachets },
      //          activeProcessing: { ...state.processing, sachets },
      //       }
      //    }
      //    const derivedProcessings = [...state.derivedProcessings]
      //    const indexOfActiveProcessing = derivedProcessings.findIndex(
      //       proc => proc.id === state.activeProcessing.id
      //    )

      //    const newSachetsList = [
      //       ...derivedProcessings[indexOfActiveProcessing]?.sachets,
      //    ]

      //    const sachetIndex = newSachetsList.findIndex(
      //       sachet => sachet.quantity === payload.quantity
      //    )
      //    if (sachetIndex >= 0) {
      //       newSachetsList.splice(sachetIndex, 1, {
      //          id: payload.id,
      //          quantity: payload.quantity,
      //          parLevel: payload.par,
      //          maxInventoryLevel: payload.maxInventoryLevel,
      //       })
      //    } else {
      //       newSachetsList.push({
      //          id: payload.id,
      //          quantity: payload.quantity,
      //          parLevel: payload.par,
      //          maxInventoryLevel: payload.maxInventoryLevel,
      //       })
      //    }

      //    derivedProcessings[indexOfActiveProcessing].sachets = newSachetsList

      //    return {
      //       ...state,
      //       derivedProcessings,
      //       activeProcessing: derivedProcessings[indexOfActiveProcessing],
      //    }

      case 'SET_ACTIVE_SACHET':
         return { ...state, activeSachet: payload }

      case 'ADD_PROCESSING_NUTRIENT':
         const nutrientKeys = Object.keys(payload).filter(key => {
            if (payload[key] === 0) return false
            return true
         })

         const nutrientsForProcessing = {}

         nutrientKeys.forEach(key => {
            nutrientsForProcessing[key] = payload[key]
         })
         return {
            ...state,
            processing: {
               ...state.processing,
               nutrients: nutrientsForProcessing,
            },
         }

      case 'SET_NUTRI_TARGET':
         return { ...state, nutriTarget: payload }

      case 'ADD_DERIVED_PROCESSING_NUTRIENT':
         const keys = Object.keys(payload).filter(key => {
            if (payload[key] === 0) return false
            return true
         })

         const nutrients = {}

         keys.forEach(key => {
            nutrients[key] = payload[key]
         })

         return {
            ...state,
            configurable: { ...state.configurable, nutrients },
         }

      case 'ADD_PROCESSING':
         return { ...state, processing: { ...state.processing, id: payload } }

      case 'SET_UNIT':
         return {
            ...state,
            processing: { ...state.processing, unit: payload.value },
         }
      case 'SET_UNIT_QUANTITY':
         return { ...state, unit_quantity: payload }

      case 'SET_SUB_DATA':
         return {
            ...state,
            title: payload.title,
            sku: payload.sku,
            unit_quantity: {
               unit: payload.unit,
               value: payload.unitSize,
            },
            unit_price: payload.unit_price,
            lead_time: payload.leadTime,
         }
      case 'SET_DER_ACTION':
         return { ...state, derAction: payload }

      case 'CLEAR_STATE':
         return { ...state, activeProcessing: {}, derAction: '' }
      default:
         return state
   }
}
