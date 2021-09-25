import * as firebase from "firebase/app";
import { getDatabase, ref, onValue} from "firebase/database";
import { getFirestore, doc, getDocs, onSnapshot, collection, setDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = { // 우리 프로젝트 firebase 설정
    apiKey: "AIzaSyDMy6DVimbJQgQGo1PU0IXiPeq3K0yzF5I",
    authDomain: "threeamericano.firebaseapp.com",
    databaseURL: "https://threeamericano-default-rtdb.firebaseio.com",
    projectId: "threeamericano",
    storageBucket: "threeamericano.appspot.com",
    messagingSenderId: "475814972535",
    appId: "1:475814972535:web:8be8e4e4b6cf92f2e90a72",
    measurementId: "G-WEWQJ2NQSB"
}
firebase.initializeApp(firebaseConfig); 

const db = getDatabase(); // realtime DB
const storeDB = getFirestore(); // store DB

export default firebase;
export {db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc, deleteDoc};