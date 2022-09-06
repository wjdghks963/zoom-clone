# Zoom CloneCoding

# WebSocket

1. http와 같은 protocol
2. req,res 를 주고 받는 형태가 아니라 client(or server)가 req를 보낸다면 서버에서 수락을 한 후 에 터널 같은 연결을 생성한 후 연결이 끊기기 전까지 언제든지 서로 소통할 수 있는데 이때 http와 같은 req,res 관계가 필요없이 상호적으로 메시지를 보낼 수 있다.
3. protocol이 다르니 url의 scheme이 다르다.

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
