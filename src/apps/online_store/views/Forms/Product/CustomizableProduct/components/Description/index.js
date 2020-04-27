import React from 'react'
import { CustomizableProductContext } from '../../../../../../context/product/customizableProduct'
import { TagGroup, ButtonTile, Tag, IconButton } from '@dailykit/ui'

import { StyledRow, StyledContainer, StyledAction } from './styled'
import { EditIcon } from '../../../../../../assets/icons'

const Description = ({ openTunnel }) => {
   const { state } = React.useContext(CustomizableProductContext)

   console.log(state)

   return (
      <React.Fragment>
         {state.description || state.tags.length ? (
            <StyledContainer>
               <StyledAction>
                  <IconButton type="outline" onClick={() => openTunnel(1)}>
                     <EditIcon />
                  </IconButton>
               </StyledAction>
               <StyledRow>
                  <TagGroup>
                     {state.tags.map(tag => (
                        <Tag>{tag}</Tag>
                     ))}
                  </TagGroup>
               </StyledRow>
               <StyledRow>
                  <p>{state.description}</p>
               </StyledRow>
            </StyledContainer>
         ) : (
            <ButtonTile
               type="primary"
               size="sm"
               text="Add Description"
               onClick={() => openTunnel(1)}
            />
         )}
      </React.Fragment>
   )
}

export default Description
