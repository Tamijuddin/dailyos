import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { useMutation } from '@apollo/react-hooks'
import { TunnelHeader, Loader } from '@dailykit/ui'
import { AssetUploader } from '../../../../../../../shared/components/AssetUploader/index'
import { TunnelContainer } from '../../../../../components'
import { UPDATE_BULK_ITEM } from '../../../../../graphql'
import { ItemContext } from '../../../../../context/item'

export default function PhotoTunnel({ close }) {
   const {
      state: { activeProcessing },
      dispatch,
   } = useContext(ItemContext)

   const [udpateBulkItem, { loading }] = useMutation(UPDATE_BULK_ITEM, {
      onCompleted: () => {
         close(1)
         toast.info('Image Added!')
      },
      onError: error => {
         console.log(error)

         dispatch({
            type: 'SET_ACTIVE_PROCESSING',
            payload: {
               ...activeProcessing,
               image: '',
            },
         })

         toast.error('Error, Please try again')
         close(1)
      },
   })

   const addImage = ({ url }) => {
      dispatch({
         type: 'SET_ACTIVE_PROCESSING',
         payload: {
            ...activeProcessing,
            image: url,
         },
      })

      udpateBulkItem({
         variables: {
            id: activeProcessing.id,
            object: {
               image: url,
            },
         },
      })
   }

   if (loading) return <Loader />

   return (
      <>
         <TunnelHeader title="Select Image" close={() => close(1)} />
         <TunnelContainer>
            <AssetUploader
               onImageSelect={image => addImage(image)}
               onAssetUpload={url => addImage(url)}
            />
         </TunnelContainer>
      </>
   )
}
