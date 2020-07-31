import React ,{useState} from 'react'
import {Loader,IconButton,Avatar,Text,ButtonGroup,Table,TableHead,TableBody,TableRow,TableCell,} from '@dailykit/ui'
import { AddIcon } from '../../../../../shared/assets/icons'
import { StyledWrapper, StyledHeader } from '../styled'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import ImportPopUp from '../../Forms/Import/ImportPopUP'
import { useTranslation } from 'react-i18next'
import Faqs from "./Faqs" 
import "./style.css"



const ImportListing = () =>{
    const tableRef = React.useRef()
    const { t } = useTranslation()
    const [importPopup , setImportPopup] = React.useState(false)
    const [upload       , setupload    ] = React.useState([])
    
    let importPopOpen  = () => setImportPopup(true)
    let importPopClose = () => setImportPopup(false)

    const myCallback = (dataFromChild) => {
        setupload(dataFromChild)
        callBack()
        
    }
    function callBack () {
        console.log(upload,"j")
    }

    var today = new Date(),
    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();


    return(
        <StyledWrapper>
            <StyledHeader>
                <Text as="h2">Imports</Text>
                <IconButton type="solid" onClick={importPopOpen} >
                    <AddIcon color="#fff" size={24} />
                </IconButton>
                <ImportPopUp show={importPopup} Hide={importPopClose} callbackFromParent={myCallback} />
            </StyledHeader>
            <div classNmae="table-body">
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>{t('Name')}</TableCell>
                        <TableCell>{t('uploaded on')}</TableCell>
                        <TableCell>{t('actions')}</TableCell>
                        <TableCell>{t('actions')}</TableCell>
                        <TableCell>{t('actions')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {upload.map(item => (
                    <TableRow key={item.name}>
                        <TableCell>{item.files.name}</TableCell>
                        <TableCell>{date}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            <div className='q-and-a' >
                <Faqs />
            </div>
        </StyledWrapper>
    )
}

export default ImportListing