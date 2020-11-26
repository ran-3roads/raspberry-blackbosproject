function startConnect() { // 접속을 시도하는 함수
    clientID = "clientID-" + parseInt(Math.random() * 100); // 랜덤한 사용자 ID 생성

    // 사용자가 입력한 브로커의 IP 주소와 포트 번호 알아내기
    broker = document.getElementById("broker").value; // 브로커의 IP 주소
    port = document.getElementById("port").value; // 브로커의 포트 번호

    // id가 message인 DIV 객체에 브로커의 IP와 포트 번호 출력
    document.getElementById("messages").innerHTML += '<br><span>접속 : ' + broker + ' 포트 ' + port + '</span><br/>';
    document.getElementById("messages").innerHTML += '<span>사용자 ID : ' + clientID + '</span><br/>';

    // MQTT 메시지 전송 기능을 모두 가징 Paho client 객체 생성
    client = new Paho.MQTT.Client(broker, Number(port), clientID);

    // client 객체에 콜백 함수 등록
    client.onConnectionLost = onConnectionLost; // 접속이 끊어졌을 때 실행되는 함수 등록
    client.onMessageArrived = onMessageArrived; // 메시지가 도착하였을 때 실행되는 함수 등록

    // 브로커에 접속. 매개변수는 객체 {onSuccess : onConnect}로서, 객체의 프로퍼틴느 onSuccess이고 그 값이 onConnect.
    // 접속에 성공하면 onConnect 함수를 실행하라는 지시
    client.connect({
        onSuccess: onConnect,
    });
}
// 브로커로의 접속이 성공할 때 호출되는 함수
function onConnect() {
    topic = document.getElementById("topic").value; // 사용자가 입력한 토픽 문자열 알아내기

    // 토픽으로 subscribe 하고 있음을 id가 message인 DIV에 출력
    document.getElementById("messages").innerHTML += '<span>Subscribing to: ' + topic + '</span><br/>';

    client.subscribe(topic); // 브로커에 subscribe
}

// 접속이 끊어졌을 때 호출되는 함수
function onConnectionLost(responseObject) { // 매개변수인 responseObject는 응답 패킷의 정보를 담은 개체
    document.getElementById("messages").innerHTML += '<span>오류 : 접속 끊어짐</span><br/>';
    if (responseObject.errorCode !== 0) {
        document.getElementById("messages").innerHTML += '<span>오류 : ' + + responseObject.errorMessage + '</span><br/>';
    }
}

// 메시지가 도착할 때 호출되는 함수
var now;
function onMessageArrived(msg) { // 매개변수 msg는 도착한 MQTT 메시지를 담고 있는 객체
    console.log("onMessageArrived: " + msg.payloadString);

    // 도착한 메시지 출력
    if(msg.destinationName =="ultrasonic"){
        now=new Date();
        document.getElementById("messages").innerHTML += '<span>'+now+' 시간에 움직임이 감지되었습니다. </span><br/>';
    }
    else document.getElementById("messages").innerHTML += '<span>토픽 : ' + msg.destinationName + '  | ' + msg.payloadString + '</span><br/>';
}

// disconnection 버튼이 선택되었을 때 호출되는 함수
function startDisconnect() {
    client.disconnect(); // 브로커에 접속 해제
    document.getElementById("messages").innerHTML += '<span>Disconnected</span><br/>';
}


