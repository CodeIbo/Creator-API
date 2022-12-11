import express from 'express'
import './database/firebaseConfig';
import cors from 'cors';
import {addPost,getPosts} from './database/firebaseConfig';





const app = express();

app.use(express.json())
app.use(cors())

app.listen(8888, () =>{
    console.log("Aplikacja wystartowała na porcie 8888");
})

app.get('/', (req,res) =>{
    res.send("Server Work")
})

app.get('/posts', (req,res)=>{
    getPosts(res)
    
})

app.get('/post/:id',(req,res)=>{
    let index = Number(req.params.id) -1
    res.send(getPosts(res)[index])
})


app.post('add/post',(req,res) =>{
    
})

app.post('edit/post/:id',(req,res) =>{
    
})

app.delete('delete/post/:id',(req,res) =>{

})