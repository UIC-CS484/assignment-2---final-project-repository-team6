import axios from 'axios';
import React, {useState} from 'react';
import { Form } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom';

const Signupform = () => {

    const history = useHistory()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [retry, setRetry] = useState("")

    const [response, setReponse] = useState("")


    const signUpAction = (event) => {
        if(firstName && lastName && username && password && retry && password === retry){
            // valid sign up 
            axios({
                method: "post",
                data: {
                    name: firstName,
                    username: username,
                    password: password
                },
                withCredentials: true,
                url:"http://localhost:5000/register"
                
            }).then( res => {
                if(res.data == "Success"){
                    history.push('/Spotify')
                }
                setReponse(res.data)
            }).catch( err => {
                setReponse(JSON.stringify(err))
            })
        }
        else{
            console.log("not valid")
        }
    }

    return(
        <div>
            <Form onSubmit = {signUpAction}>
                <Form.Group widths = "equal"> 
                    <Form.Input label = "First name" placeholder = "First name" type = "text" name = "first" onChange = {(evt) => setFirstName(evt.target.value)}/>
                    <Form.Input label = "Last name" placeholder = "Last name" type = "text" name = "last" onChange = {(evt) => setLastName(evt.target.value)}/>
                </Form.Group>
                <Form.Input label = "Username" type = "text" placeholder = "Username" name = "username" onChange = {(evt) => setUsername(evt.target.value)}/>
                <Form.Input label = "Password" type = "password" placeholder = "Password" name = "password" onChange = {(evt) => setPassword(evt.target.value)}/>
                <Form.Input label = "Confirm Password" type = "password" placeholder = "Confirm Password" onChange = {(evt) => setRetry(evt.target.value)}/>
                <Form.Button type = "submit">Sign up!</Form.Button>
            </Form>
            <h1>{response}</h1>
        </div>
    )
}

export default Signupform;