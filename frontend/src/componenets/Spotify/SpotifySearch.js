import React, { useEffect, useState } from 'react';
import { Form, List, Grid  } from 'semantic-ui-react';
import axios from 'axios'
import SpotifySong from './SpotifySong'
import SpotifyPlayer from 'react-spotify-web-playback';
import CommonArtist from './CommonArtist';
const querystring = require('querystring');

const SpotifySearch = () => {

    const [search, setSearch] = useState() 
    const [songs, setSongs] = useState([])
    const [currSongUri, setSongUri] = useState()
    const [tokens, setTokens] = useState()
    const [topArtists, setTopArtists] = useState([])

    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const getToken = () => {
        if(!tokens){
            axios({
                method: "get",
                withCredentials: true,
                url:"http://localhost:5000/spotify_accessToken"
            }).then( res => {
                setTokens()
                if(res.data != "Error"){
                    setTokens(res.data)
                }
                else{
                    console.log("error")
                }
            })
        }
        else{
            const headers = {
                headers: {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + tokens,
                }
            };
            searchSpotifySongs(headers)
            getUsersRecentSongs(headers)
        }
    }

    const searchSpotifySongs = (headers) => {
        axios.get("https://api.spotify.com/v1/search?" + 
            querystring.stringify({
                q: search,
                type: "track",
                limit: 8
        }), headers)
        .then(response => 
            {
                setSongs([])
                response.data.tracks.items.forEach(element => {
                    setSongs( songs => [...songs,<SpotifySong name = {element.name} id = {element.id} uri = {element.uri} artist = {element.artists[0].name} key = {element.id} update = { setSongUri } imageSrc = {element.album.images[2].url} /> ])
                })
            }).catch( err => {
                setTokens()
                getToken()
                searchSpotifySongs(headers);
            })
    }

    const getUsersRecentSongs = (headers) => {
        axios.get("https://api.spotify.com/v1/me/player/recently-played", headers).then( res => {

            console.log(res)

            setTopArtists([])

            let artists = {} 
            res.data.items.forEach( element => {
                const currArtist = element.track.artists[0].name
            artists[currArtist] =  1 + (artists[currArtist] || 0)
            })
      
            for(const artist in artists){
                let temp = {} 
                temp["artist"] = artist
                temp["count"] = artists[artist]
                temp["color"] = getRandomColor()
                setTopArtists( topArtists => [...topArtists, temp])
            }
        })
    }

    useEffect( () => {
        if(tokens){
            const headers = {
                headers: {
                'Accept': 'application/json',
                Authorization: 'Bearer ' + tokens,
                }
            };
            searchSpotifySongs(headers)
            getUsersRecentSongs(headers)
        }
    }, [tokens])

    const displaySpotify = () =>{
        if(tokens && currSongUri){
           return  <SpotifyPlayer token={tokens} uris={currSongUri} autoPlay = {true} /> 
        }
        else if(!tokens){
          return <h1>Player needs token</h1>
        }
        else{ 
          return <h1>Needs Song Uri</h1>
        }
      }

    return(
        <div>
            <Form onSubmit={getToken}>
                <Form.Group widths = "equal"> 
                    <Form.Input label = "Search" type = "text" placeholder = "Search Spotify" name = "spotify" onChange = {(evt) => setSearch(evt.target.value)}/> 
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
                    <Grid.Column>
                        <Grid>
                            <Grid.Row style={{height: "390px"}} ><CommonArtist artists = {topArtists} /> </Grid.Row>
                            <Grid.Row style={{marginRight: "20px"}}>{displaySpotify()}</Grid.Row>
                        </Grid>      
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            
        </div>
    )

}
export default SpotifySearch;