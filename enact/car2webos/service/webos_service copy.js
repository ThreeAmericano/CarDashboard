// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');

const amqp = require('amqplib');    // RabbitMQ 사용 amqp 라이브러리
var firebase = require('firebase').default; // firebase 라이브러리

const service = new Service(pkgInfo.name);  // package.json 의 서비스 이름으로 서비스를 생성
const logHeader = "[" + pkgInfo.name + "]"; // 서비스 이름으로 logHeader 지정

const MQ_URL = 'amqp://rabbit:MQ321@211.179.42.130:5672';   // RabbitMQ 주소 지정 amqp://아이디:비밀번호@호스트:포트

async function sendMqttFunc(exchange, routingKey, msg) {    // MQTT 송신 함수
    console.log("send MQTT start");
    
    const connection = await amqp.connect(MQ_URL);          // RabbitMQ 연결
    const channel = await connection.createChannel();       // 채널 생성

    await channel.assertExchange(exchange, 'topic', {       // Exchange 연결 생성
        durable: true
    });
    channel.publish(exchange, routingKey, Buffer.from(msg));// Exchange의 RoutingKey로 msg 송신

    console.log(" [x] Sent %s:'%s'", routingKey, msg);

    setTimeout(() => {                                      // timeout 되면 채널과 연결 닫음
        channel.close();
        connection.close();
    }, 500);

    console.log("send MQTT end");
};

async function consumeMqtt(queue) { // MQTT 수신 함수 (queue에 들어있는 값을 받아온다.)
    try{
        console.log("consume MQTT start");
        console.log("queue : ", queue);
        let returnMsg;  // 수신 받은 값을 리턴해줄 변수

        await amqp.connect(MQ_URL).then(async function(conn){             // RabbitMQ 연결
            process.once('SIGINT', function() { conn.close(); });   // 종료 신호가 오면 연결 해제 [SIGINT : ctrl+c < 종료신호]
            return await conn.createChannel().then(async function(ch) {         // 채널 생성
                return ch.assertQueue(queue, {durable:true})        // Queue 연결 생성
                    .then(async function(qok) {                           // Queue 가 연결되면
                        return await ch.get(qok.queue, {noAck: false});   // 값을 가져온다. noAck를 true로 설정하면, 값을 가져와도 pop되지 않는다.
                    })
                    .then(function(msg) {                                   // 받아온 값
                        if (msg) {
                            console.log("msg : " + msg.content.toString());
                            returnMsg = JSON.parse(msg.content.toString()); // 받아온 값을 returnMSG 변수에 담는다. 
                            console.log("returnMsg.name : ",returnMsg.name);
                            ch.ack(msg); // Queue의 값을 pop 한다.
                        } else {
                            console.log("logMessage: No Messages At This Time.");
                        }
                    })
                    .then(function() {
                        console.log(' [C] Closing Connection');
                    });
            });
        }).then(null, console.warn);
        
        console.log("returnMSG : ",returnMsg);
        return returnMsg;   // 수신한 MQTT 값을 return한다.

    } catch(e) {
        console.log(String(e));
    }
};

