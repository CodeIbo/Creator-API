import admin from 'firebase-admin';
import dotenv from 'dotenv';
import post from 'src/interface/post.model';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express-serve-static-core';


dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIRABASE_PRIVATE_KEY,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: 'https://blog-kk-database.firebaseio.com'
});

const db = admin.firestore();
const usersRef = db.collection('Posts');
export const blogPosts: post[] = []

export const getPosts = async (res: Response<any, Record<string, any>, number>,id?: string) => {
    usersRef.get()
        .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                const post: post = doc.data() as post
                const foundId = blogPosts.some(el => el.id === post.id)
                if (!foundId) {
                    blogPosts.push(post)
                }
            }); 
        }).then(() =>{
            return id ? res.send(blogPosts[parseInt(id,10)- 1]): res.send(blogPosts)})
        .catch(error => {
            res.status(500).send({ error });
        });
}

export const addPost = async (newPost: post,res: Response<any, Record<string, any>, number>) => {
    let centralaizedID =  uuidv4()
    const post = {
        id:  centralaizedID,
        title: newPost.title,
        subtitle: newPost.subtitle,
        date: newPost.date,
        content: newPost.content,
        tags: newPost.tags,
        comments: newPost.comments
    }
    const docRef = await usersRef.doc(centralaizedID).set(post).then(() => res.send('Sended'))
    return blogPosts.push(post)
} 

