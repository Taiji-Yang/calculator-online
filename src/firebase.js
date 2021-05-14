import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBRlrxpnXwk92hdxGCLGmsdh9x15TG_oYE",
    authDomain: "online-calculator-90253.firebaseapp.com",
    databaseURL: "https://online-calculator-90253-default-rtdb.firebaseio.com",
    projectId: "online-calculator-90253",
    storageBucket: "online-calculator-90253.appspot.com",
    messagingSenderId: "5283702735",
    appId: "1:5283702735:web:d0f55f5d727e66cbf1d4ba"
};

firebase.initializeApp(firebaseConfig);

export default firebase;