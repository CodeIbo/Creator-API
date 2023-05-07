import { Response } from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import { getConfigData, cryptr, configModelThirdParty } from '../Config/config';
import { db } from '../firebaseConfig';
import customSpotifyEpisode from 'src/interface/customSpotifyEpisode.model';
import admin from 'firebase-admin';

const dbSpotify = db.collection('Spotify');

export const spotifyApi = getConfigData(configModelThirdParty, cryptr).then((data) => {
  return new SpotifyWebApi({
    clientId: data.data.spotify.clientId,
    clientSecret: data.data.spotify.clientSecret,
    redirectUri: data.data.spotify.redirectUri,
  });
})


export const spotifyAuth = async (error: string, code: string, state: string, res: Response) => {
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

export const updateDataFromApiSpotify = async (id: string, res: Response) => {
  let spotifyPodcastEpisodes: SpotifyApi.EpisodeObjectSimplified[]
    = [];
  let dbPodcastEpisodes: customSpotifyEpisode[] = [];

  (await spotifyApi).getShow(id).then((data) => {
    data.body.episodes.items
    spotifyPodcastEpisodes = data.body.episodes.items
  }).then(() => {

    dbSpotify.get().then((snapshot:FirebaseFirestore.QuerySnapshot) =>{
      snapshot.docs.forEach((doc:FirebaseFirestore.QueryDocumentSnapshot) =>{
        const episodeDB:customSpotifyEpisode = doc.data() as customSpotifyEpisode
        dbPodcastEpisodes.push(episodeDB)
      })
     }).then(() => {
      spotifyPodcastEpisodes.map(spotifyEpisode =>{
        const foundItem = dbPodcastEpisodes.find(dbSpotifyEpisode => spotifyEpisode.id === dbSpotifyEpisode.id)
        if(!foundItem){
          const dbEpisodeModified = {
            id: spotifyEpisode.id,
            title: spotifyEpisode.name,
            description: spotifyEpisode.description,
            preview_url: spotifyEpisode.audio_preview_url,
            url: spotifyEpisode.external_urls.spotify,
            imageUrl: spotifyEpisode.images[0].url,
            tags: []
          }
          dbSpotify.doc(spotifyEpisode.id).set(dbEpisodeModified)
        }
      })
     }).finally(() =>{
      res.send("Spotify List Updated").status(200);
     }).catch(error =>{
      res.status(error.statusCode).send(error.body.error.message)
     })

  }).catch((error) => {
    res.status(error.statusCode).send(error.body.error.message)
  })

}

export const editSpotifyEpisode = async (editedEpisode:customSpotifyEpisode, id:string, res:Response) =>{
  let episodeToSent :customSpotifyEpisode | ({ [x: string]: any; } & admin.firestore.AddPrefixToKeys<string, any>) | any
  await dbSpotify.get().then((snapshot: FirebaseFirestore.QuerySnapshot) =>{
    snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      let snapshotEpisode = doc.data() as customSpotifyEpisode
      if (snapshotEpisode.id === id) {
        episodeToSent = editedEpisode as customSpotifyEpisode
      }
  })
  }).then(() =>{
    dbSpotify.doc(id).update(episodeToSent).then(() => res.status(200).send('Updated')).catch((error) => {
      res.status(error.statusCode).send(error.body.error.message);
  });
  }).catch((error) =>{res.status(error.statusCode).send(error.body.error.message)})
}


export const getSpotifyEpisodes = (res:Response, id?:string) =>{
  const spotifyEpisodes: customSpotifyEpisode[] = []
  dbSpotify.get()
      .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
          snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
              const episode: customSpotifyEpisode = doc.data() as customSpotifyEpisode
              const foundId = spotifyEpisodes.some(el => el.id === episode.id)
              if (!foundId) {
                spotifyEpisodes.push(episode)
              }
          });
      }).then(() => {
          if(id){
              const episode = spotifyEpisodes.find(el => el.id === id)

              return episode ? res.send(episode).status(200): (res.status(500).send("Cant find Spotify Episodes"))
          }else{
              return spotifyEpisodes ? res.send(spotifyEpisodes).status(200) :  res.send("Cant find Spotify Episode").send(404)
          }
      })
      .catch(error => {
          res.status(500).send({ error });
      });
}
