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

export const getPosts = async (res: Response<any, Record<string, any>, number>, id?: string) => {
    const blogPosts: post[] = []
    usersRef.get()
        .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                const post: post = doc.data() as post
                const foundId = blogPosts.some(el => el.id === post.id)
                if (!foundId) {
                    blogPosts.push(post)
                }
            });
        }).then(() => {
            return id ? res.send(blogPosts.find(el => el.id === id)): res.send(blogPosts)
        })
        .catch(error => {
            res.status(500).send({ error });
        });
}

export const addPost = async (newPost: post, res: Response<any, Record<string, any>, number>) => {
    let centralaizedID = uuidv4()
    const post = {
        id: centralaizedID,
        title: newPost.title,
        subtitle: newPost.subtitle,
        date: newPost.date,
        content: newPost.content,
        tags: newPost.tags,
        comments: newPost.comments
    }
    await usersRef.doc(centralaizedID).set(post).then(() => res.status(200).send('Sended')).catch(error => {
        res.status(500).send({ error });
    });

}

export const editPost = async (editPost: post,id:string, res: Response<any, Record<string, any>, number>) => {
    let post: post | ({ [x: string]: any; } & admin.firestore.AddPrefixToKeys<string, any>) | any
    await usersRef.get()
        .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                let snapshotPost = doc.data() as post
                if (snapshotPost.id === id ) {
                    post = editPost as post
                }
                else {
                    res.status(500).send('Action impossible')
                }
            });
        }).then(() => {
            console.log(post)
            usersRef.doc(id).update(post).then(() => res.status(200).send('Updated')).catch(() => {
                res.status(500).send("Cant update");
            });
        }).catch(() => {
            res.status(500).send("global error");
        });
}

export const deletePost = async (id:string,res: Response<any, Record<string, any>, number>) => {
   await usersRef.doc(id).delete().then(() => res.status(200).send('Deleted')).catch(() => res.status(500).send('Cannot delete'));
}
