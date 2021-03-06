import styled from 'styled-components'

export const StyledCard = styled.div`
   background: ${props =>
      props.active ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'};
   border: 1px dashed #f3f3f3;
   box-shadow: 3px 3px 16px rgba(0, 0, 0, 0.06);
   margin: 0 32px 32px 0;
   width: 100%;
   &:hover {
      background: ${props => !props.active && 'rgba(255, 255, 255, 0.4)'};
   }
`
export const CardHeading = styled.div`
   padding: 16px;
   display: flex;
   flex-direction: row;
   justify-content: space-between;
`
export const CardContent = styled(CardHeading)`
   border-top: 1px solid #ececec;
`
export const ViewTab = styled.span`
   color: #00a7e1;
   font-size: 18px;
   font-weight: normal;
   font-style: normal;
   font-family: Roboto;
   line-height: 14px;
   cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
`
