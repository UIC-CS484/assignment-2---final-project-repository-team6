import React from 'react';
import { List, Image } from 'semantic-ui-react'

const SpotifySong = (props) => {
    return(
        <List.Item  onClick = { () => props.update(props.uri)}> 
            <Image src = {props.imageSrc}/>
            <List.Content>
                <p>{props.name}</p> 
                <p>{props.artist}</p>    
            </List.Content>
            
        </List.Item>
    )

}
export default SpotifySong;