async function firebaseLogin(email, password) { // firebase 로그인 함수
    console.log("firebase singin function start");
    const firebaseConfig = {                    // 우리 프로젝트 firebase 설정
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

    try {   // 로그인하고 UID 값을 받아온다.
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
        const uid = userCredential.user.uid;

        console.log(uid);
        console.log("firebase singin function success");
        return uid;
    } catch(err) {
        console.log("firebase singin function failed");
        console.log(err);
    }
};

async function firebaseRTdb(){
    /*
    const firebaseConfig = {                    // 우리 프로젝트 firebase 설정
        apiKey: "AIzaSyDMy6DVimbJQgQGo1PU0IXiPeq3K0yzF5I",
        authDomain: "threeamericano.firebaseapp.com",
        databaseURL: "https://threeamericano-default-rtdb.firebaseio.com",
        projectId: "threeamericano",
        storageBucket: "threeamericano.appspot.com",
        messagingSenderId: "475814972535",
        appId: "1:475814972535:web:8be8e4e4b6cf92f2e90a72",
        measurementId: "G-WEWQJ2NQSB"
    };
    await firebase.initializeApp(firebaseConfig);// firebase 초기 설정
    */
    const dbRef = firebase.database().ref();
    dbRef.child("sensor").get().then((snapshot) => {
        if (snapshot.exists()) {
            let db = snapshot.val();
            let homeTemp = db.hometemp;
            let openWeather = db.openweather;
            console.log("snapshot.val() :",snapshot.val());
            console.log("homeTemp :",homeTemp);
            console.log("openWeather :",openWeather);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
        dbRef.off();
    });

    return database;
}

service.register("getDB", async function(message) {    // signIn 서비스
    // 이메일, 비밀번호를 입력해 firebase에서 UID 값을 받아오고 UID를 서버로 전송해 계정 주인의 이름을 받아온다.
    console.log(logHeader, "SERVICE_METHOD_CALLED:/getDB");
    console.log("In getDB callback");

    let data = message.payload.data;
    console.log(data);
    /*
    let db = firebaseRTdb();
    console.log(db);
    */
    firebaseRTdb();

    message.respond({
        returnValue: true,
        Response: "db"
    });
});

service.register("signIn", async function(message) {    // signIn 서비스
    // 이메일, 비밀번호를 입력해 firebase에서 UID 값을 받아오고 UID를 서버로 전송해 계정 주인의 이름을 받아온다.
    console.log(logHeader, "SERVICE_METHOD_CALLED:/signIn");
    console.log("In signIn callback");
    
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
    console.log("sendMqtt end in service");

    async function signinMqtt() {                   // await를 위해 비동기 함수로 만들어 실행
        returnMsg = await consumeMqtt(queue);       // 이름 수신 (서버는 uid를 받으면 이름을 보낸다.)
        console.log("consumeMqtt end in service");
        console.log("name : ", returnMsg);
    };

    await signinMqtt();//위 비동기 함수

    message.respond({
        returnValue: true,
        Response: returnMsg.name
    });
});

service.register("sendMqtt", async function(message) {  // MQTT 송신 서비스
    // Exchange, routingKey, msg를 받아 송신한다.
    console.log(logHeader, "SERVICE_METHOD_CALLED:/sendMqtt");
    console.log("In sendMqtt callback");

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
/*
// a method that always returns the same value
service.register("mqtt", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/mqtt");
    console.log("In mqtt callback");

    console.log("message : ",message);
    console.log("message.payload : ",message.payload);
    
    console.log("message.payload.exchange : ",message.payload.exchange);
    console.log("message.payload.msg : ",message.payload.msg);

    const exchange = message.payload.exchange;
    const routingKey = message.payload.routingKey;
    const msg = JSON.stringify(message.payload.msg);
    const queue = "webos.car";

    let returnMsg = "";
    
    amqp.connect('amqp://rabbit:MQ321@211.179.42.130:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertExchange(exchange, 'topic', {
                durable: true
            });
            channel.publish(exchange, routingKey, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });

        setTimeout(function() { 
            connection.close(); 
            process.exit(0); 
        }, 500);
    });

    amqp.connect('amqp://rabbit:MQ321@211.179.42.130:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            
            channel.consume(queue, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
                returnMsg = msg.content.toString();
            }, {
                noAck: true
            });
        });

        setTimeout(function() { 
            connection.close(); 
            process.exit(0); 
        }, 500);
    });

    console.log("name : ", returnMsg);

    message.respond({
        returnValue: true,
        Response: "name : "+ returnMsg
    });
});
*/



//---------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------

/*
// 되는 예제
service.register("mqtt", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/mqtt");
    console.log("In mqtt callback");

    const exchange = "webos.topic";
    const routingKey = "webos.server.info";
    const msg = JSON.stringify({
        "Producer":"car",
        "command":"signin",
        "UID": "aw0liyvHuUXW1d3AZqzoP9vcsV92"
    });
    
    amqp.connect('amqp://rabbit:MQ321@211.179.42.130:5672', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertExchange(exchange, 'topic', {
                durable: true
            });
            channel.publish(exchange, routingKey, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });

        setTimeout(function() { 
            connection.close(); 
            process.exit(0); 
        }, 500);
    });

    message.respond({
        returnValue: true,
        Response: "Send Complete"
    });
});
*/

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
