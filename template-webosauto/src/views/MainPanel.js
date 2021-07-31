import Button from '@enact/sandstone/Button';
import Switch from '@enact/sandstone/Switch';
import kind from '@enact/core/kind';
import {Panel, Header} from '@enact/sandstone/Panels';
import {useState} from 'react';

const MainPanel = kind({
	name: 'MainPanel',
	render: (props) => (
		<Panel {...props}>
			<view>
				<table border = "1">
					<thead>
						<tr align="center">
							<th>집</th>
							<th>날씨</th>
							<th>모드</th>
						</tr>
					</thead>
					<tbody>
						<td>
							<table>
								<tr align="center" border = "0">
									<tr>
										00°C / 00%
									</tr>
									<tr>
										가스밸브
										<Switch />
									</tr>
									<tr>
										에어컨
										<Switch />
									</tr>
									<tr>
										창문
										<Switch />
									</tr>
								</tr>
							</table>
						</td>
						<td>
							<table>
								<tr align="center" border = "0">
									<tr>
										00°C / 00%
									</tr>
									<tr>
										<BtnClick>
										</BtnClick>
									</tr>
									<tr>
										<TextOnOff>
										</TextOnOff>
									</tr>
									<tr>
										<MqttTest>
										</MqttTest>
									</tr>
								</tr>
							</table>
						</td>
						<td>
							<table>
								<tr>
									<Button>
										출근
									</Button>
								</tr>
								<tr>
									<Button>
										퇴근
									</Button>
								</tr>
								<tr>
									<Button>
										청소
									</Button>
								</tr>
								<tr>
									<Button>
										환기
									</Button>
								</tr>
							</table>
						</td>
					</tbody>
				</table>
			</view>
		</Panel>
	)
});

function TextOnOff() { //스위치 on off에 따라 옆에 텍스트로 상태 나타내줌
	let [isSelected, isSelectedChange] = useState(false);
	//isSelected : 현재 작성된 값 / isSelectedChange(변경할 값)
	return (
	   <>
		<div>
			<span>
				<Switch onToggle={
					(e)=>{
						isSelectedChange(e.selected); 
						console.log(isSelected)
					}
				}/>
			</span>
			<span>
			{  
				isSelected === true 
				? <span>Turn On</span> 
				: <span>Turn Off</span>
			}
			</span>
		</div>
	   </>
	);
}
function BtnClick() { // 버튼 클릭 시 버튼 안의 값을 on <-> off 변경
	//btn : 현재 btn 값 / setBtn(변결할 btn 값)
	let [btn, setBtn] = useState(0);
	if(btn === 0) setBtn("off");
	const onOff = () => {
		if(btn === "off") setBtn("on");
		else if(btn === "on") setBtn("off");
		else setBtn("on")
	}
	return(
		<>
			<div>
				<span>
					{/* onClick={onOff} : 버튼 클릭 시 onOff 함수 사용 */}
					<Button onClick={onOff}>{btn}</Button>
				</span>
			</div>
		</>
	);
}

//let amqp = require('amqplib/callback_api');

function MqttTest() { // MQTT Test
	
	const mqtt = require('mqtt');
	const options = {
		//host: '211.179.42.130',
		port: 5672,
		protocol: 'mqtt',
		username:"rabbit",
		password:"MQ321",
		encoding: 'utf8'
	};		
	const client = mqtt.connect("https://211.179.42.130", options);
	//console.log("들어가요?"); 
	client.on('connect', function () {
		client.subscribe('enactMQTT', function (err) {
			if (!err) { 
				client.publish('enactMQTT', 'Hello mqtt'); 
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
	/*
	amqp.connect('amqp://rabbit:MQ321@211.179.42.130:5672', function(error0, connection) {
		if (error0) {
			throw error0;
		}

		connection.createChannel(function(error1, channel) {
			if (error1) {
				throw error1;
			}

			//queue name
			let queue = 'enactMQTT';

			
		 	//queue가 없으면 만들어줌
			//durable : true -> queue 데이터를  rabbitmq가 재시작해도 가지고 있음(소비하기전까지)
			
			channel.assertQueue(queue, {
				durable: true
			});
			setInterval(sendToQueue, 1000, channel, queue)
		});

		setTimeout(function() {
			connection.close();
			process.exit(0);
		}, 50000);
	});
	function sendToQueue(channel, queue){
		let msg = 'Hello World! transDate:' + new Date();
		channel.sendToQueue(queue, Buffer.from(msg));
		console.log(" [x] Sent %s", msg);
	}
	*/
}

export default MainPanel;