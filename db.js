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

// ————————  ⁂   ————————

"use strict";

// write/update event database
function calSave() {
  if ( _username === "admin" && _dateInput.value != "") {
    const epoch = Date.parse(new Date(_dateInput.value).toISOString());
    update(ref(_db, `/dates/${epoch}`), {
      bk2: false,
      cancel: false,
      info: "",
      players: "",
    })
      .then(() => {
        _calBtn.style = "";
        _calBtn.title = "";
        _calBtn.removeEventListener("click", calSave);
        _dateInput.value = "";
        _dateListen = false;
      })
      .catch((error) => console.error(error));
  }
}

// check validity of event input and handle listeners
function dateInputCheck() {
  if (_dateInput.validity.valid && _dateListen === false) {
    _calBtn.style.cursor = "pointer";
    _calBtn.style.color = "var(--colorGreen)";
    _calBtn.title = "Änderungen speichern";
    _calBtn.addEventListener("click", calSave);
    _dateListen = true;
  } else if (!_dateInput.validity.valid && _dateListen === true) {
    _calBtn.style = "";
    _calBtn.title = "";
    _calBtn.removeEventListener("click", calSave);
    _dateListen = false;
  }
}

// load and handle administrative features
function admin() {
  _dateInput.classList.remove("hidden");
  _dateInput.addEventListener("input", dateInputCheck);
}

// logout and reset
function logoutPlayer() {
  if (_playerName === "admin") {
    _dateInput.classList.add("hidden");
    _dateInput.value = "";
    _dateInput.removeEventListener("input", dateInputCheck);
  }
  _playerName = "";
  const loginTitle = document.querySelector("#login span.title");
  loginTitle.innerHTML = "Anmeldung";
  loginTitle.style = "";
  _loginBtn.removeEventListener("click", logoutPlayer);
  _loginBtn.style = "";
  _loginBtn.title = "";
  _loginInput.classList.remove("hidden");
  _calBtn.style = "";
  _calBtn.title = "";
  _calBtn.removeEventListener("click", calSave);
}

// login existing player
function loginPlayer(username) {
  if (username === "enable.admin") {
    username = "admin";
    admin();
  }
  _playerName = username;
  const loginTitle = document.querySelector("#login span.title");
  loginTitle.innerHTML = _playerName;
  loginTitle.style.color = "var(--colorBlue)";
  _loginBtn.removeEventListener("click", submit);
  _loginBtn.addEventListener("click", logoutPlayer);
  _loginBtn.style.color = "var(--colorMagenta)";
  _loginBtn.title = "Abmelden";
  _loginInput.classList.remove("valid");
  _loginInput.classList.add("hidden");
  _loginInput.value = "";
  _loginInput.removeEventListener("keydown", checkEnter);
  _loginListen = false;
}

// create a new player
function newPlayer(username) {
  // get key for new player
  const newPlayerKey = push(child(ref(_db), "players")).key;
  // update database and playerlist
  update(ref(_db, "/players/" + newPlayerKey), {
    name: username,
    bk2: false,
  })
    .then(() => {
      _playerList.unshift(username);
      playerlist("update");
      loginPlayer(username);
    })
    .catch((error) => console.error(error));
}

function submit(e, key) {
  if (key && e.key != "Enter") {
    return;
  } else {
    const input = _loginInput.value;
    if (input.startsWith("neu ")) newPlayer(input.substring(4));
    else loginPlayer(input);
  }
}

// handle event listener for keyboard enter"
function checkEnter(event) {
  submit(event, true);
}

