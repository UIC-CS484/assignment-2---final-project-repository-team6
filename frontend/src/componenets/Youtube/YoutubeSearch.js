import React, { useState, setState } from 'react';
import { Form, List, Grid, Image, Button } from 'semantic-ui-react';
import axios from 'axios'
import YoutubeSong from './YoutubeSong';
import "../Styles/styles.css"
import YoutubePlaylist from './YoutubePlaylist'
import YoutubeChannelList from './YoutubeChannelList'
import YouTubePlayer from 'react-player/youtube';
// import YTSearch from 'youtube-api-search';
// import YoutubeGetData from './YoutubeGetData'



const YoutubeSearch = () => {
    const [response, setReponse] = useState("")
    const [searchVideo, setSearchVideo] = useState("")
    const [searchChannel, setSearchChannel] = useState("")
    const [intent, setIntent] = useState('Search Video');
    const [search_params, setYoutubeSearchVideo] = useState([])
    const [videos, setvideos] = useState([])
    const [channelVideoList, setChannelVideoList] = useState([])
    const [currChannelId, setChannelId] = useState()
    const [currSongUrl, setSongUri] = useState()
    const [currChannelName, setCurrChannelName] = useState()
    const [channelVideoCache, setChannelVideoCache] = useState({})

    const WATCH_URL = "https://www.youtube.com/watch?v=";
        // old api key = AIzaSyDKmSJpeUk029A3eJfRD-tgefJ9D4XFF7I
    const YOUTUBE_API_KEY = "AIzaSyCOVCCGsybib6c8MJE8p1dSNtAQcn7hQmM";
    const default_video_details_url  = "https://www.googleapis.com/youtube/v3/videos?"
    const default_search_url = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + YOUTUBE_API_KEY + "&";
    const default_channel_url = "https://www.googleapis.com/youtube/v3/search?key=" + YOUTUBE_API_KEY + "&part=snippet,id&order=date&maxResults=1&channelId="
    const query = "q=" + search_params;
    const maxResultsString = "maxResults=";
    const desiredMaxResults = "1";
    const baseurl_video =  default_search_url + maxResultsString + desiredMaxResults + "&type=video&" + query
    const baseurl_channel =  default_search_url + maxResultsString + desiredMaxResults + "&type=channel&" + query


    
    const parse_video_details = (res) => {
        setvideos([])
        res.data.items.forEach(element => {
            setvideos( videos => [...videos,<YoutubeSong name = {element.snippet.name} id = {element.id.videoId} 
                    uri = {WATCH_URL + element.id.videoId} channelTitle = {element.channelTitle} intent = {intent}
                    channelID = {element.snippet.channelId} videoId = {element.id.videoId} update = { setSongUri } 
                    description = {element.snippet.description} imageSrc = {element.snippet.thumbnails} updateChannel = {setChannelId}
                    thumbnails = {element.snippet.thumbnails} title = {element.snippet.title} 
                    publishedAt = {element.snippet.publishedAt}/>])
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
    const displayChannelList = () =>{
        if(currChannelId){
            var videoIdList = []
            console.log("Channel url:", currChannelId)
            var url = default_channel_url + currChannelId
            axios({
                url: url,
                method: 'GET'
            }).then(res => {

                res.data.items.forEach(element => {
                    videoIdList.push(element.id.videoId)
                    if (channelVideoCache[currChannelId] === element.id.videoId){
                        console.log("dont need to cache")
                    }
                    else{
                        channelVideoCache[currChannelId] = element.id.videoId;
                    }
                })
                // setState({ setChannelId : null })
            }).catch( err => {
                console.log(err)
            })

            var videoDetailsURL = default_video_details_url + "part=snippet&key=" + YOUTUBE_API_KEY + "&"
            console.log("Video detail url:", videoDetailsURL)
            
            videoIdList.forEach(element => {
                console.log("Element:", element)
                axios({
                    url: videoDetailsURL + element,
                    method: 'GET'
                }).then(res => {
                    console.log("title:", element.snippet.title)
                    setvideos( videos => [...videos,<YoutubeChannelList title = {element.snippet.title}
                        publishedAt = {element.snippet.publishedAt} />])
                })
            })
            return(
                <YoutubeChannelList />
            )
        }
      }
      
    const search_triggered = () => {
        if(search_params){
            if (intent === "Search Video"){
                axios({
                    url: baseurl_video,
                    method: 'GET'
                }).then(res => {
                    parse_video_details(res);
                    console.log("searched for video");
                    console.log(res);
                }).catch( err => {
                    console.log(err)
                })
            }
            else{
                axios({
                    url: baseurl_channel,
                    method: 'GET'
                }).then(res => {
                    parse_video_details(res);
                    console.log("searched for video");
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
        <div style={{marginLeft:"9%", marginRight:"9%"}}>
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
                            {videos}
                        </List>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid>
                            {/* <Grid.Row style={{marginRight: "500px"}}>{displayPlaylist()}</Grid.Row> */}
                            <Grid.Row style={{marginRight: "20px"}}>{displayChannelList()}</Grid.Row>
                        </Grid>      
                    </Grid.Column>
                </Grid.Row>
            </Grid>
    </div>
    )
}

export default YoutubeSearch;