import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyA81aGjMTK3OUT0fGfyvDoJR6by9CbY4Zs",
  authDomain: "arenatv-31f44.firebaseapp.com",
  databaseURL: "https://arenatv-31f44.firebaseio.com",
  projectId: "arenatv-31f44",
  storageBucket: "",
  messagingSenderId: "838269703483"
};
firebase.initializeApp(config);
const database = firebase.database;
export default database;
