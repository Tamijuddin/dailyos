import React from 'react'
import { Text, TextButton, Input } from '@dailykit/ui'
import { RRule } from 'rrule'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, StyledRow } from '../styled'
import { Container, Flex } from '../../../styled'
import { useMutation } from '@apollo/react-hooks'
import { toast } from 'react-toastify'
import { CREATE_TIME_SLOTS } from '../../../../../../graphql'
import { RecurrenceContext } from '../../../../../../context/recurrence'
import { Context } from '../../../../../../context'

const TimeSlotTunnel = ({ closeTunnel }) => {
   const { recurrenceState } = React.useContext(RecurrenceContext)
   const {
      state: { current },
   } = React.useContext(Context)
   const [busy, setBusy] = React.useState(false)
   const [from, setFrom] = React.useState('')
   const [to, setTo] = React.useState('')
   const [advance, setAdvance] = React.useState('')

   // Mutation
   const [createTimeSlots] = useMutation(CREATE_TIME_SLOTS, {
      onCompleted: () => {
         toast.success('Time slot added!')
         closeTunnel(2)
      },
      onError: error => {
         setBusy(false)
         toast.error('Error')
         console.log(error)
      },
   })

   // Handlers
   const save = () => {
      setBusy(true)
      if (isNaN(advance) && current.fulfillment.includes('PICKUP')) {
         setBusy(false)
         return toast.error('Invalid time!')
      }
      createTimeSlots({
         variables: {
            objects: [
               {
                  recurrenceId: recurrenceState.recurrenceId,
                  from,
                  to,
                  pickUpLeadTime: current.fulfillment.includes('PREORDER')
                     ? advance
                     : null,
                  pickUpPrepTime: current.fulfillment.includes('ONDEMAND')
                     ? advance
                     : null,
               },
            ],
         },
      })
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => closeTunnel(2)}>
                  <CloseIcon color="#888D9D" size="20" />
               </span>
               <Text as="title">Add Time Slot</Text>
            </div>
            <div>
               <TextButton type="solid" onClick={save}>
                  {busy ? 'Saving...' : 'Save'}
               </TextButton>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <StyledRow>
               <Text as="p">Enter time slot:</Text>
            </StyledRow>
            <StyledRow>
               <Flex direction="row" justify="flex-start">
                  <label style={{ marginRight: '16px' }}>
                     From
                     <input
                        style={{ marginLeft: '8px' }}
                        type="time"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                     />
                  </label>
                  <span style={{ marginRight: '16px' }}>-</span>
                  <label>
                     To
                     <input
                        style={{ marginLeft: '8px' }}
                        type="time"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                     />
                  </label>
               </Flex>
               {current.fulfillment.includes('PICKUP') && (
                  <Container top="32">
                     <Input
                        type="number"
                        label={`${
                           current.fulfillment.includes('ONDEMAND')
                              ? 'Prep'
                              : 'Lead'
                        } Time(minutes)`}
                        value={advance}
                        onChange={e => setAdvance(e.target.value)}
                     />
                  </Container>
               )}
            </StyledRow>
         </TunnelBody>
      </React.Fragment>
   )
}

export default TimeSlotTunnel
