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


/**
 * helper Functions
 */


//  This helper is for updating the 'room' name in user object.
export const userRoomUpdating = (uid, roomkey) => {
    const updates = {};
    updates.room = roomkey;
    firebase.database().ref('users/' + uid).update(updates);
  };


// This helper is for updating/removing the members info.
export const roomMemberUpdating = (roomkey, memberKey, updateObj, remove, path) => {
    const updates = updateObj;

    if(remove) {
    // Removing the member
    firebase.database().ref('rooms/' + roomkey + '/members/' + memberKey)
      .set(updates);
    // Reducing Number of memberCount
    firebase.database().ref('rooms/' + roomkey + '/memberCount')
      .once('value')
      .then((snapshot) => {
        let memberCount = snapshot.val();
        // If memberCount is 0 after user leaves, delete the whole room object from firebase
        if (memberCount === 1) {
          firebase.database().ref('rooms/' + roomkey).remove()
        } else {
        // If memberCount is more than 0 after leaves, just decrement memberCount by 1
          firebase.database().ref('rooms/' + roomkey)
            .update({ 'memberCount': memberCount - 1 })
        }
      })
      .then(() => {
        window.location.href = path;
      });
    }
  };

// For ready status updating.
export const readyUpdating = (roomkey, memeberKey, data) => {
  firebase.database().ref('rooms/' + roomkey + '/members/' + memeberKey)
    .update({ 'ready': data });
}

// For ready status updating.
export const updatingGameStart = (roomkey, data) => {
  firebase.database().ref('rooms/' + roomkey).update({
    'gameStart': data,
    'stages': 1
  });
}

/**
 * EventListener
 */


export default firebase;
