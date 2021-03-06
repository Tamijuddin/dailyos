import React from 'react'
import { Text, TunnelHeader } from '@dailykit/ui'
import { Trans, useTranslation } from 'react-i18next'
import { CollectionContext } from '../../../../../context/collection'
import { SolidTile, TunnelBody } from '../styled'

const address =
   'apps.online_store.views.forms.collection.tunnels.producttypetunnel.'

const ProductTypeTunnel = ({ close, open }) => {
   const { t } = useTranslation()
   const { collectionDispatch } = React.useContext(CollectionContext)

   const select = type => {
      collectionDispatch({
         type: 'META',
         payload: {
            name: 'productType',
            value: type,
         },
      })
      open(2)
   }

   return (
      <>
         <TunnelHeader
            title={t(address.concat('select product type'))}
            close={() => close(1)}
         />
         <TunnelBody>
            <SolidTile onClick={() => select('inventory')}>
               <Text as="h1">{t(address.concat('inventory product'))}</Text>
               <Text as="subtitle 1">
                  <Trans i18nKey={address.concat('subtitle 1')}>
                     Inventory product is just an item, supplied or bought
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('simple')}>
               <Text as="h1">{t(address.concat('simple recipe product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 2')}>
                     Simple Recipe Product is only one recipe, sold as Meal Kits
                     as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('customizable')}>
               <Text as="h1">{t(address.concat('customizable product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 3')}>
                     Simple Recipe Product is only one recipe, sold as Meal Kits
                     as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('combo')}>
               <Text as="h1">{t(address.concat('combo product'))}</Text>
               <Text as="subtitle">
                  <Trans i18nKey={address.concat('subtitle 4')}>
                     Simple Recipe Product is only one recipe, sold as Meal Kits
                     as well as Ready to Eat
                  </Trans>
               </Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ProductTypeTunnel
