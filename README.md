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

# video & mike

먼저 비디오와 오디오의 사용 허가를 받는다.

```javascript
let stream;

try {
    stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    vide: true,
  });
} catch (e) {
  console.log(e);
}

stream을 video태그 안에 넣어주면 된다.
```

<br/>
`getUesrMedia`안에 들어가는 매개변수는 constraints라는 이름의 객체이다.

```javascript
// basic
{audio: true, video: true}
// 비디오 해상도 설정 가능
{audio: true, video:{
    width : 1280,
    height : 720
}}
// mobile 전 후면 카메라
{audio: true, video:{
    // 전면
     facingMode :"user"
    // 후면
     facingMode:{
        exact:"environment"
     }
}}
```

이 객체 안에는 Tracks라는 method가 존재하는데 이름에 맞게 사용한다면 조작이 가능하다.
유저가 지금 이용중인 기계의 정보와 상태가 array형태로 나온다.
array 안에 들어있는 값의 형태는 object이다.
object의 이름은 MediaStreamTrack

```javascript
stream.getAudioTracks(); // array 형태의 데이터로 나온다
stream.getVideoTracks();
```

모든 컴퓨터에 연결된 장치의 output input에 대한 정보가 들어있는 array 형태

```javascript
navigator.mediaDevices.enumerateDevices();
```

</br>
</br>
</hr>

# webRTC

실시간으로 영상을 통해 소통이 가능하게 해주는 기술의 웹 표준

### peer to peer

서버에 들려서 socket들을 전달하는 socket.io와 다르게 서버가 필요없이 client끼리의 연결이 가능하다.
하지만 아래와 같은 이유로 서버가 필요하다.

- 브라우저의 위치(ip)
  서로 연결 시켜야할 상대가 누구인지 알아야함
- 유저의 setting, configuration
  유저가 어떤 설정을 가지고 있는지 알아야함
  ex) `getUserMedia() ...`

#### ping pong

offer와 answer을 서로 저장하고 보내면서 상대에 대한 정보를 받는다.

offer는 초대장과 같다. object의 형태를하고 있으며 sdp를 가지고 있다.

```javascript
let myPeerConnection = new RTCPeerConnection();
myStream
  .getTracks()
  .forEach((track) => myPeerConnection.addTrack(track, myStream));

const offer = await myPeerConnection.createOffer();
myPeerConnection.setLocalDescription(offer);
```

`setLocalDescription`은 offer를 받았을때 해당 offer로 연결을 구성해야하는데 연결과 관련된 로컬 설명을 변경하는 메소드이다.

`setRemoteDescription`은 offer에 대한 answer를 보내기 전에 other peer의 description을 세팅하는 것을 말한다.

#### Track

피어 연결에 추가될 미디어 트랙을 나타내는 MediaStreamTrack 객체
https://developer.mozilla.org/ko/docs/Web/API/MediaStreamTrack

#### iceCandidate

인터넷 연결 생성상태
webRTC에 필요한 프로토콜들(멀리 떨어진 장치와 통신할 수 있게끔)

이 과정은 다수의 후보들이 각각의 연결에서 제안되고 서로의 동의하에 하나를 선택한다. 그리고 그것을 소통 방식에 사용한다.

#### Sender

상대방(peer)에게 보내진 media stream track(video | audio)을 컨트롤하게 해준다.
ex) 나의 음소거상태 등...
