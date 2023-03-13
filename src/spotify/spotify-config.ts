import SpotifyWebApi from "spotify-web-api-node";
import { Response } from 'express-serve-static-core';
import { configThirdPartyValues } from "src/database/Config/config";



export const spotifyLogin = async (res: Response<any, Record<string, any>, number>) => {
    const spotifyApi = new SpotifyWebApi({
        clientId: configThirdPartyValues.spotify.clientId,
        clientSecret: configThirdPartyValues.spotify.clientSecret
    })
    
}
