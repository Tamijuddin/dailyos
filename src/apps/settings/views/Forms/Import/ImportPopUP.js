import React ,{useState} from "react"
import "./style.css"
import { Loader, IconButton, Avatar, Text, TextButton } from '@dailykit/ui'
import { StyledWrapper, StyledHeader } from '../styled'

const ImportPopUp =(props)=>{
    const [uploaded,setuploaded] = React.useState([])

    const fileSelectorHandler = (event) =>{
        setuploaded([...uploaded,{files:event.target.files[0]}])
    }
    const fileupload = () =>{
        console.log(uploaded)
        callBack()
    }
    const callBack = () => {
        props.callbackFromParent(uploaded);
    }

    if (props.show){
        return(
            <div className='model-wrapper'>
                <div className='model-backdrop' onClick={props.Hide} />
                <div className='model-box'>
                    <Text className='text' as="h2">Import</Text>
                    <hr></hr>
                    <section className='input'> <input type='file' onChange={fileSelectorHandler}/></section>
                    <section className='Buttons'>
                    <TextButton  type='solid' onClick={fileupload} >upload</TextButton>
                    <TextButton  type="solid" onClick={props.Hide} >close</TextButton>
                    </section>
                </div>
            </div>
        )
    }
    return null;
}

export default ImportPopUp