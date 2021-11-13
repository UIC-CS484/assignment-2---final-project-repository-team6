import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'semantic-ui-react'
import axios from 'axios';


const DeleteAccount = () => {

    const history = useHistory()
    const [response, setReponse] = useState("")

    const deleteAccount = () => {
        axios({
            method: "post",
            withCredentials: true,
            url:"http://localhost:5000/delete_user"
        }).then( res => {
            console.log(res.data)
            if(res.data === "sucess"){
                history.push("/")
            }
        }).catch( err => {
            setReponse(JSON.stringify(err))
        })
    }

    return(
        <div>
            <h1>Delete Account</h1>
            <Button onClick = {deleteAccount}>ARE YOU SURE?????</Button>
            {response}
        </div>
    )
}

export default DeleteAccount;