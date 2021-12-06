import React from 'react';
import { Table } from 'semantic-ui-react'

const SpotifyPlaylists = (props) => {
    return(
        <Table ui celled table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Tracks</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.playlists}
            </Table.Body>
        </Table>
    )

}
export default SpotifyPlaylists;

