/*
 * Copyright (c) 2020 LG Electronics Inc.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
// helloworld_webos_service.js
// is simple service, based on low-level luna-bus API

// eslint-disable-next-line import/no-unresolved
const pkgInfo = require('./package.json');
const Service = require('webos-service');

const amqp = require('amqplib');
var firebase = require('firebase');

const service = new Service(pkgInfo.name); // Create service by service name on package.json
const logHeader = "[" + pkgInfo.name + "]";
let greeting = "Hello, World!";

const MQ_URL = 'amqp://rabbit:MQ321@211.179.42.130:5672';

async function sendMqttFunc(exchange, routingKey, msg) {
    console.log("send MQTT start");
    
    const connection = await amqp.connect(MQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', {
        durable: true
    });
    channel.publish(exchange, routingKey, Buffer.from(msg));

    console.log(" [x] Sent %s:'%s'", routingKey, msg);

    setTimeout(() => {
        channel.close();
        connection.close();
    }, 500);

    console.log("send MQTT end");
};

async function consumeMqtt(queue) {
    try{
        console.log("consume MQTT start");
        console.log("queue : ", queue);
        let returnMsg;

        await amqp.connect(MQ_URL).then(function(conn){
            process.once('SIGINT', function() { conn.close(); });
            return conn.createChannel().then(function(ch) {
                return ch.assertQueue(queue, {durable:true})
                    .then(function(qok) {
                        return ch.get(qok.queue, {noAck: false});
                    })
                    .then(function(msg) {
                        if (msg) {
                            console.log("msg : " + msg.content.toString());
                            returnMsg = JSON.parse(msg.content.toString()); 
                            console.log("returnMsg.name : ",returnMsg.name);
                            ch.ack(msg);
                        } else {
                        console.log("logMessage: " + "No Messages At This Time.");
                        }
                    })
                    .then(function() {
                        console.log(' [C] Closing Connection');
                    });
            });
        }).then(null, console.warn);

        setTimeout(() => {
            console.log("consume time out")
            channel.close();
            connection.close();
        }, 1000);

        return returnMsg;
    } catch(e) {
        console.log(String(e));
    }
};

async function firebaseLogin(email, password) {
    const firebaseConfig = {
        apiKey: "AIzaSyDMy6DVimbJQgQGo1PU0IXiPeq3K0yzF5I",
        authDomain: "threeamericano.firebaseapp.com",
        databaseURL: "https://threeamericano-default-rtdb.firebaseio.com",
        projectId: "threeamericano",
        storageBucket: "threeamericano.appspot.com",
        messagingSenderId: "475814972535",
        appId: "1:475814972535:web:8be8e4e4b6cf92f2e90a72",
        measurementId: "G-WEWQJ2NQSB"
    };
    await firebase.initializeApp(firebaseConfig);

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password)
        const uid = await userCredential.user.uid;

        console.log(uid);
        return await uid;
    } catch(err) {
        console.log(err);
    }
};

service.register("signIn", async function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/mqtt");
    console.log("In mqtt callback");
    
    let email = message.payload.email;
    let password = message.payload.password;
    let uid = await firebaseLogin(email, password);

    const exchange = "webos.topic";
    const routingKey = "webos.server.info";
    const msg = JSON.stringify({
        "Producer" : "car",
        "command" : "signin",
        "UID" : uid
    });
    const queue = "webos.car";
    let returnMsg;

    await sendMqttFunc(exchange, routingKey, msg);
    console.log("sendMqtt end in service");

    async function signinMqtt() {
        returnMsg = await consumeMqtt(queue);
        console.log("consumeMqtt end in service");
        console.log("name : ", returnMsg);
    };

    await signinMqtt();

    message.respond({
        returnValue: true,
        Response: returnMsg.name
    });
});

// a method that always returns the same value
service.register("sendMqtt", async function(message) {
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

// set some state in the service
service.register("/config/setGreeting", function(message) {
    console.log(logHeader, "SERVICE_METHOD_CALLED:/config/setGreeting");
    console.log("In setGreeting callback");
    if (message.payload.greeting) {
        greeting = message.payload.greeting;
    } else {
        message.respond({
            returnValue: false,
            errorText: "argument 'greeting' is required",
            errorCode: 1
        });
    }
    message.respond({
        returnValue: true,
        greeting: greeting
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
