import Cryptr from "cryptr"
import { Response, Request } from 'express-serve-static-core';
import { dynamicObject } from "../../interface/dynamicObject.model";
import { db } from "../firebaseConfig";
import { clone, update } from 'lodash'
import { configModel } from "../../interface/config.model";


export const cryptr = new Cryptr('secret');
export const configModelThirdParty = {
    spotify: {
        clientId: '',
        clientSecret:'',
        redirectUri:'',
        episodeId: ''
    },
}


const configCollection = db.collection('configValues');

export const getConfigData = async(model:configModel,cryptr:Cryptr): Promise<{data:configModel,status:number}> => {
    const configThirdPartyValues: configModel = model
    const configCollection = db.collection('configValues')

    try {
        const snapshot = await configCollection.get();

        snapshot.docs.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
            const id = doc.id as string;
            const data = doc.data();

            if (configThirdPartyValues.hasOwnProperty(id)) {
                for (const key in data) {
                    if (configThirdPartyValues[id].hasOwnProperty(key)) {
                        update(configThirdPartyValues[id], [key], () => {
                            return data[key].length > 0 ? cryptr.decrypt(data[key]): data[key]
                        });
                    }
                }
            }
        });

        return {data:configThirdPartyValues,status:200};
    } catch (error) {
        return {data : error, status:500}
    }
}


export const getConfigFromPanel = (res: Response<any, Record<string, any>, number>, req: Request<any, Record<string, any>, number>) => {
    getConfigData(configModelThirdParty,cryptr).then((data) => {
        res.status(data.status).send(data.data)
    })
}

export const postConfigToDB = (res: Response<any, Record<string, any>, number>, docKey: string, object: dynamicObject) => {
    const checkedObject: dynamicObject = clone(configModelThirdParty[docKey])
    for (let key in object) {
        if (configModelThirdParty[docKey].hasOwnProperty(key)) {
            update(checkedObject, key, () => { return cryptr.encrypt(object[key]) })

        }
    }
    configCollection.doc(docKey).update(checkedObject).then(() => {
        res.status(200).send('updated')
    }).catch(() => res.status(500).send("Cant update"))
}
