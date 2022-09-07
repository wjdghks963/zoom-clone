# Zoom CloneCoding

# WebSocket

1. http와 같은 protocol
2. 양방향
   req,res 를 주고 받는 형태가 아니라 client(or server)가 req를 보낸다면 서버에서 수락을 한 후 에 터널 같은 연결을 생성한 후 연결이 끊기기 전까지 언제든지 서로 소통할 수 있는데 이때 http와 같은 req,res 관계가 필요없이 상호적으로 메시지를 보낼 수 있다.
3. https protocol이 다르니 url의 scheme이 다르다.

## socket url 연결

1. 프론트에서

새로운 websocket을 만드는데 안에는 ws protocol을 이용한 url을 넣어서 연결한다.

```javascript
const socket = new WebSocket(`ws://${window.location.host}`);
```

2. 벡엔드에서

새로운 websocket 서버를 만든다.
`on` method를 이용해서 "connection"을 통해 연결을 시킨다.

```javascript
// http, ws 둘 다 이용이 가능하게 함
const server = http.createServer(app);
const wss = new WebSocket.Server({
  server,
});

wss.on("connection", (socket) => {
  socket.send("Connected to Client ✅");
});
```

## socket엔 정보 저장이 가능하다.

wss에 connection을 한 후에 socket을 받아서 "nickname"이란 키를 설정하고 안에 "익명" 값을 넣을 수 있다.

```javascript
wss.on("connection", (socket) => {
  socket["nickname"] = "익명";
  }
```

</br>
</br>
</hr>

# SocketIO

실시간, 양방향, event 기반 통신이 가능하다.

- websocket이 지원되지 않거나 문제가 생겨도 socketIO는 항상 작동한다. (기본적으로 websocket을 사용한다.)
- 자동으로 재연결을 시도한다
- firewall | proxy가 존재해도 작동한다.
  ...

## socket의 이벤트 설정 가능

front-end

```javascript
// connection 안에서
socket.emit("custom_event", { somethingToSend }, callbackFn);
// 여기서 callbackFn은 서버로 넘겨지는 콜백이다.
```

back-end

```javascript
socket.on("custom_event", (socket, fn) => {
  console.log(socket); // {somethingToSend}
  fn(); // 호출은 벡엔드에서 되지만 프론트에서 실행이된다.
});
```

`emit`을 할때 이벤트도 자유롭지만 인자도 정해져 있는것이 아니다 매우 자유롭다.
원하는 만큼의 매개변수를 넣은 다음에 벡엔드에서 받아 줄때 맞추기만 하면된다.
**하지만 콜백 함수만큼은 마지막에 보내야한다.**

ex)

```javascript
front

socket.emit("e", 1,2,3,4,"5")

back

socket.on("e", (1,2,3,4,5)=>{
    console.log(1,2,3,4,5) // 1,2,3,4,"5"
})
```

## room 기능

socket.io에서는 기본적으로 room, 방의 개념을 기본적으로 제공해준다.
방은 SET의 형태로 구성된다. Set {"socket.id", roomName}
`console.log(socket.rooms)`을 통해 어떤 방이 있는지 알수 있다.

서버와 user 사이에 기본적으로 private한 room을 가지고 있다.
-> 기본 `Set(1) {"socket.id"}`

```javascript
socket.join(roomName); // roomName이라는 room을 만들고 접속한 socket이 그 방에 들어가게 한다.
```

## Adapter

#### 개념

일반적으로 사용할때 같은 서버에서 memory위에 올려진 socket들끼리만 연결이 가능하지만
DB를 통한 server들과의 연결을 통해서 다른 서버에 있는 socket들과도 연결이 가능하다.

#### 현재 server에서 memory 위에 있는 rooms

```javascript
console.log(wsServer.sockets.adapter); // Map안에 room들에 대한 정보가 있는 Set들이 들어가 있다.
```
