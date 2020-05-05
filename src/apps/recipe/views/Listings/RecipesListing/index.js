import React from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks'
import {
   IconButton,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
   Loader,
   SearchBox,
} from '@dailykit/ui'

import { generateRandomString } from '../../../utils'

// Icons
import { AddIcon, DeleteIcon } from '../../../assets/icons'

// State
import { Context } from '../../../context/tabs'

// Styled
import {
   StyledWrapper,
   StyledTableHeader,
   StyledTableActions,
   StyledHeader,
   StyledContent,
} from '../styled'

import { RECIPES, CREATE_RECIPE, S_RECIPES } from '../../../graphql'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.recipe.views.listings.recipeslisting.'

const RecipesListing = () => {
   const { t } = useTranslation()
   const { state, dispatch } = React.useContext(Context)
   const [recipes, setRecipes] = React.useState([])
   const [search, setSearch] = React.useState('')

   // Queries and Mutations
   const { loading, error, data } = useSubscription(S_RECIPES, {
      onSubscriptionData: data => {
         setRecipes(data.subscriptionData.data.simpleRecipes)
      },
   })
   // const [createRecipe] = useMutation(CREATE_RECIPE, {
   //    onCompleted: data => {
   //       if (data.createRecipe.success) {
   //          addTab(
   //             data.createRecipe.recipe.name,
   //             'recipe',
   //             data.createRecipe.recipe.id
   //          )
   //       } else {
   //          // Fire toast
   //          console.log(data)
   //       }
   //    },
   // })

   // const createRecipeHandler = () => {
   //    let name = 'recipe-' + generateRandomString()
   //    createRecipe({ variables: { name } })
   // }

   // Effects
   React.useEffect(() => {
      if (data)
         setRecipes(
            data.simpleRecipes.filter(rec =>
               rec.name.toLowerCase().includes(search.toLowerCase())
            )
         )
   }, [search])

   // Handlers
   const addTab = (title, view) => {
      dispatch({
         type: 'ADD_TAB',
         payload: { type: 'forms', title, view },
      })
   }

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('recipes'))}</h1>
            <p>
               {t(address.concat('total'))}: {recipes.length}
            </p>
         </StyledHeader>
         <StyledTableHeader>
            <p></p>
            <StyledTableActions>
               <SearchBox
                  placeholder={t(address.concat('search'))}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
               />
               <IconButton
                  type="solid"
                  onClick={() => addTab('Unititled Recipe', 'recipe')}
               >
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </StyledTableActions>
         </StyledTableHeader>
         <StyledContent>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('name'))}</TableCell>
                     <TableCell>{t(address.concat('author'))}</TableCell>
                     <TableCell>{t(address.concat('# of servings'))}</TableCell>
                     <TableCell>{t(address.concat('cooking time'))}</TableCell>
                     <TableCell></TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {recipes.map(recipe => (
                     <TableRow key={recipe.id}>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.author}</TableCell>
                        <TableCell>
                           {recipe.simpleRecipeYields.length}
                        </TableCell>
                        <TableCell>
                           {recipe.cookingTime} {t('units.mins')}.
                        </TableCell>
                        <TableCell>
                           <IconButton>
                              <DeleteIcon color="#FF5A52" />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </StyledContent>
      </StyledWrapper>
   )
}

export default RecipesListing
