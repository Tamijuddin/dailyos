import React from 'react'

const Context = React.createContext()

const initialState = {
   current_view: 'SUMMARY',
   mealkit: {
      name: null,
      sachet_id: null,
   },
   inventory: {
      id: null,
   },
   readytoeat: {
      id: null,
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      // Add Tab
      case 'SELECT_MEALKIT':
         return {
            ...state,
            current_view: 'MEALKIT',
            mealkit: {
               name: payload.name,
               sachet_id: payload.id,
            },
         }
      case 'SELECT_INVENTORY':
         return {
            ...state,
            current_view: 'INVENTORY',
            inventory: {
               id: payload,
            },
         }
      case 'SELECT_READYTOEAT':
         return {
            ...state,
            current_view: 'READYTOEAT',
            readytoeat: {
               id: payload,
            },
         }
      case 'SWITCH_VIEW': {
         return {
            ...state,
            inventory: {
               id: null,
            },
            readytoeat: {
               id: null,
            },
            mealkit: {
               name: null,
               sachet_id: null,
            },
            current_view: payload.view,
         }
      }
      default:
         return state
   }
}

export const OrderProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)

   return (
      <Context.Provider value={{ state, dispatch }}>
         {children}
      </Context.Provider>
   )
}

export const useOrder = () => {
   const { state, dispatch } = React.useContext(Context)

   const selectMealKit = (id, name) => {
      dispatch({
         type: 'SELECT_MEALKIT',
         payload: { id, name },
      })
   }

   const selectInventory = id => {
      dispatch({
         type: 'SELECT_INVENTORY',
         payload: id,
      })
   }

   const selectReadyToEat = id => {
      dispatch({
         type: 'SELECT_READYTOEAT',
         payload: id,
      })
   }

   const switchView = view => {
      dispatch({
         type: 'SWITCH_VIEW',
         payload: {
            view,
         },
      })
   }

   return {
      state,
      dispatch,
      switchView,
      selectMealKit,
      selectInventory,
      selectReadyToEat,
   }
}
