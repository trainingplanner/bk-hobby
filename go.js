import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getDatabase,
  ref,
  // set,
  get,
  child,
  // serverTimestamp,
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
const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

const dbRef = ref(getDatabase(app));
get(child(dbRef, "bkh/date/"))
  .then((snapshot) => {
    if (snapshot.exists()) {
      Object.keys(snapshot.val()).forEach((date) => {
        snapshot.val()[date].iterator();
      });
    } else {
      console.info("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
