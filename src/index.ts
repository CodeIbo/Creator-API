import express from 'express'
import './database/firebaseConfig';
import cors from 'cors';
import { addPost,deletePost,editPost,getPosts } from './database/Posts/Posts';
import { registerUser,generateToken } from './database/Auth/auth';
import dotenv from 'dotenv';
import { getConfigFromPanel, postConfigToDB } from './database/Config/config';
import {  updateDataFromApiSpotify, spotifyApi, spotifyAuth, editSpotifyEpisode, getSpotifyEpisodes } from './database/Spotify/spotify-config';



const app = express();

app.use(express.json())
app.use(cors())
dotenv.config();
// app.use(session({
//     secret: process.env.SESSIONCODE,
//     resave: false,
//     saveUninitialized: true
// }));

app.listen(process.env.PORT_API || 6666, () => {
    console.log(`Aplikacja wystartowała na porcie ${process.env.PORT_API ? process.env.PORT_API : '6666' }`);
    
})

app.get('/', (req, res) => {
    res.send("Server Work")
})

// spotify


app.get('/spotify/callback',async (req,res) =>{
    const scopes = [];    
    res.redirect((await spotifyApi).createAuthorizeURL(scopes,''));
})


app.get('/spotify/login',(req:any,res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
    spotifyAuth(error,code,state,res);
})

app.get('/spotify/podcast/episodes',(req,res) =>{
    getSpotifyEpisodes(res)
})

app.get('/spotify/podcast/episodes/:id',(req,res) =>{
    getSpotifyEpisodes(res,req.params.id)
})

app.post('/spotify/podcast/refresh/:id',(req,res) =>{
    let id = req.params.id
    updateDataFromApiSpotify(id,res)
})

app.post('/spotify/podcast/edit/:id', (req, res) => {
    editSpotifyEpisode(req.body,req.params.id,res)
})

//blog

app.get('/posts', (req, res) => {
    getPosts(res)

})

app.get('/post/:id', (req, res) => {
    getPosts(res, req.params.id)
})


app.post('/add/post', (req, res) => {
    addPost(req.body, res)
})

app.post('/edit/post/:id', (req, res) => {
    editPost(req.body,req.params.id,res)
})

app.delete('/delete/post/:id', (req, res) => {
    deletePost(req.params.id,res);
})

//guards

app.post('/register', (req,res) =>{
    registerUser(res,req.body)
})

app.post('/generate-token', (req,res) =>{
    generateToken(res,req.body.uid)
})

//config 

app.get('/config/third-parties', (req,res) =>{
    getConfigFromPanel(res,req)
})
app.post('/config/set-third-parties', (req,res)=>{
    postConfigToDB(res,req.headers['name-config'] as string,req.body)
})
