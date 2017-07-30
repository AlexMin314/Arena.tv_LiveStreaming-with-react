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
export const readyUpdating = (roomkey, memberKey, data) => {
  firebase.database().ref('rooms/' + roomkey + '/members/' + memberKey)
    .update({ 'ready': data });
}


// For current stage winner info updating
export const stageWinnerUpdater = (roomkey, winner) => {
  firebase.database().ref('rooms/' + roomkey + '/winnerOfStage')
    .once('value')
    .then((snapshot) => {
      const winnerOfStageArr = snapshot.val();
      // need checker by stageNum and idx of array.
      const update = {};
      update.id = winner.id;
      update.name = winner.displayName;
      update.stage = winnerOfStageArr.length;
      winnerOfStageArr.push(update)
      if(winnerOfStageArr.length < 13) {
        firebase.database().ref('rooms/' + roomkey)
          .update({ 'winnerOfStage': winnerOfStageArr });
        firebase.database().ref('rooms/' + roomkey)
          .update({ 'stages': winnerOfStageArr.length });
      } else {
        console.log('game over status!')
      }
    })

}

// For ready status checking to start game.
export const triggerUpdatingGameStart = (roomkey) => {
  firebase.database().ref('/rooms/' + roomkey + '/members')
    .once('value')
    .then((snapshot) => {
      const memberList = snapshot.val();
      let allReadyChecker = true;
      // If only one user exist, the game will not start.
      if (Object.keys(memberList).length === 1) allReadyChecker = false;
      // Check all memeber's ready status
      for (const key in memberList) {
        if (!memberList[key].ready) {
          allReadyChecker = false;
          break;
        }
      }
      // if all ready,
      if(allReadyChecker) {
        updatingGameStart(roomkey, true);
      }
    })
};

// For ready status updating.
const updatingGameStart = (roomkey, data) => {
  firebase.database().ref('rooms/' + roomkey).update({
    'gameStart': data,
    'stages': 1
  });
};


// currentWord Generation logic
export const currentWordGenerating = (roomKey, memberKey, topic) => {
  firebase.database().ref('/rooms/' + roomKey + '/members')
    .once('value')
    .then((snapshot) => {
      const memberList = snapshot.val();
      Object.keys(memberList).forEach((e, idx) => {
        if (e === memberKey) {
          currentWordGenerationRequest(roomKey, topic)
        }
      });
    });
};

// currentWord Generation logic
const currentWordGenerationRequest = (roomKey, topic) => {
  firebase.database().ref('/TOPICS/' + topic)
    .once('value')
    .then((snapshot) => {
      const topicArr = snapshot.val();
      topicArr.shift()

      const randomNum = getRandomIntInRange(0, topicArr.length - 1)
      firebase.database().ref('rooms/' + roomKey).update({
        'currentWord': topicArr[randomNum]
      });
    });
}

// helper for random number
const getRandomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Turn Changer logic
export const turnChangingLogic = (roomkey) => {
  const roomRef = firebase.database().ref('rooms/' + roomkey);
  roomRef.once('value', (snapshot) => {
      const memberCount = snapshot.val().memberCount;
      let currentTurn = snapshot.val().currentTurn;
      const nextTurn = currentTurn < memberCount - 1 ? currentTurn + 1 : 0;
      firebase.database().ref('rooms/' + roomkey).update({
        'currentTurn': nextTurn
      });
    })
}


// Stroke Updator
export const strokeUpdator = (roomKey, mouseXY) => {
  firebase.database().ref('rooms/' + roomKey + '/stroke').push(mouseXY);
}

export const strokeClear = (roomKey) => {
  firebase.database().ref('rooms/' + roomKey).update({stroke: null});
}


/**
 * EventListener
 */


export default firebase;
