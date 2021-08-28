#!/usr/bin/env node
console.log("start");
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://rabbit:MQ321@211.179.42.130:5672', function(error0, connection) {
    console.log("try connect");
    if (error0) {
        throw error0;
    }
    console.log("after error0");
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var exchange = 'test321';
        var args = process.argv.slice(2);
        var key = (args.length > 0) ? args[0] : 'anonymous.info';
        var msg = args.slice(1).join(' ') || 'js_mqtt_test';

        channel.assertExchange(exchange, 'topic', {
            durable: false
        });
        
        channel.publish(exchange, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);
    });
    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});