import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on 3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
});

function onSocketClose() {
  console.log("Disconnected from Server ❌");
}

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "익명";
  socket.send("Connected to Client ✅");
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);

    switch (message.type) {
      case "new_message": {
        sockets.forEach((socket) =>
          socket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      }
      case "nickname": {
        socket["nickname"] = message.payload;
        break;
      }
    }
  });
});

wss.on("close", onSocketClose);

server.listen(3000, handleListen);
