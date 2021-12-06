import React from 'react';
import { List, Image } from 'semantic-ui-react'

const YoutubeChannelList = (props) => {
    console.log(props.title, props.name)
    return(
        <List.Item > 
            <List.Content>
                <p>{props.title}</p> 
                <p>{props.name}</p>    
            </List.Content>
        </List.Item>
    )
}
export default YoutubeChannelList;

