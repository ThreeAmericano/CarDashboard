// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');

const amqp = require('amqplib');    // RabbitMQ 사용 amqp 라이브러리
var firebase = require('firebase').default; // firebase 라이브러리

const service = new Service(pkgInfo.name);  // package.json 의 서비스 이름으로 서비스를 생성
const logHeader = "[" + pkgInfo.name + "]"; // 서비스 이름으로 logHeader 지정

//테스트중.

const MQ_URL = 'amqp://rabbit:MQ321@211.179.42.130:5672';   // RabbitMQ 주소 지정 amqp://아이디:비밀번호@호스트:포트

const firebaseConfig = {    // 우리 프로젝트 firebase 설정
    apiKey: "AIzaSyDMy6DVimbJQgQGo1PU0IXiPeq3K0yzF5I",
    authDomain: "threeamericano.firebaseapp.com",
    databaseURL: "https://threeamericano-default-rtdb.firebaseio.com",
    projectId: "threeamericano",
    storageBucket: "threeamericano.appspot.com",
    messagingSenderId: "475814972535",
    appId: "1:475814972535:web:8be8e4e4b6cf92f2e90a72",
    measurementId: "G-WEWQJ2NQSB"
};
firebase.initializeApp(firebaseConfig);// firebase 초기 설정

var dbRef = firebase.database().ref();
dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("[Service] listener :",data);
    console.log("[Service] listener :",data.smarthome.status);

    //var url = 'luna://com.ta.car2webos.service/listener';
    //var params = JSON.stringify({
    //    "data": data 
    //});
    //service.call(url, params);
});


service.register("listener", function(message) {    // signIn 서비스
    // 이메일, 비밀번호를 입력해 firebase에서 UID 값을 받아오고 UID를 서버로 전송해 계정 주인의 이름을 받아온다.
    console.log("[Service] ", logHeader, "SERVICE_METHOD_CALLED:/listener");
    console.log("[Service] In listener callback");

    let data = message.payload.data;
    console.log("[Service:listener] data :",data);
    console.log("[Service:listener] data.smarthome.status:",data.smarthome.status);

    message.respond({
        returnValue: true,
        Response: data
    });
});


async function sendMqttFunc(exchange, routingKey, msg) {    // MQTT 송신 함수
    console.log("[Service] send MQTT start");
    
    const connection = await amqp.connect(MQ_URL);          // RabbitMQ 연결
    const channel = await connection.createChannel();       // 채널 생성

    await channel.assertExchange(exchange, 'topic', {       // Exchange 연결 생성
        durable: true
    });
    channel.publish(exchange, routingKey, Buffer.from(msg));// Exchange의 RoutingKey로 msg 송신

    console.log("[Service]  [x] Sent %s:'%s'", routingKey, msg);

    setTimeout(() => {                                      // timeout 되면 채널과 연결 닫음
        channel.close();
        connection.close();
    }, 500);

    console.log("[Service] send MQTT end");
};

async function consumeMqtt(queue) { // MQTT 수신 함수 (queue에 들어있는 값을 받아온다.)
    let connection = await amqp.connect(MQ_URL);          // RabbitMQ 연결
    let channel = await connection.createChannel();       // 채널 생성

    let response = await channel.assertQueue(queue, {durable:true});    // Queue 연결

    await new Promise(resolve => setTimeout(resolve, 200)); // 0.2초 wait

    response = await channel.get(response.queue,{noAck : false});   // queue에 올라온 값 가져오기
    
    if(response) {  // 가져왔는지 확인    
        let msg = JSON.parse(response.content.toString());  // json으로 파싱
        channel.ack(response);  // queue 소진하기

        return String(msg.name);
    } else { // 너무 빨리 get 하여 아무 값도 받지 못하였다면
        await new Promise(resolve => setTimeout(resolve, 200)); // 0.2초 wait
        
        response = await channel.get(response.queue,{noAck : false}); // 다시 수신
        let msg = JSON.parse(response.content.toString());  // json으로 파싱
        channel.ack(response);  // queue 소진하기
        
        return String(msg.name);
    }
};

async function firebaseLogin(email, password) { // firebase 로그인 함수
    console.log("[Service] firebase singin function start");
    try {   // 로그인하고 UID 값을 받아온다.
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
        const uid = userCredential.user.uid;

        console.log("[Service] uid :", uid);
        console.log("[Service] firebase singin function success");
        return uid;
    } catch(err) {
        console.log("[Service] firebase singin function failed");
        console.log("[Service] err :", err);
    }
};

