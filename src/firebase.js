import * as firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyA81aGjMTK3OUT0fGfyvDoJR6by9CbY4Zs",
  authDomain: "arenatv-31f44.firebaseapp.com",
  databaseURL: "https://arenatv-31f44.firebaseio.com",
  projectId: "arenatv-31f44",
  storageBucket: "arenatv-31f44.appspot.com",
  messagingSenderId: "838269703483"
};
firebase.initializeApp(config);

export const firebaseDB = firebase.database();

// This helper is for updating the 'room' name in user object.
export const userRoomUpdating = (uid, roomkey) => {
    const updates = {};
    updates.room = roomkey;

    firebase.database().ref('users/' + uid).update(updates);
  };



export default firebase;
