function snapshotToArray(snapshot) {
    let arr = [];
    snapshot.forEach(function(child) {
        const item = child.val();
        item.key = child.key;
        arr.push(item);
    });
    return arr;
};

// setup firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getDatabase,
  ref,
  // set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyDSo8kGYkbNnawCC8ZOaj6ZOqbLZXcksIQ",
  authDomain: "trainingplanner-a7f76.firebaseapp.com",
  databaseURL:
    "https://trainingplanner-a7f76-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trainingplanner-a7f76",
  storageBucket: "trainingplanner-a7f76.appspot.com",
  messagingSenderId: "636511129226",
  appId: "1:636511129226:web:51fc3df29c0425ed3fe773",
};

// load database
const app = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(app));
get(child(dbRef, "bkh/"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      const dbArr = snapshotToArray(snapshot);
      const dates = dbArr[0];
      const players = dbArr[1];
      console.info(dates);
      console.info(players);
    } else {
      console.info("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
