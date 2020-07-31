import React ,{useState} from 'react'
import {Loader,IconButton,Avatar,Text,ButtonGroup,Table,TableHead,TableBody,TableRow,TableCell,} from '@dailykit/ui'
import { AddIcon } from '../../../../../shared/assets/icons'
import { StyledWrapper, StyledHeader } from '../styled'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import ImportPopUp from '../../Forms/Import/ImportPopUP'
import { useTranslation } from 'react-i18next'



const ImportListing = () =>{
    const { t } = useTranslation()
    const [importPopup , setImportPopup] = React.useState(false)
    
    let importPopOpen  = () => setImportPopup(true)
    let importPopClose = () => setImportPopup(false)
    return(
        <StyledWrapper>
            <StyledHeader>
                <Text as="h2">Imports</Text>
                <IconButton type="solid" onClick={importPopOpen} >
                    <AddIcon color="#fff" size={24} />
                </IconButton>
                <ImportPopUp show={importPopup} Hide={importPopClose} />
            </StyledHeader>
            <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('uploaded on')}</TableCell>
                    <TableCell align="right">{t('actions')}</TableCell>
                </TableRow>
            </TableHead>
                
            </Table>
        </StyledWrapper>
    )
}

export default ImportListing