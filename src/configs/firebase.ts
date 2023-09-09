import * as firebase from "firebase/app"
import { initializeApp } from "firebase/app"
import {
    getDatabase,
    ref as firebaseRef,
    set as firebaseSet,
    child,
    get,
    onValue,
    remove,
    push,
} from "firebase/database"

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth"
import { API_URL } from "~/configs/strings"

//replace your config here
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: API_URL,
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
}

const app = initializeApp(firebaseConfig)
const database = getDatabase()
const auth = getAuth()

export {
    firebase,
    app,
    database,
    auth,
    onAuthStateChanged,
    firebaseRef,
    firebaseSet,
    get,
    child,
    signInWithEmailAndPassword,
    onValue,
    remove,
    push,
    createUserWithEmailAndPassword,
    updateProfile
}