import http from "http";
import { Server } from 'socket.io';
import express from "express";

const app = express();

app.set("view engine","pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const httpServer = http.createServer(app); //1.http서버를 만든다.
const wsServer = new Server(httpServer);//2.새로운 웹소켓을 쌓아올리며 만든다.




/* const wss = new WebSocket.Server({server});//2.새로운 웹소켓을 쌓아올리며 만든다.

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
                );
            case "nickname": //닉네임 정했을때
                socket["nickname"] = message.payload;
        }
    });
}); */

const handleListen = () => console.log( `Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);