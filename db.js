// Copyright (c) 2023 luetage <https://github.com/luetage>

// This file is part of Trainingplanner.

// Trainingplanner is free software: you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation, either version 3 of the License, or (at your option) any
// later version.

// Trainingplanner is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
// or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.

// You should have received a copy of the GNU General Public License along with
// Trainingplanner. If not, see <https://www.gnu.org/licenses/>.

function snapshotToArray(snapshot) {
  let arr = [];
  snapshot.forEach(function (child) {
    const item = child.val();
    arr.push(item);
  });
  return arr;
}

// setup firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
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
      Object.keys(dates).forEach((date) => {
        console.info(date);
      });
      console.info(players);
    } else {
      console.info("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
  });
