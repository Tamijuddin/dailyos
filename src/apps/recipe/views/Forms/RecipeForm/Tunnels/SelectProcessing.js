import React, { useState, useContext } from 'react'

import {
   List,
   ListSearch,
   ListOptions,
   ListItem,
   useSingleList,
} from '@dailykit/ui'

import { Context as RecipeContext } from '../../../../context/recipe/index'

import { TunnelContainer } from '../styled'

import { TunnelHeader, Spacer } from '../../../../components/index'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.forms.recipeform.tunnels.'

export default function SelectProcessing({ next, procs }) {
   const { t } = useTranslation()
   const { recipeState, recipeDispatch } = useContext(RecipeContext)
   const [search, setSearch] = useState('')
   const [list, current, selectOption] = useSingleList(procs)

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("add ingredients"))}
            close={() => next(4)}
            next={() => {
               recipeDispatch({
                  type: 'ADD_PROCESSING',
                  payload: {
                     processing: current,
                     ingredient: recipeState.view,
                  },
               })

               // recipeDispatch({
               //    type: 'ADD_PROCESSING_FOR_PUSHABLE',
               //    payload: current,
               // })

               next(4)
            }}
         />
         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem type="SSL1" title={current.title} />
            ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(address.concat("type what you’re looking for"))}
                  />
               )}
            <ListOptions>
               {list
                  .filter(option => option.title.toLowerCase().includes(search))
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
      </TunnelContainer>
   )
}