import gql from 'graphql-tag'

export const CUSTOMERS_COUNT = gql`
   subscription CustomerCount {
      customers_aggregate {
         aggregate {
            count
         }
      }
   }
`
export const TOTAL_REVENUE = gql`
   subscription totalRevenue {
      ordersAggregate {
         aggregate {
            sum {
               amountPaid
            }
         }
      }
   }
`