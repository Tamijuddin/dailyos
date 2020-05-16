import gql from 'graphql-tag'

export const CREATE_SAFETY_CHECK = gql`
   mutation CreateSafetyCheck {
      insert_safety_safetyCheck(objects: { isVisibleOnStore: true }) {
         returning {
            created_at
            id
         }
      }
   }
`

export const CREATE_CHECKUP = gql`
   mutation CreateCheckup($object: safety_safetyCheckPerUser_insert_input!) {
      insert_safety_safetyCheckPerUser_one(object: $object) {
         id
      }
   }
`
