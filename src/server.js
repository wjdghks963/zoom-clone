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

httpServer.listen(3000, handleListen);
