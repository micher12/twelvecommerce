"use server";

import { FirebaseOptions } from "firebase/app";

export async function getFirebaseConfig(){
    const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG as string) as FirebaseOptions;

    return { firebaseConfig }
}