const mqtt = require('mqtt');

const options = {
    //host: '211.179.42.130',
    port: 5672,
    protocol: 'mqtt',
    username:"rabbit",
    password:"MQ321",
    encoding: 'utf8'
};		
const client = mqtt.connect("mqtt://211.179.42.130", options);
//console.log("들어가요?"); 
client.on('connect', function () {
    client.subscribe('test321', function (err) {
        if (!err) { 
            client.publish('test321', 'js mqtt test 2'); 
            console.log("send MQTT"); 
        }
    });
});
client.on("error", (error) => { 
    console.log("Can't connect" + error);
});

const publishTest = () => {
    client.publish('enactMQTT', 'enact button clicked'); 
}
const queueTest = () =>{
    client.on('message', function (topic, message) { 
        // message is Buffer 
        console.log(message.toString()); 
        client.end(); 
    });
}
const connectEnd = () => {
    client.end();
}
/*
return(
    <>
        <div>
            <span>
                <Button onClick={publishTest}>MQTT publish test</Button>
            </span>
            <br />
            <span>
                <Button onClick={connectEnd}>MQTT disconnect</Button>
            </span>
        </div>
    </>
);


var mqtt = require('mqtt');
var count =0;
var client  = mqtt.connect("mqtt://211.179.42.130",{clientId:"mqttjs01"});
console.log("connected flag  " + client.connected);

//handle incoming messages
client.on('message',function(topic, message, packet){
	console.log("message is "+ message);
	console.log("topic is "+ topic);
});


client.on("connect",function(){	
console.log("connected  "+ client.connected);

})
//handle errors
client.on("error",function(error){
console.log("Can't connect" + error);
process.exit(1)});
//publish
function publish(topic,msg,options){
console.log("publishing",msg);

if (client.connected == true){
	
client.publish(topic,msg,options);

}
count+=1;
if (count==2) //ens script
	clearTimeout(timer_id); //stop timer
	client.end();	
}

//////////////

var options={
retain:true,
qos:1};
var topic="testtopic";
var message="test message";
var topic_list=["topic2","topic3","topic4"];
var topic_o={"topic22":0,"topic33":1,"topic44":1};
console.log("subscribing to topics");
client.subscribe(topic,{qos:1}); //single topic
client.subscribe(topic_list,{qos:1}); //topic list
client.subscribe(topic_o); //object
var timer_id=setInterval(function(){publish(topic,message,options);},5000);
//notice this is printed even before we connect
console.log("end of script");
*/