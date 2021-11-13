import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react'
import UpdateUsername from './UpdateUsername';
import UpdatePassword from './UpdatePassword';
import DeleteAccount from './DeleteAccount';
import { useHistory } from 'react-router-dom';
import UpdateName from './UpdateName';

const AccountSettings= () => {

    const history = useHistory() 

    const [selected, updateSelected] = useState("username")

    const handleChange = (event, newSelect) => {
        updateSelected(newSelect)
    } 

    const renderForm = () => {
        if(selected === "name"){
            return(<UpdateName/>)
        }
        else if(selected === "username"){
            return(<UpdateUsername/>)
        }
        else if(selected === "password"){
            return(<UpdatePassword/>)
        }
        else if(selected === "delete"){
            return(<DeleteAccount/>)
        }
        else if(selected === "back"){
            history.push("/HomePage")
        }
    }


    return(
        <div>
            <Menu pointing vertical>
                <Menu.Item name = "update name" onClick = {(evt) => handleChange(evt, "name")}/>
                <Menu.Item name = "update username" onClick = {(evt) => handleChange(evt, "username")} />
                <Menu.Item name = "update password" onClick = {(evt) => handleChange(evt, "password")}/>
                <Menu.Item name = "delete account" onClick = {(evt) => handleChange(evt, "delete")}/>
                <Menu.Item name = "go back" onClick = {(evt) => handleChange(evt, "back")}/>
            </Menu>
            {renderForm()}

        </div>
    )
}

export default AccountSettings;