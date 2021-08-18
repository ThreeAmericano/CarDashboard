
const amqp = require('amqplib/callback_api');

//import amqp from 'amqplib/callback_api'

function mqttTest() {
    var url = 'com.ta.car2webos/mqtt';

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
            var key = (args.length > 0) ? args[0] : 'amqtest';
            var msg = args.slice(1).join(' ') || 'enactjs_mqtt_test';

            channel.assertExchange(exchange, {
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
};

//export {mqttTest};
