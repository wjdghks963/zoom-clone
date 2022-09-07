import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on 3000`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function publicRooms() {
  const { rooms, sids } = wsServer.sockets.adapter;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "익명";
  socket.onAny((event) => {
    console.log(`Socket Event : ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket
      .to(roomName)
      .emit("welcome", socket.nickname, roomName, countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, roomName, done) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

function onSocketClose() {
  console.log("Disconnected from Server ❌");
}

// const sockets = [];
// const wss = new WebSocket.Server({server,});
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "익명";
//   socket.send("Connected to Client ✅");
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg);

//     switch (message.type) {
//       case "new_message": {
//         sockets.forEach((socket) =>
//           socket.send(`${socket.nickname}: ${message.payload}`)
//         );
//         break;
//       }
//       case "nickname": {
//         socket["nickname"] = message.payload;
//         break;
//       }
//     }
//   });
// });

//wss.on("close", onSocketClose);

httpServer.listen(3000, handleListen);
