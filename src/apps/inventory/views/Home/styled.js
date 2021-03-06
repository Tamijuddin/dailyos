import styled from 'styled-components'

export const StyledHome = styled.div`
   width: 1180px;
   margin: 0 auto;
   padding-bottom: 20px;
   h1 {
      color: #555b6e;
      margin: 60px 0;
      font-size: 32px;
      font-weight: 500;
      line-height: 37px;
   }
   @media (max-width: 1180px) {
      width: calc(100vw - 40px);
   }
`

export const StyledTileContainer = styled.div`
   width: 70%;
   margin: 0 auto;
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-gap: 24px;
   align-content: center;
   justify-items: center;
`
