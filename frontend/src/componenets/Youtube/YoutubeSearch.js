import React, { useState } from 'react';
import { Form, List, Grid, Image  } from 'semantic-ui-react';
import axios from 'axios'
import YoutubeSong from './YoutubeSong';
// import YTSearch from 'youtube-api-search';
// import YoutubeGetData from './YoutubeGetData'



const YoutubeSearch = () => {
    const [response, setReponse] = useState("")
    const [search_params, setYoutubeSearch] = useState([])
    const [songs, setSongs] = useState([])
    const [currSongUri, setSongUri] = useState()

    const WATCH_URL = "https://www.youtube.com/watch?v=";
    const YOUTUBE_API_KEY = 'AIzaSyALI-6Nyga6ee6vZOOsT_UM_lTjEush68E';
    const default_url = 'https://www.googleapis.com/youtube/v3/search?';
    const query = "q=" + search_params;
    const maxResultsString = "maxResults=";
    const desiredMaxResults = "3";
    const baseurl =  default_url + "part=snippet&key=" + YOUTUBE_API_KEY + "&" + maxResultsString + desiredMaxResults + "&" + query


        
    const search_triggered = () => {
        if(search_params){

            axios({
                url: baseurl,
                method: 'GET'
            }).then(res => {
                console.log(res);
                setSongs([])
                res.data.items.forEach(element => {
                    setSongs( songs => [...songs,<YoutubeSong name = {element.snippet.name} id = {element.id.videoId} 
                            uri = {WATCH_URL + element.id.videoId} channel = {element.snippet.channelTitle} 
                            description = {element.snippet.description} key = {element.id.videoId} update = { setSongUri } 
                            imageSrc = {element.snippet.thumbnails.default.url} thumbnails = {element.snippet.thumbnails} /> ])
                            console.log("Element", songs)
                        },
                // res.data.items.forEach(element =>{
                //     console.log("Element", element.id.videoId)
                // })
                );
            }).catch( err => {
                console.log(err)
            })
        }
    }   

    const sortData = () => {
            
    }
    
    
    return(
        <div>
        <Form onSubmit={search_triggered}>
            <Form.Group widths = "equal"> 
                <Form.Input label = "Search" type = "text" placeholder = "Search Youtube" name = "search_params" onChange = {(evt) => setYoutubeSearch(evt.target.value)}/> 
            </Form.Group>
            <Form.Button type = "submit">Search</Form.Button>
        </Form>
        <Grid>
                <Grid.Row columns = {2}>
                    <Grid.Column>
                        <List divided verticalAlign='middle'>
                            {songs}
                        </List>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    </div>
    )
}

export default YoutubeSearch;