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
const blogPosts: post[] = []

export const getPosts = async (res: Response<any, Record<string, any>, number>) => {
    usersRef.get()
        .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                const post: post = doc.data() as post
                const foundId = blogPosts.some(el => el.id === post.id)
                if (!foundId) {
                    blogPosts.push(post)
                }
            });
            res.send(blogPosts);
        })
        .catch(error => {
            res.status(500).send({ error });
        });
}

export const addPost = async (newPost: post) => {
    const docRef = await usersRef.add({
        id: uuidv4(),
        title: newPost.title,
        subtitle: newPost.subtitle,
        date: newPost.date,
        content: newPost.content,
        src_photo: newPost.src_photo,
        tags: newPost.tags,
        comments: newPost.comments
    });
    return docRef.id;
}
