import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log( `Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on("connection",(socket) => {  //여기서의 socket은 연결된 브라우저를 뜻함.
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from the Browser") );
    socket.on("message", (message) => {
        console.log(message);
    });
    socket.send("hello!!??");  //socket이 프론트와 실시간으로 소통할 수 있음
});

server.listen(3000, handleListen);
// app.listen(3000,handleListen);