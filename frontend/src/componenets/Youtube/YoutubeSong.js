import React from 'react';
import { List, Image } from 'semantic-ui-react'

const YoutubeSong = (props) => {
    const thumbnail = props.thumbnails.medium
    const height = thumbnail.height
    const width = thumbnail.width
    const src = thumbnail.url
    return(
        <List.Item  onClick = { () => props.update(props.uri)}> 
            <List.Content>
                <Image width={width} height={height} src={src} alt=""/>
                <p>{props.name}</p> 
                <p>{props.channel}</p>
            </List.Content>
            
        </List.Item>
    )
}
export default YoutubeSong;