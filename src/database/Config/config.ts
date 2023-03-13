import Cryptr from "cryptr"
import { Response,Request } from 'express-serve-static-core';
import { dynamicObject } from "src/interface/dynamicObject.model";
import { db } from "../firebaseConfig";
import {clone,update} from 'lodash'


const cryptr = new Cryptr('secret');
export const configThirdPartyValues = {
    spotify:{
        clientId:'',
        clientSecret:''
    },
}

const configCollection = db.collection('configValues')

export const getConfigFromPanel = (res: Response<any, Record<string, any>, number>,req:Request<any, Record<string, any>, number>) =>{
    configCollection.get().then((snapshot: FirebaseFirestore.QuerySnapshot) =>{
        snapshot.docs.forEach((doc:FirebaseFirestore.QueryDocumentSnapshot) =>{
            let id = doc.id as string
            let data = doc.data()
            if(configThirdPartyValues.hasOwnProperty(id)){
                for (let key in data){
                    if(configThirdPartyValues[id].hasOwnProperty(key)){
                        update(configThirdPartyValues[id],[key],() =>{
                            return cryptr.decrypt(data[key])
                        })
                    }
                }
            }
            res.send(configThirdPartyValues)
            
        })
    }).catch((error) => res.status(500))
}

export const postConfigToDB = (res: Response<any, Record<string, any>, number>,docKey:string,object:dynamicObject) =>{
    const checkedObject:dynamicObject = clone(configThirdPartyValues[docKey])
    for(let key in object){
        if(configThirdPartyValues[docKey].hasOwnProperty(key)){
            update(checkedObject,key,() => {return cryptr.encrypt(object[key])})
            
        }
    }
    configCollection.doc(docKey).update(checkedObject).then(()=>{
        res.status(200).send('updated')
    }).catch(() => res.status(500).send("Cant update"))
}
