import styled from 'styled-components'

export const ContactCard = styled.div`
   background: #ffffff;
   border: 1px solid #ececec;
   box-sizing: border-box;
   display: flex;
   flex-direction: column;
   margin: 0 32px 16px 0;
`
export const StyledHeading = styled.div`
   padding: 8px 16px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`
export const ContactInfo = styled.div`
   padding: 16px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`
export const CustomerAddress = styled.div`
   padding: 16px;
   border-top: 1px solid #ececec;
`

export const SmallText = styled.small`
   color: #00a7e1;
   font-size: 12px;
   cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
`
