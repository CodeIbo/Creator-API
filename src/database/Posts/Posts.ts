import { db } from "../firebaseConfig";
import { Response } from 'express-serve-static-core';
import post from 'src/interface/post.model';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';


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
            if(id){
                const post = blogPosts.find(el => el.id === id)

                return post ? res.send(post).status(200): (res.status(500).send("CANT FIND POST"))
            }else{
                return blogPosts ? res.send(blogPosts).status(200) :  res.send("Cant find Blog Posts").send(404)
            }
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
        url: newPost.url,
        date: newPost.date,
        content: newPost.content,
        tags: newPost.tags,
        comments: newPost.comments
    }
    usersRef.doc(centralaizedID).set(post).then(() => res.status(200).send('Sended')).catch(error => {
        res.status(500).send({ error });
    });

}

export const editPost = async (editPost: post, id: string, res: Response<any, Record<string, any>, number>) => {
    let post: post | ({ [x: string]: any; } & admin.firestore.AddPrefixToKeys<string, any>) | any
    await usersRef.get()
        .then((snapshot: FirebaseFirestore.QuerySnapshot) => {
            snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
                let snapshotPost = doc.data() as post
                if (snapshotPost.id === id) {
                    post = editPost as post
                }
            });
        }).then(() => {
            usersRef.doc(id).update(post).then(() => res.status(200).send('Updated')).catch(() => {
                res.status(500).send("Cant update");
            });
        }).catch(() => {
            res.status(500).send("global error");
        });
}

export const deletePost = async (id: string, res: Response<any, Record<string, any>, number>) => {
    await usersRef.doc(id).delete().then(() => res.status(200).send('Deleted')).catch(() => res.status(500).send('Cannot delete'));
}
