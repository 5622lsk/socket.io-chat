import http from "http";
import { Server } from 'socket.io';
import express from "express";
import {instrument} from "@socket.io/admin-ui";


const app = express();

app.set("view engine","pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const httpServer = http.createServer(app); //1.http서버를 만든다.
const wsServer = new Server(httpServer, {  //2.새로운 웹소켓을 쌓아올리며 만든다.
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
});

instrument(wsServer, {
    auth: false,
    mode: "development",
  });


//wsServer.socket.adapter로 부터 sids와 rooms를 가져와서 코드 실행
//sids:개인방, rooms:개인방,공개방
function publicRooms(){
    const {sockets: {
        adapter: {sids,rooms},
    },
} = wsServer;
const publicRooms = [];
rooms.forEach((_, key) => {
    if(sids.get(key) === undefined) {
        publicRooms.push(key)
    }
})
return publicRooms;
}

//유저수를 세는 함수
function countRoom(roomName){
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
wsServer.sockets.emit("room_change", publicRooms());
socket["nickname"]= "Anon";
socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname,countRoom(roomName));
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
      socket.rooms.forEach((room) => 
        socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
  });
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (msg, roomName) => {
    socket.to(roomName).emit("new_message", `${socket.nickname}: ${msg}`);
    // 작업이 완료되었음을 알리는 콜백 함수 호출
    // done(); // 작업 완료를 알리는 콜백 함수 호출
    });
    //nickname event가 발생하면 nickname을 가져와서 socket에 저장함.
    socket.on("nickname", (nickname) => socket["nickname"] = nickname);
});





const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);






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

// const handleListen = () => console.log( `Listening on http://localhost:3000`);
