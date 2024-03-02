Noom
Zoom Clone using NodeJS, WebRTC and Websockets.

npm init -y
npm i nodemon -D npm i @babel/core -D npm i @babel/cli -D npm i @babel/node -D

npm i @babel/preset-env -D npm i express

socket IO
https://socket.io/docs/v4/ 프론트와 백엔드간에 실시간 통신을 가능케 하는 프레임워크

서버에 설치.

npm i socket.io 클라이언트에도 설치 script(src="/so

서버측 : 커넥션을 받을 준비
wsServer.on("connection", (socket) => {  
    console.log(socket);
});

클라이언트(브라우저)에서 socket 설치 후에는 io function 사용가능
const socket = io();
io 함수는 알아서 socket.io 를 실행하고 있는 서버를 찾는다.

클라이언트 측 : 서버에 전송
** 세번째 아규먼트에 오는 함수는 서버측에서 호출된다.**
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  });
  
4: 서버측 : 10초후에 클라이언트측의 함수를 호출한다.

socket.on("enter_room", (msg, done) => {
    console.log(msg);
    setTimeout(() => {
      done();
    }, 10000);
  });
