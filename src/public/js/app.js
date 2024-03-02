/* const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);
//여기서의 socket은 서버로의 연결을 뜻함.

function makeMessage(type, payload){
    const msg = {type, payload}; //object 만들기
    return JSON.stringify(msg); //object자료를 string으로 변환
}

function handleOpen(){
    console.log("Connected to Server");    
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    const li = document.createElement("li"); //메시지를 받으면 새로운 li생성
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    const li = document.createElement("li"); //메시지를 받으면 새로운 li생성
    li.innerText = `You: ${input.value}`;
    messageList.append(li);
    input.value = ""; //값을 보내준 후 창 비우기
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname",input.value));
    input.value = "";

}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit); */





//socket.io 사용하기
const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

    function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
  }

  
  function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, `You: ${value}`);
    input.value = "";
  }
  function handleNicknameSubmit(event) {
      event.preventDefault();
      const input = room.querySelector("#name input");
      socket.emit("nickname", input.value);
    }
  
  function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room :  ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nickForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nickForm.addEventListener("submit", handleNicknameSubmit);
  }
  
  function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
  }
  
  form.addEventListener("submit", handleRoomSubmit);
  
  socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room :  ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
  });
  
  socket.on("bye", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room :  ${roomName} (${newCount})`;
    addMessage(`${user} left ㅠㅠ`);
  });
  
  socket.on("new_message", addMessage);

  //방에 들어가기 전 기다릴 때 열려있는 모든 방의 list 확인하기
  socket.on("room_change", (rooms)=> {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = ""; //방목록 항상 비워주기
    if(rooms.length === 0){
      return;
    }
    rooms.forEach(room => {
      const li = document.createElement("li");
      li.innerText = room;
      roomList.append(li);
    });
  });