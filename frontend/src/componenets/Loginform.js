import axios from 'axios';
import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import Captcha from './Captcha';
import { Form } from 'semantic-ui-react';

const Loginform = () => {
    const history = useHistory();
    // const reRef = useRef();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [response, setReponse] = useState("")


    const loginAction = (event) =>{
        if(username && password){
            axios({
                method: "post",
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true,
                url:"http://localhost:5000/login"
                
            }).then( res => {
                setReponse(res.data)

                history.push("./HomePage")
            }).catch( err => {
                if(err.message === "Request failed with status code 401"){
                    setReponse("Failed login")
                }
                else{
                    setReponse(JSON.stringify(err))
                }
            })
        }
        else{
            console.log("username or password not there")
        }
    }

    return(
        <div>
            <Form onSubmit={loginAction}>
                <Form.Group widths = "equal"> 
                    <Form.Input label = "Username" type = "text" placeholder = "Username" name = "username" onChange = {(evt) => setUsername(evt.target.value)}/>
                    <Form.Input label = "Password" type = "password" placeholder = "Password" name = "password" onChange = {(evt) => setPassword(evt.target.value)}/>   
                </Form.Group>
                <Captcha/>
                <Form.Button type = "submit">Login!</Form.Button>
            </Form>
            <h1>{response}</h1>
        </div>
    )
}

export default Loginform;