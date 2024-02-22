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

function onSocketClose(){
    console.log("Disconnected from the Browser");
}
function onSocketMessage(message){
    console.log(message);
} 

const sockets = []; //연결된 브라우저를 넣는 데이터베이스

wss.on("connection",(socket) => {  //여기서의 socket은 연결된 브라우저를 뜻함.
    sockets.push(socket);//소켓 연결
    socket["nickname"] = "익명";//닉넴 안정한 사람 = "익명"으로 정함.
    console.log("Connected to Browser");
    socket.on("close", onSocketClose);
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type){
            case "new_message":
                sockets.forEach((aSocket) => 
                    aSocket.send(`${socket.nickname}: ${message.payload}`)//문자열표현
                )
            case "nickname": //닉네임 정했을때
                socket["nickname"] = message.payload;
        }
    });
});
  //socket이 프론트와 실시간으로 소통할 수 있음
server.listen(3000, handleListen);

{
    type:"message";
    payload:"hello everyone!";
}
{
    type:"nickname";
    payload:"nico";
}