async function firebaseRTdb(){  // realtime database 읽기
    const dbRef = firebase.database().ref();
    let db;
    await dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            db = snapshot.val();
            //let homeTemp = db.hometemp;
            //let openWeather = db.openweather;
            //console.log("[Service] snapshot.val() :",snapshot.val());
            //console.log("[Service] homeTemp :",homeTemp);
            //console.log("[Service] openWeather :",openWeather);            
        } else {
            console.log("[Service] No data available");
        }
    }).catch((error) => {
        console.error(error);
        dbRef.off();
    });
    return db;
}

/*
await dbRef.child("sensor").get().then((snapshot) => {
        if (snapshot.exists()) {
            db = snapshot.val();
*/

service.register("getDB", async function(message) {    // signIn 서비스
    // 이메일, 비밀번호를 입력해 firebase에서 UID 값을 받아오고 UID를 서버로 전송해 계정 주인의 이름을 받아온다.
    console.log("[Service] print message ", message);
    console.log("[Service] ", logHeader, "SERVICE_METHOD_CALLED:/getDB");
    console.log("[Service] In getDB callback");

    let data = message.payload.data;
    console.log("[Service:getDB] data:",data);
    let db = await firebaseRTdb();
    console.log("[Service:getDB] db:",db);

    message.respond({
        returnValue: true,
        Response: db
    });
});

service.register("signIn", async function(message) {    // signIn 서비스
    // 이메일, 비밀번호를 입력해 firebase에서 UID 값을 받아오고 UID를 서버로 전송해 계정 주인의 이름을 받아온다.
    console.log("[Service] ", logHeader, "SERVICE_METHOD_CALLED:/signIn");
    console.log("[Service] In signIn callback");
    
    let email = message.payload.email;
    let password = message.payload.password;

    let uid = await firebaseLogin(email, password); // 이메일, 비밀번호로 firebase에서 UID값 받아오기

    const exchange = "webos.topic";             // RabbitMQ 로그인 시 연결 정보
    const routingKey = "webos.server.info";
    const msg = JSON.stringify({
        "Producer" : "car",
        "command" : "signin",
        "UID" : uid
    });
    const queue = "webos.car";
    let returnMsg;

    await sendMqttFunc(exchange, routingKey, msg);  // 서버로 uid 값을 보낸다.
    console.log("[Service] sendMqtt end in service");

    async function signinMqtt() {                   // await를 위해 비동기 함수로 만들어 실행
        returnMsg = await consumeMqtt(queue);       // 이름 수신 (서버는 uid를 받으면 이름을 보낸다.)
        console.log("[Service] consumeMqtt end in service");
        console.log("[Service] name :", returnMsg);
    };

    await signinMqtt();//위 비동기 함수

    let db = await firebaseRTdb();
    console.log("[Service] db:",db);

    message.respond({
        returnValue: true,
        Response: {
            "name" : returnMsg,
            "db" : db
        }
    });
});

service.register("sendMqtt", async function(message) {  // MQTT 송신 서비스
    // Exchange, routingKey, msg를 받아 송신한다.
    console.log("[Service] ", logHeader, "SERVICE_METHOD_CALLED:/sendMqtt");
    console.log("[Service] In sendMqtt callback");

    const exchange = message.payload.exchange;
    const routingKey = message.payload.routingKey;
    const msg = message.payload.msg;
    
    await sendMqttFunc(exchange, routingKey, msg);

    message.respond({
        returnValue: true,
        Response: "Send Complete"
    });
});
/*
service.register("consumeMqtt", async function(message) {  // MQTT 수신 서비스
    // Exchange, routingKey, msg를 받아 송신한다.
    console.log(logHeader, "SERVICE_METHOD_CALLED:/consumeMqtt");
    console.log("In consumeMqtt callback");

    const queue = message.payload.queue;
    
    await sendMqttFunc(exchange, routingKey, msg);

    let data = await consumeMqtt(queue);

    message.respond({
        returnValue: true,
        Response: "data"
    });
});
*/


//---------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------

// a method that always returns the same value
service.register("hello", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/hello");
    console.log("In hello callback");
    const name = message.payload.name ? message.payload.name : "World";

    message.respond({
        returnValue: true,
        Response: "Hello, " + name + "!"
    });
});

