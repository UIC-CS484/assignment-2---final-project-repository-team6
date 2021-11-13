import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Dropdown, Menu } from 'semantic-ui-react';
import axios from 'axios'
import { Button } from 'semantic-ui-react'
import SpotifySearch from './Spotify/SpotifySearch';
import YoutubeSearch from './Youtube/YoutubeSearch';


const HomePage= () => {

    const [response, setReponse] = useState("")
    const [intent, setIntent] = useState('Search Spotify');
    const [spotifyIsPositive, setSpotifyIsPositive] = useState(true)
    const [youtubeIsPositive, setYoutubeIsPositive] = useState(false)

    const [yt_search, setYoutubeSearch] = useState("")


    // On change effects, search bar and more.
    const handleChange = (event, intent) => {
        setIntent(intent);

        if(intent === "Search Spotify"){
            setSpotifyIsPositive(true)
            setYoutubeIsPositive(false)
        }
        else{
            setYoutubeIsPositive(true)
            setSpotifyIsPositive(false)
        }
    }

    const renderForm = () => {
        if(intent === "Search Spotify"){
            return(<SpotifySearch/>)
        }
        else{
            return(<YoutubeSearch/>)
        }

    }
    
    const youtubeSearchAction = (event) =>{
        if(yt_search){
            axios({
                method: "post",
                data: {
                    yt_search: yt_search
                },
                withCredentials: true,
                url:"http://localhost:5000/youtube_api_search"
                
            }).then( res => {
                setReponse(res.data)

            }).catch( err => {
                if(err.message === "Request failed with status code 401"){
                    setReponse("Failed search lookup")
                }
                else{
                    setReponse(JSON.stringify(err))
                }
            })
        }
        else{
            console.log("No search sent")
        }
    }


    // Account information Dropdown
    const history = useHistory();

    const redirectSettings = () => {
        history.push("./account")
    }

    const logout = () => {
        axios({
            method: "post",
            withCredentials: true,
            url:"http://localhost:5000/logout"
        }).then( res => {
            if(res.data === "success"){
                history.push("/")
            }
        })
    }

    const [user, setUser] = useState("") 
    
    useEffect( () => {
        axios({
            method: "post",
            withCredentials: true,
            url:"http://localhost:5000/user"
        }).then( res => {
            if(res.data == "Cookie is invalid"){
                history.push('/')
            }
            setUser(res.data)
        })
    }, [])

    const options = [
        { key: 1, text: 'Settings', value: 1, icon: 'settings', onClick: redirectSettings},
        { key: 2, text: 'Logout', value: 2, icon: 'log out', onClick: logout}, 
      ]

    return(
        <div>
            <Menu>
                <Menu.Item header> 
                    <h1>Welcome to our App {user.name}   {response}</h1>
                </Menu.Item>
                <Menu.Item position = "right">
                    <Dropdown text = "Account Info" options = {options} simple item />
                </Menu.Item> 
            </Menu>
            <Button.Group>
                <Button positive = {spotifyIsPositive} onClick={ (event) => handleChange(event, "Search Spotify") } >Search Spotify</Button>
                <Button.Or />
                <Button positive = {youtubeIsPositive} onClick={ (event) => handleChange(event, "Search Youtube") } >Search Youtube</Button>
            </Button.Group>

            {renderForm()}
        </div>
    )
}

export default HomePage;