// validate the login input
function validate() {
  const input = _loginInput.value;
  let check = true;
  if (input === "enable.admin") console.info("admin validated");
  else if (_loginInput.value.startsWith("neu ")) {
    const inputlow = input.substring(4).toLowerCase();
    for (let i = 0; i < _playerList.length; i++) {
      if (_playerList[i].toLowerCase() === inputlow) {
        check = false;
        break;
      }
    }
    if (inputlow === "enable.admin" || inputlow === "admin") check = false;
  } else {
    check = false;
    for (let i = 0; i < _playerList.length; i++) {
      if (_playerList[i] === input) {
        check = true;
        break;
      }
    }
  }
  if (_loginInput.validity.valid && _loginListen === false && check === true) {
    _loginBtn.style.cursor = "pointer";
    _loginBtn.style.color = "var(--colorGreen)";
    _loginBtn.title = "Anmelden";
    _loginBtn.addEventListener("click", submit);
    _loginInput.classList.add("valid");
    _loginInput.addEventListener("keydown", checkEnter);
    _loginListen = true;
  } else if (
    (!_loginInput.validity.valid && _loginListen === true) ||
    (_loginListen === true && check === false)
  ) {
    _loginBtn.style = "";
    _loginBtn.title = "";
    _loginBtn.removeEventListener("click", submit);
    _loginInput.classList.remove("valid");
    _loginInput.removeEventListener("keydown", checkEnter);
    _loginListen = false;
  }
}

// toggle info/help
function help() {
  const intro = document.getElementById("intro");
  const help = document.getElementById("help");
  if (help.classList.contains("hidden")) {
    intro.classList.add("hidden");
    help.classList.remove("hidden");
    _helpToggle.classList.add("help");
    _helpToggle.title = "Info";
  } else {
    help.classList.add("hidden");
    intro.classList.remove("hidden");
    _helpToggle.classList.remove("help");
    _helpToggle.title = "Hilfe";
  }
}

// toggle additional event information and settings
function toggleEventInfo() {
  const info = this.parentNode.nextElementSibling;
  if (info.classList.contains("hidden")) info.classList.remove("hidden");
  else info.classList.add("hidden");
}

// define the login datalist entries
function playerlist(players) {
  if (players !== "update") {
    _playerList = players.map(({ name }) => name).reverse();
  }
  const list = document.getElementById("players");
  list.innerHTML = `<option value="neu "></option>`;
  _playerList.forEach((player) => {
    const option = document.createElement("option");
    option.value = player;
    list.appendChild(option);
  });
}

// convert epoch time to local time
function isoToLocal(epoch) {
  const date = new Date(Number(epoch));
  let local = date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
  local = local.slice(0, 3) + local.slice(5);
  const long = date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
  return { local: local, long: long };
}

// add registered players to events, calculate the count and color code it
function loadPlayers() {
  _dates.forEach((date) => {
    let bc6 = 0;
    let bc8 = 0;
    let bc10 = 0;
    const clean = document.querySelector(`#d${date.key} .clean`);
    if (clean) clean.remove();
    const target = document.querySelector(`#d${date.key} .event-players`);
    const list = document.createElement("div");
    list.style.padding = "0 0.5em";
    list.classList.add("clean");
    if (!Object.entries(date.players).length > 0) {
      const empty = document.createElement("span");
      empty.innerHTML = String.fromCodePoint(0x1f47f);
      list.appendChild(empty);
    } else {
      for (let [name, bc] of Object.entries(date.players)) {
        if (bc === "bc6") bc6++;
        else if (bc === "bc8") {
          bc8++;
          name = name + "(8)";
        } else if (bc === "bc10") {
          bc10++;
          name = name + "(10)";
        }
        const entry = document.createElement("span");
        entry.innerHTML = `${name} `;
        entry.classList.add(bc);
        list.appendChild(entry);
      }
    }
    target.appendChild(list);
    let maincolor = "fail";
    if (bc6 >= 6) maincolor = "s6";
    if (bc6 + bc8 >= 8) maincolor = "s8";
    if (bc6 + bc8 + bc10 >= 10) maincolor = "s10";
    document.getElementById(`d${date.key}`).classList.add(maincolor);
  });
}

