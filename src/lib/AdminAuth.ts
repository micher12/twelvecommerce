import admin from "firebase-admin";

if(!admin.apps.length){

    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG as string);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: JSON.parse(process.env.FIREBASE_CONFIG as string).databaseURL as string,
    });
}

export default admin;
