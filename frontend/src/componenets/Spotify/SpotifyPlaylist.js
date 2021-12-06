import React from 'react';
import {List, Table} from 'semantic-ui-react';

const SpotifyPlaylist = (props) => {
    return(
        <Table.Row >
            <Table.Cell singleLine textAlign='center'>
                {props.name}
            </Table.Cell>
            <Table.Cell singleLine textAlign='center'>
                {props.tracks}
            </Table.Cell>
        </Table.Row>
    )
}

export default SpotifyPlaylist;