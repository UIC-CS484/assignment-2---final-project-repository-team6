import React, { useState } from 'react';
import { Form, List, Grid, Image, Button } from 'semantic-ui-react';
import axios from 'axios'
import YoutubeSong from './YoutubeSong';
import "../Styles/styles.css"
// import YTSearch from 'youtube-api-search';
// import YoutubeGetData from './YoutubeGetData'



const YoutubeSearch = () => {
    const [response, setReponse] = useState("")
    const [searchVideo, setSearchVideo] = useState("")
    const [searchChannel, setSearchChannel] = useState("")
    const [intent, setIntent] = useState('Search Video');
    const [search_params, setYoutubeSearchVideo] = useState([])
    const [songs, setSongs] = useState([])
    const [currSongUri, setSongUri] = useState()
    
// ?key={your_key_here}&channelId={channel_id_here}&part=snippet,id&order=date&maxResults=20
    const WATCH_URL = "https://www.youtube.com/watch?v=";
    const YOUTUBE_API_KEY = 'AIzaSyALI-6Nyga6ee6vZOOsT_UM_lTjEush68E';
    const default_url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + YOUTUBE_API_KEY + "&";
    const query = "q=" + search_params;
    const maxResultsString = "maxResults=";
    const desiredMaxResults = "1";
    const baseurl_video =  default_url + maxResultsString + desiredMaxResults + "&type=video&" + query
    const baseurl_channel =  default_url + maxResultsString + desiredMaxResults + "&type=channel&" + query


    
    const parse_search = (res) => {
        setSongs([])
        res.data.items.forEach(element => {
            setSongs( songs => [...songs,<YoutubeSong name = {element.snippet.name} id = {element.id.videoId} 
                    uri = {WATCH_URL + element.id.videoId} channel = {element.snippet.channelTitle} 
                    description = {element.snippet.description} videoId = {element.id.videoId} update = { setSongUri } 
                    imageSrc = {element.snippet.thumbnails.default.url} thumbnails = {element.snippet.thumbnails}/>])
        },
        res.data.items.forEach(element =>{
            if(element.id.videoId){
                console.log("Video found with id:", element.id.videoId)
            }
            else{
                console.log("Returns a channel:", element.id.channelTitle)
            }
        })
        );
        
    }
    const search_triggered = () => {
        if(search_params){
            if (intent === "Search Video"){
                axios({
                    url: baseurl_video,
                    method: 'GET'
                }).then(res => {
                    parse_search(res);
                    console.log(res);
                }).catch( err => {
                    console.log(err)
                })
            }
            if (intent === "Search Channel"){
                axios({
                    url: baseurl_channel,
                    method: 'GET'
                }).then(res => {
                    parse_search(res);
                    console.log(res);
                }).catch( err => {
                    console.log(err)
                })
            }
        }
    }   

    // Determines whether the user wants to search for videos or channels. Sets state.
    const handleChange = (event, intent) => {
        setIntent(intent);

        if(intent === "Search Video"){
            setSearchVideo(true)
            setSearchChannel(false)
        }
        else{
            setSearchVideo(false)
            setSearchChannel(true)
        }
    }

    const handleSearch = (value) => {
        if(setSearchVideo){
            setYoutubeSearchVideo(value)
        }
        else if(setSearchChannel){
            
        }
    }
    
    
    return(
        <div class="ui container">
            <Form onSubmit={search_triggered}>
            <Grid style={{paddingTop:"2em", paddingBottom:"2em", marginLeft:"1px"}}>
                <Button inverted primary button type = {searchVideo} onClick={ (event) => handleChange(event, "Search Video") } style={{marginRight:"2em"}}>Search For Video</Button>
                <Button inverted secondary button type = {searchChannel} onClick={ (event) => handleChange(event, "Search Channel") } >Search For Channel</Button>
            </Grid>
                <Form.Group widths = "equal"> 
                    <Form.Input type = "text" placeholder = "Search Youtube" name = "search_params" onChange = {(evt) => handleSearch(evt.target.value)}/> 
                </Form.Group>
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