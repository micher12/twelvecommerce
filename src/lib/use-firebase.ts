"use server";

import { FirebaseApp, FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

export async function getFirebase(){

    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string) as FirebaseOptions;

    let app: FirebaseApp;

    try {
        app = getApp();
    } catch  {
        app = initializeApp(firebaseConfig);
    }

    const auth = getAuth(app);
    const storage = getStorage(app);


    return {app, auth, storage}
}