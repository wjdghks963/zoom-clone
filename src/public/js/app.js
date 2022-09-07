const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const exitBtn = document.getElementById("exit");

room.hidden = true;
exitBtn.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNickNameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom(roomName) {
  welcome.hidden = true;
  room.hidden = false;
  exitBtn.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNickNameSubmit);
}

function handleRoomSubmit(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, () => showRoom(roomName));
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, roomName, count) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} - online(${count})`;
  addMessage(`${user}가 참여했습니다.`);
});

socket.on("bye", (left, count) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room : ${roomName} - online(${count})`;
  addMessage(`${left}가 나갔습니다.`);
});

socket.on("new_message", addMessage);

function goToRoom(roomName) {
  socket.emit("enter_room", roomName, () => showRoom(roomName));
}

socket.on("room_change", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    li.addEventListener("click", () => goToRoom(room));
    roomList.append(li);
  });
});

function exitRoom() {
  return document.location.reload();
}

exitBtn.addEventListener("click", exitRoom);
