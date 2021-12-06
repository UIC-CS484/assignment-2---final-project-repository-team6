import React, { useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player'
import { List, Image, Grid, Container } from 'semantic-ui-react'

const YoutubePlaylist = (props) =>{
    const [response, setReponse] = useState("");

    const database_call = () =>{
        axios({
            method: "get",
            url:"http://localhost:5000/youtube_playlist_search"
            
        }).then( res => {
            setReponse(res.data)
            console.log(res.data)
        }).catch( err => {
            if(err.message === "Request failed with error:" + err){
            }
        })
        // setState(prevState => { persons: [...prevState.persons, persons] });
    } 

    // {values.map(element =>{
    //     return(
    //         <tr>
    //             <td>{element.title}</td>
    //             <td>{element.artist}</td>
    //         </tr>
    //     )
    // })}

    return(
        <div width="100%">
            {database_call()}
            <table class="ui celled table">
                <thead>
                    <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Artist</th>
                    </tr>
                </thead>
                <tbody>
                <tr>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
export default YoutubePlaylist;