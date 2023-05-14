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

function submit(e, key) {
  if (key && e.key != "Enter") {
    console.log("key");
    return;
  } else console.log("hi");
}

function checkEnter(event) {
  submit(event, true);
}

function validate() {
  if (loginInput.validity.valid && loginListen === false) {
    loginBtn.style.cursor = "pointer";
    loginBtn.style.color = "var(--colorGreen)";
    loginBtn.addEventListener("click", submit);
    loginInput.addEventListener("keydown", checkEnter);
    loginListen = true;
  } else if (!loginInput.validity.valid && loginListen === true) {
    loginBtn.style.cursor = "default";
    loginBtn.style.color = "var(--colorFg)";
    loginBtn.removeEventListener("click", submit);
    loginInput.removeEventListener("keydown", checkEnter);
    loginListen = false;
  }
}

function help() {
  const intro = document.getElementById("intro");
  const help = document.getElementById("help");
  if (help.classList.contains("hidden")) {
    intro.classList.add("hidden");
    help.classList.remove("hidden");
    helpToggle.classList.add("help");
    helpToggle.title = "Info";
  } else {
    help.classList.add("hidden");
    intro.classList.remove("hidden");
    helpToggle.classList.remove("help");
    helpToggle.title = "Hilfe";
  }
}

const helpToggle = document.getElementById("helpBtn");
helpToggle.addEventListener("click", help);
const loginInput = document.getElementById("player-choice");
const loginBtn = document.getElementById("loginBtn");
let loginListen = false;
loginInput.addEventListener("input", validate);
