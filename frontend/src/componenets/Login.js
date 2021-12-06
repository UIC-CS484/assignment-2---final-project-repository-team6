import React, {useState, useEffect} from 'react';
import Loginform  from './Loginform';
import Signupform from './Signupform';
import { Button } from 'semantic-ui-react'
import axios from 'axios'
import { useHistory } from "react-router-dom";

const Login = () => {
    const history = useHistory();
    const [intent, setIntent] = useState('Sign up');
    const [loginIsPositive, setLoginIsPostive] = useState(false)
    const [signupIsPositive, setSignupPositive] = useState(true)

    useEffect( () => {
        axios({
            method: "post",
            withCredentials: true,
            url:"http://localhost:5000/user"
        }).then( res => {
            if(res.data != "Cookie is invalid"){
                history.push('/HomePage')
            }
        })
    }, [])

    const handleChange = (event, intent) => {
        setIntent(intent);

        if(intent === "Log in"){
            setLoginIsPostive(true)
            setSignupPositive(false)
        }
        else{
            setSignupPositive(true)
            setLoginIsPostive(false)
        }
    }

    const renderForm = () => {
        if(intent === "Log in"){
            return(<Loginform/>)
        }
        else{
            return(<Signupform/>)
        }
    }
    

    return(
        <div style = {{width: "50%", marginLeft: "auto", marginRight: "auto", marginTop: "10px", 
                        paddingRight: "1em"}}>
            <div align = "center">
                <Button.Group>
                    <Button positive = {signupIsPositive} onClick={ (event) => handleChange(event, "Sign up") } >Sign up</Button>
                    <Button.Or />
                    <Button positive = {loginIsPositive} onClick={ (event) => handleChange(event, "Log in") } >Login</Button>
                </Button.Group>
            </div>
            {renderForm()}
        </div>
    )

}
export default Login;