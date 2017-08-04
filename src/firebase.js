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


//  This helper is for updating the 'room' key in user object.
export const userRoomUpdating = (uid, roomkey) => {
    const updates = {};
    updates.room = roomkey;
    firebase.database().ref('users/' + uid).update(updates);
  };

// This helper is for updating the 'room' name in Room object.
export const updateRoomName = (roomkey, roomName) => {
  firebase.database().ref('rooms/' + roomkey).update ({ roomName: roomName });
}

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
            firebase.database().ref('rooms/' + roomkey).remove();
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
export const allMemeberReadyUpdating = (roomkey) => {
  firebase.database().ref('rooms/' + roomkey + '/members')
    .once('value')
    .then((snapshot) => {
      const allMembers = snapshot.val();
      for(const key in allMembers) {
        firebase.database().ref('rooms/' + roomkey + '/members/' + key)
          .update({ready: false, score: 0});
      }
      triggerUpdatingGameStart(roomkey)
      resettingWinnerArray(roomkey);
    })
    .then(() => {
      firebase.database().ref('rooms/' + roomkey).once('value')
        .then((snapshot) => {
          window.location.href = '/room/' + snapshot.val().roomName;
        })
    })
}


// For current stage winner info updating
export const stageWinnerUpdater = (roomkey, winner) => {
  firebase.database().ref('rooms/' + roomkey + '/winnerOfStage')
    .once('value')
    .then((snapshot) => {
      const winnerOfStageArr = snapshot.val();
      // need checker by stageNum and idx of array.
      const update = {};

      // Update user score in room
      const membersRef = firebase.database().ref('rooms/' + roomkey + '/members');
      membersRef.once('value', (snapshot) => {
        // store snapshot in membersObj
        const membersObj = snapshot.val();
        let membersArray = [];
        // iterate over object to find the user who answered correctly
        for (const key in membersObj) {
          if(membersObj[key].displayName === winner.displayName) {
            let currentScoreRef = firebase.database().ref('rooms/' + roomkey + '/members/' + key + '/score');
            // get the current user's score in firebase and add 10 points
            currentScoreRef.once('value', (snapshot) => {
              let currentScore = snapshot.val();
              currentScore += 10;
              firebase.database().ref('rooms/' + roomkey + '/members/' + key).update({ score: currentScore });
            })
            break;
          }
        }
      }) // End of update user score

      update.id = winner.id;
      update.name = winner.displayName;
      update.stage = winnerOfStageArr.length;
      winnerOfStageArr.push(update)
      const stageNum = 6;
      if(winnerOfStageArr.length < stageNum + 1) {
        firebase.database().ref('rooms/' + roomkey)
          .update({ 'winnerOfStage': winnerOfStageArr });
        firebase.database().ref('rooms/' + roomkey)
          .update({ 'stages': winnerOfStageArr.length });
      } else {
        gameOverUpdator(roomkey, true);
      }
    })
}
const resettingWinnerArray = (roomKey) => {
  console.log('entered!')
  firebase.database().ref('rooms/' + roomKey + '/winnerOfStage')
    .set( {'0': 'init'} )
}

// Game over status updator
export const gameOverUpdator = (roomkey, data) => {
  firebase.database().ref('/rooms/' + roomkey).update({
    gameover: data,
    stage: 0
  });
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
      // Check all member's ready status
      for (const key in memberList) {
        if (!memberList[key].ready) {
          allReadyChecker = false;
          updatingGameStart(roomkey, false);
          gameOverUpdator(roomkey, false)
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
  if(data) {
    firebase.database().ref('rooms/' + roomkey).update({
      gameStart: data,
      stages: 1,
      currentTurn: 0,
      startTimer: true
    });
  }
};


// currentWord Generation logic
export const currentWordGenerating = (roomKey, uid, topic, host) => {
  firebase.database().ref('/rooms/' + roomKey + '/members')
    .once('value')
    .then((snapshot) => {
      const memberList = snapshot.val();
      if (!host) {
        for (const key in memberList) {
          if (memberList[key].id === uid) {
            currentWordGenerationRequest(roomKey, topic)
          }
        };
      } else {
        for (const key in memberList) {
          if (key === '1') {
            currentWordGenerationRequest(roomKey, topic)
          }
        };
      }
    }
  );
};

// currentWord Generation logic
const currentWordGenerationRequest = (roomKey, topic) => {
  firebase.database().ref('/TOPICS/' + topic)
    .once('value')
    .then((snapshot) => {
      const topicArr = snapshot.val();
      const randomNum = getRandomIntInRange(1, topicArr.length - 1)
      const roomInfo = firebase.database().ref('rooms/' + roomKey);
      if (roomInfo && topicArr[randomNum]) {
        roomInfo.update({ 'currentWord': topicArr[randomNum] });
      }
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
    let nextTurn;
    if(memberCount > 1) {
      nextTurn = currentTurn < memberCount - 1 ? currentTurn + 1 : 0;
    } else {
      nextTurn = 0;
    }

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

export const undoRecent = (roomKey) => {
  firebase.database().ref('rooms/' + roomKey + '/stroke')
    .once('value', (snapshot) => {
      const strokes = snapshot.val();
      let lastStart = null;
      let checker = false;
      // find last 'start'
      for (const key in strokes) {
        if (strokes[key].mv === 'start') lastStart = key;
      }
      // delete from the 'start'
      for (const key in strokes) {
        if (key === lastStart) checker = true;
        if (checker) {
          firebase.database().ref('rooms/' + roomKey + '/stroke/' + key)
            .set({})
        }
      }
    }
  );
}


/**
 * EventListener
 */


export default firebase;
