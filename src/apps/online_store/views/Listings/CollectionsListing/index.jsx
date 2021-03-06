import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from 'react-tabulator'

// Components
import { IconButton, Loader, TextButton } from '@dailykit/ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { RRule } from 'rrule'
import { randomSuffix } from '../../../../../shared/utils'
// Icons
import { AddIcon, DeleteIcon } from '../../../assets/icons'
// State
import { useTabs } from '../../../context'
import {
   S_COLLECTIONS,
   CREATE_COLLECTION,
   DELETE_COLLECTIONS,
} from '../../../graphql'
// Styled
import { StyledHeader, StyledWrapper, Flexible } from '../styled'
import tableOptions from '../tableOption'

const address = 'apps.online_store.views.listings.collectionslisting.'

const CollectionsListing = () => {
   const { t } = useTranslation()
   const { addTab } = useTabs()

   const tableRef = React.useRef()

   // Queries
   const { data: { menuCollections = [] } = {}, loading } = useSubscription(
      S_COLLECTIONS,
      {
         onError: error => {
            console.log(error)
         },
      }
   )

   // Mutation
   const [createCollection] = useMutation(CREATE_COLLECTION, {
      variables: {
         name: `collection-${randomSuffix()}`,
         availability: {
            rule:
               'RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO;BYDAY=TH,WE,TU,SU,SA,MO,FR',
            time: {
               end: '23:59',
               start: '00:00',
            },
         },
      },
      onCompleted: data => {
         addTab(
            data.createMenuCollection.returning[0].name,
            `/online-store/collections/${data.createMenuCollection.returning[0].id}`
         )
         toast.success('Collection created!')
      },
      onError: error => {
         console.log(error)
         toast.error('Some error occurred!')
      },
   })

   const [deleteCollections] = useMutation(DELETE_COLLECTIONS, {
      onCompleted: () => {
         toast.success('Collection deleted!')
      },
      onError: error => {
         console.log(error)
         toast.error('Could not delete!')
      },
   })

   // Handler
   const deleteHandler = (e, collection) => {
      e.stopPropagation()
      if (
         window.confirm(
            `Are you sure you want to delete collection - ${collection.name}?`
         )
      ) {
         deleteCollections({
            variables: {
               ids: [collection.id],
            },
         })
      }
   }

   const columns = [
      {
         title: t(address.concat('collection name')),
         field: 'name',
         headerFilter: true,
      },
      {
         title: t(address.concat('categories')),
         field: 'categories',
         headerFilter: false,
         formatter: reactFormatter(<CatCount />),
      },
      {
         title: t(address.concat('availability')),
         field: 'availability',
         headerFilter: false,
         formatter: reactFormatter(<ShowAvailability />),
      },
      {
         title: 'Actions',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'center',
         cellClick: (e, cell) => {
            e.stopPropagation()
            deleteHandler(e, cell._cell.row.data)
         },
         formatter: reactFormatter(<DeleteIngredient />),
      },
   ]

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, `/online-store/collections/${id}`)
   }

   if (loading) return <Loader />

   return (
      <StyledWrapper>
         <StyledHeader>
            <h1>{t(address.concat('collections'))}</h1>
            <Flexible style={{ alingItems: 'center' }}>
               <TextButton
                  type="outline"
                  onClick={() => tableRef.current.table.clearHeaderFilter()}
               >
                  Clear Filters
               </TextButton>
               <span style={{ width: '10px' }} />
               <IconButton type="solid" onClick={createCollection}>
                  <AddIcon color="#fff" size={24} />
               </IconButton>
            </Flexible>
         </StyledHeader>
         <div style={{ width: '80%', margin: '0 auto' }}>
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={menuCollections}
               rowClick={rowClick}
               options={tableOptions}
            />
         </div>
      </StyledWrapper>
   )
}

function DeleteIngredient() {
   return <DeleteIcon color="#FF5A52" />
}

function CatCount({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.length) return <>{value.length}</>
   return 0
}

function ShowAvailability({
   cell: {
      _cell: { value },
   },
}) {
   if (value && value.rule) return <>{RRule.fromString(value.rule).toText()}</>
   return null
}

export default CollectionsListing
