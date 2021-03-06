import React from 'react'
import { Text, Avatar, IconButton, PlusIcon } from '@dailykit/ui'
import { CustomerCard, CustomerInfo, CustomerWallet } from './styled'

const customerCard = ({ customer, walletAmount }) => (
   <CustomerCard>
      <CustomerInfo>
         <Avatar url="https://randomuser.me/api/portraits/men/61.jpg" />
         <Text as="title">{`${
            customer?.platform_customer?.firstName || 'N/A'
         } ${customer?.platform_customer?.lastName || 'N/A'}`}</Text>
         <Text as="subtitle">{customer?.source}</Text>
      </CustomerInfo>
      <CustomerWallet>
         <span>
            <Text as="subtitle">Wallet amount</Text>
            <Text as="title">{walletAmount}</Text>
         </span>
         <IconButton type="solid">
            <PlusIcon />
         </IconButton>
      </CustomerWallet>
   </CustomerCard>
)
export default customerCard
