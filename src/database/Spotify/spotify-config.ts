import { Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import { getConfigData,cryptr,configModelThirdParty} from '../Config/config';

export const spotifyApi = getConfigData(configModelThirdParty,cryptr).then((data) =>{
    return new SpotifyWebApi({
        clientId: data.data.spotify.clientId,
        clientSecret: data.data.spotify.clientSecret,
        redirectUri: data.data.spotify.redirectUri,
    });
})





export const spotifyAuth = async(error:string,code:string,state:string,res:Response) =>{
    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
      }

       (await spotifyApi)
        .authorizationCodeGrant(code)
        .then(async data => {
          const access_token = data.body['access_token'];
          const refresh_token = data.body['refresh_token'];
          const expires_in = data.body['expires_in'];
    
          (await spotifyApi).setAccessToken(access_token);
          (await spotifyApi).setRefreshToken(refresh_token);
    
          console.log('access_token:', access_token);
          console.log('refresh_token:', refresh_token);
    
          console.log(
            `Sucessfully retreived access token. Expires in ${expires_in} s.`
          );
          res.send('Success! You can now close the window.');
    
          setInterval(async () => {
            const data = await (await spotifyApi).refreshAccessToken();
            const access_token = data.body['access_token'];
    
            console.log('The access token has been refreshed!');
            console.log('access_token:', access_token);
            (await spotifyApi).setAccessToken(access_token);
          }, expires_in / 2 * 1000);
        })
        .catch(error => {
          console.error('Error getting Tokens:', error);
          res.send(`Error getting Tokens: ${error}`);
        });
}

export const getPodcastData = async (id:string,res:Response) =>{
    (await spotifyApi).getShow(id).then((data) =>{
        res.status(200).send(data.body)
    }).catch((error) =>{
        res.status(500).send(error)
    })
}
