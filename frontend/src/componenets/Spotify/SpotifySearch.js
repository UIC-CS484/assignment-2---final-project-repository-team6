import React, { useEffect, useState } from 'react';
import { Form, List, Grid, Dropdown, Button, Table } from 'semantic-ui-react';
import axios from 'axios'
import SpotifySong from './SpotifySong'
import SpotifyPlaylist from './SpotifyPlaylist'
import SpotifyPlayer from 'react-spotify-web-playback';
import CommonArtist from './CommonArtist';
import "../Styles/styles.css"
import SpotifyPlaylists from './SpotifyPlaylists';
const querystring = require('querystring');

const SpotifySearch = () => {

    const [search, setSearch] = useState() 
    const [songs, setSongs] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [currSongUri, setSongUri] = useState()
    const [tokens, setTokens] = useState()
    const [topArtists, setTopArtists] = useState([])
    const [displayRecentSongs, setSearchVideo] = useState()
    const [displayPlaylists, setdisplayPlaylists] = useState()
    const [intent, setIntent] = useState("View Recent Artists")
    const [playlistImages, setPlaylistImages] = useState([])
    const [recentArtistSelected, setRecentArtistSelected] = useState(true)
    const [playlistSelected, setPlaylistSelected] = useState(false)

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
                    setSongs( songs => [...songs,<SpotifySong name = {element.name} id = {element.id} uri = {element.uri} 
                        artist = {element.artists[0].name} key = {element.id} update = { setSongUri } 
                        imageSrc = {element.album.images[2].url} /> ])
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
            // console.log("songs", res)
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

    const getUserPlaylists = (headers) =>{
        axios.get("https://api.spotify.com/v1/me/playlists", headers
        
        ).then( res => {

            // console.log("Playlist Objects", res)

            setPlaylists([])
            res.data.items.forEach(element => {
                console.log(element.name)
                setPlaylists( playlists => [...playlists,<SpotifyPlaylist name = {element.name} image = {element.images[0].url} 
                    tracks = {element.tracks.total} description = {element.description}/>])
            })
        }).catch( err => {
            // console.log(err)
            setTokens()
            getToken()
            getUserPlaylists(headers);
        })
        // console.log(playlists);
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
            getUserPlaylists(headers)
        }
    }, [tokens])

    const displaySpotify = () =>{
        if(tokens && currSongUri){
           return  <SpotifyPlayer token={tokens} uris={currSongUri} autoPlay = {true} /> 
        }
        else if(!tokens){
          return <h1>Needs a valid token.</h1>
        }
        else{ 
          return <h1></h1>
        }
      }

    const handleChange = (event, intent) => {
        setIntent(intent);

        if(intent === "View Recent Artists"){
            setRecentArtistSelected(true)
            setPlaylistSelected(false)
        }
        else{
            setRecentArtistSelected(false)
            setPlaylistSelected(true)
        }
    }
    const displayChart = () =>{
        if(tokens){
            if(intent === "View Recent Artists"){
                return(
                    <CommonArtist artists = {topArtists}/> 
                )
            }
            else{
                return(
                    <SpotifyPlaylists playlists = {playlists}/>
                )
            }
        }
    }
    return(
        <div style={{marginLeft:"9%", marginRight:"9%"}}>

            <Form onSubmit={getToken}>
                <Form.Group widths = "equal"> 
                    <Form.Input label = "Search" type = "text" placeholder = "Search Spotify" 
                    name = "spotify" onChange = {(evt) => setSearch(evt.target.value)}/> 
                </Form.Group>
                <Grid>
                    <Grid.Row columns = {2}>
                        <Grid.Column>
                            <Form.Button type = "submit" style={{marginBottom:"1em"}} >Search</Form.Button>
                        </Grid.Column>
                        <Grid.Column style={{paddingLeft:"13%"}}>
                            <Button.Group>
                                <Button positive = {recentArtistSelected} onClick={ (event) => handleChange(event, "View Recent Artists") } >View Recent Artists</Button>
                                <Button.Or />
                                <Button negative = {playlistSelected} onClick={ (event) => handleChange(event, "View Playlist") }> View Playlist</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
                            <Grid.Row style={{height: "390px"}}>{displayChart()}</Grid.Row>
                            <Grid.Row style={{marginRight: "20px"}}>{displaySpotify()}</Grid.Row>
                        </Grid>      
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )

}
export default SpotifySearch;