import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

let firebaseConfig = {
    apiKey: "AIzaSyDhuqD7POAQc5J7zgOchsEJNNqXXbf7GBM",
    authDomain: "sistemadev-17e61.firebaseapp.com",
    projectId: "sistemadev-17e61",
    storageBucket: "sistemadev-17e61.appspot.com",
    messagingSenderId: "842230729780",
    appId: "1:842230729780:web:e5983dcc2d123de9198e61",
    measurementId: "G-NN55PCY027"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
};

export default firebase;