import React from 'react';
const querystring = require('querystring');

const Spotifylogin = () => {

    const clientId = "426327bb47284651ba7d3aac5790edc1"
    const redirect_uri = "http://localhost:3000/spotify/success";
    const scope = 'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-read-recently-played ';

    const fullAuthLink = 'https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirect_uri,
            show_dialog: true
        })

    return(
        <div >
            <h1>Gimme yo spotify data</h1>
            <a href = {fullAuthLink}>
                <button>Click meee</button>
            </a>
        </div>
    )

}
export default Spotifylogin;