// load the events
function datelist() {
  const eventcontainer = document.getElementById("events");
  _dates.forEach((date) => {
    const time = isoToLocal(date.key);
    const event = document.createElement("div");
    event.id = "d" + date.key;
    event.classList.add("event");
    if (date.bk2 === true) event.classList.add("hidden");
    event.innerHTML = `
      <div class="event-display">
        <label>
          <input type="checkbox"/>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="" />
          </svg>
        </label>
        <span class="player-count">${time.local}<span> [ 0 ]</span></span>
        <button class="drop">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="" />
          </svg>
        </button>
      </div>
      <div class="event-info-container text hidden">
        <div>
          <div class="head">${time.long}</div>
          <p class="event-info" contenteditable="false"></p>
        </div>
        <div class="event-options">
          <span class="head">Optionen</span><br />
          <div class="player-options">
            <label for="radio6-${date.key}">
              <input type="radio" name="option-${date.key}" id="radio6-${date.key}" value="6">
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path d="" />
              </svg>
              <span>6</span>
            </label>
            <label for="radio8-${date.key}">
              <input type="radio" name="option-${date.key}" id="radio8-${date.key}" value="8">
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path d="" />
              </svg>
              <span>8</span>
            </label>
            <label for="radio10-${date.key}">
              <input type="radio" name="option-${date.key}" id="radio10-${date.key}" value="10">
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path d="" />
              </svg>
              <span>10</span>
            </label>
          </div>
          <div class="admin-options">
            <label class="checkbk2">
              <input type="checkbox"/>
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path d="" />
              </svg>
              <span>BK2</span>
            </label>
            <label class="checkcancel">
              <input type="checkbox"/>
              <svg viewBox="0 0 18 18" width="18" height="18">
                <path d="" />
              </svg>
              <span>Absage</span>
            </label>
          </div>
        </div>
        <div class="event-players">
          <span class="head">Spieler</span>
        </div>
      </div>
    `;
    eventcontainer.appendChild(event);
  });
  const drop = document.querySelectorAll(".drop");
  for (let i = 0; i < drop.length; i++) {
    drop[i].addEventListener("click", toggleEventInfo);
  }
  loadPlayers();
}

// create an array to work with
function snapshotToArray(snapshot) {
  let arr = [];
  snapshot.forEach(function (child) {
    const item = child.val();
    item.key = child.key;
    arr.push(item);
  });
  return arr;
}

// load database
function setup() {
  // load player data
  get(child(ref(getDatabase(_app)), "players"))
    .then((snap) => {
      if (snap.exists()) {
        const players = snapshotToArray(snap);
        console.info(players);
        playerlist(players);
      } else {
        console.info("No data available");
      }
    })
    .catch((error) => console.error(error));
  // load calendar
  get(child(ref(getDatabase(_app)), "dates"))
    .then((snap) => {
      if (snap.exists()) {
        _dates = snapshotToArray(snap);
        console.info(_dates);
        datelist();
      } else {
        console.info("No data available");
      }
    })
    .catch((error) => console.error(error));
}

// check connection and init
function connection() {
  const connection = document.getElementById("connection");
  let go = true;
  onValue(ref(_db, ".info/connected"), (snap) => {
    if (snap.val() === true) {
      connection.style.color = "var(--colorGreen)";
      connection.innerHTML = "Datenbank verbunden";
      if (go === true) {
        setup();
        go = false;
      }
    } else {
      connection.style.color = "var(--colorMagenta)";
      connection.innerHTML = "Datenbank nicht verbunden";
    }
  });
}

// setup firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  push,
  update,
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
const _app = initializeApp(firebaseConfig);
const _db = getDatabase();
let _playerList = {};
let _playerName = "";
let _dates = {};

const _helpToggle = document.getElementById("helpBtn");
_helpToggle.addEventListener("click", help);

const _loginBtn = document.getElementById("loginBtn");
const _loginInput = document.getElementById("login-input");
let _loginListen = false;
_loginInput.addEventListener("input", validate);

const _calBtn = document.getElementById("calBtn");
const _dateInput = document.getElementById("date-input");
let _dateListen = false;

connection();