// call another service
service.register("time", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/time");
    console.log("time callback");
    service.call("luna://com.webos.service.systemservice/clock/getTime", {}, function(m2) {
        console.log(logHeader, "SERVICE_METHOD_CALLED:com.webos.service.systemservice/clock/getTime");
        const response = "You appear to have your UTC set to: " + m2.payload.utc;
        console.log(response);
        message.respond({message: response});
    });
});

// handle subscription requests
const subscriptions = {};
let interval;
let x = 1;
function createInterval() {
    if (interval) {
        return;
    }
    console.log(logHeader, "create_interval");
    console.log("create new interval");
    interval = setInterval(function() {
        sendResponses();
    }, 1000);
}

// send responses to each subscribed client
function sendResponses() {
    console.log(logHeader, "send_response");
    console.log("Sending responses, subscription count=" + Object.keys(subscriptions).length);
    for (const i in subscriptions) {
        if (Object.prototype.hasOwnProperty.call(subscriptions, i)) {
            const s = subscriptions[i];
            s.respond({
                returnValue: true,
                event: "beat " + x
            });
        }
    }
    x++;
}

// listen for requests, and handle subscriptions via implicit event handlers in call
// to register
service.register("heartbeat", function(message) {
    const uniqueToken = message.uniqueToken;
    console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat");
    console.log("heartbeat callback, uniqueToken: " + uniqueToken + ", token: " + message.token);
    message.respond({event: "beat"});
    if (message.isSubscription) {
        subscriptions[uniqueToken] = message;
        if (!interval) {
            createInterval();
        }
    }
},
function(message) {
    const uniqueToken = message.uniqueToken;
    console.log("Canceled " + uniqueToken);
    delete subscriptions[uniqueToken];
    const keys = Object.keys(subscriptions);
    if (keys.length === 0) {
        console.log("no more subscriptions, canceling interval");
        clearInterval(interval);
        interval = undefined;
    }
});

// EventEmitter-based API for subscriptions
// note that the previous examples are actually using this API as well, they're
// just setting a "request" handler implicitly
const heartbeat2 = service.register("heartbeat2");
heartbeat2.on("request", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat2/request");
    console.log("heartbeat callback");
    message.respond({event: "beat"});
    if (message.isSubscription) {
        subscriptions[message.uniqueToken] = message;
        if (!interval) {
            createInterval();
        }
    }
});
heartbeat2.on("cancel", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/heartbeat2/cancel");
    console.log("Canceled " + message.uniqueToken);
    delete subscriptions[message.uniqueToken];
    const keys = Object.keys(subscriptions);
    if (keys.length === 0) {
        console.log("no more subscriptions, canceling interval");
        clearInterval(interval);
        interval = undefined;
    }
});

service.register("ping", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/ping");
    console.log("Ping! setting up activity");
    const methodName = "luna://" + pkgInfo.name + "/pong";
    const activitySpec = {
        "activity": {
            "name": "My Activity", // this needs to be unique, per service
            "description": "do something", // required
            "background": true,    // can use foreground or background, or set individual properties (see Activity Specification below, for details)
            "persist": true,       // this activity will be persistent across reboots
            "explicit": true,      // this activity *must* be completed or cancelled explicitly, or it will be re-launched until it does
            "callback": {          // what service to call when this activity starts
                "method": methodName, // URI to service
                "params": {        // parameters/arguments to pass to service
                }
            }
        },
        "start": true,             // start the activity immediately when its requirements (if any) are met
        "replace": true,           // if an activity with the same name already exists, replace it
        "subscribe": false         // if "subscribe" is false, the activity needs to be adopted immediately, or it gets canceled
    };
    service.call("luna://com.webos.service.activitymanager/create", activitySpec, function(reply) {
        console.log(logHeader, "SERVICE_METHOD_CALLED:com.webos.service.activitymanager/create");
        const activityId = reply.payload.activityId;
        console.log("ActivityId = " + activityId);
        message.respond({msg: "Created activity "+ activityId});
    });
});

service.register("pong", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/pong");
    console.log("Pong!");
    console.log(message.payload);
    message.respond({message: "Pong"});
});

service.register("/do/re/me", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED://do/re/me");
    message.respond({verses:[
        {doe: "a deer, a female deer"},
        {ray: "a drop of golden sun"},
        {me: "a name I call myself"}
    ]});
});
