import React from 'react';
import ReactPlayer from 'react-player'
import { List, Image, Grid, Container } from 'semantic-ui-react'
import {Row, Col} from "react-bootstrap";
import heart from "../../Icons/heart.png"
import playlist from "../../Icons/playlist_black.png"
import Button from '@restart/ui/esm/Button';

const YoutubeSong = (props) => {
    const youtube_base = "https://www.youtube.com/embed/"
    const thumbnail = props.thumbnails
    const height = thumbnail.height
    const width = thumbnail.width
    const src = thumbnail.url
    const player_url = youtube_base  + props.videoId
    const channel_url = youtube_base + "channel/" + props.channelID
    // onClick = { () => props.update(props.uri)}
    const typeDetermination = () => {
        // <Grid columns={4} className="bar"
        //                         style={{width:"99.9%", height:"14%", marginTop:"-1px", marginLeft:".05%"}} >
        //                         <Grid.Row celled>
        //                         <Grid.Column></Grid.Column>
        //                             <Grid.Column>
        //                                 <Button type="submit" name="playlist-button" class="ui submit button">
        //                                     <img src={playlist} alt=""/>
        //                                 </Button>
        //                             </Grid.Column>
        //                             <Grid.Column>
        //                             <Button type="submit" name="heart-button" class="ui submit button"
        //                             onClick = { () => props.update("Bro")}>
        //                                 <img src={playlist} alt=""/>
        //                             </Button>
        //                             </Grid.Column>
        //                             <Grid.Column style={{paddingTop:"3em"}}>
        //                             </Grid.Column>
        //                         </Grid.Row>
        //                     </Grid>
        if (props.intent === "Search Video"){
            return(
                <div>
                    <List.Item style={{marginTop:"1em"}}> 
                        <List.Content>
                                <ReactPlayer url={player_url} style={{width:"100%"}} 
                                    light={false} 
                                    controls={true} />
                        </List.Content>
                    </List.Item>
                </div>
            )
        }
        else{
            // <Image size="medium" circular src={thumbnail.medium.url}/>
            console.log("Channel Id:", props.channelID)
            return(
                <div>
                    <List.Item onClick = { () => props.updateChannel(props.channelID)}> 
                        <Grid columns={2} width="100%">
                            <Grid.Row celled>
                                <Grid.Column left five wide column style={{paddingTop:"1em"}}>
                                    <img src={thumbnail.medium.url} class="ui medium circular image" wrapepd alt=""/>
                                </Grid.Column>
                                <Grid.Column style={{paddingTop:"3em"}}>
                                    <p style={{fontSize:"18px", fontWeight:"bold"}}>{props.channelTitle}</p>
                                    <p style={{fontSize:"15px"}}>{props.description}</p>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </List.Item>
                </div>
            )
        }
    }
    return(
        <div width="100%">
            {typeDetermination()}
        </div>
    )
}
export default YoutubeSong;