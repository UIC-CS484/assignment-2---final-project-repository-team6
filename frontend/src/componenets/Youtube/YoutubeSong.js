import React from 'react';
import { List, Image } from 'semantic-ui-react'

const YoutubeSong = (props) => {
    return(
        <List.Item  onClick = { () => props.update(props.uri)}> 
            <Image src = {props.imageSrc}/>
            <List.Content>
                <p>{props.name}</p> 
                <p>{props.channel}</p>    
            </List.Content>
            
        </List.Item>
    )
}
export default YoutubeSong;