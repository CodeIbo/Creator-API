import express from 'express'
import './database/firebaseConfig';
import cors from 'cors';
import { addPost, deletePost, editPost, getPosts, registerUser, generateToken } from './database/firebaseConfig';
import dotenv from 'dotenv';




const app = express();

app.use(express.json())
app.use(cors())
dotenv.config();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Aplikacja wystartowała na porcie ${process.env.PORT}`);
})

app.get('/', (req, res) => {
    res.send("Server Work")
})

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

app.post('/register', (req,res) =>{
    registerUser(res,req.body)
})

app.post('/generate-token', (req,res) =>{
    generateToken(res,req.body.uid)
})