import { auth, db } from "../firebaseConfig"
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express-serve-static-core';
import user from "src/interface/user.model";

export const generateToken = async (res: Response<any, Record<string, any>, number>, uid: string) => {
    auth.createCustomToken(uid).then((customToken) =>{
        res.status(200).send({token:customToken})
    })
}

export const registerUser = async (res: Response<any, Record<string, any>, number>, user: user) => {
    let userId = uuidv4()
    auth.createUser({
        uid: userId,
        email: user.email, 
        password: user.password 
        }).then(() =>{db.collection('Users').doc(userId).set({
            uid: userId,
            email: user.email,
            name:user.name,
            role: user.role
        })})
        .then(() => res.status(200).send('User successfully created')).catch((error) => { res.status(500).send(`User cant be created: ${error}`) })
} 
