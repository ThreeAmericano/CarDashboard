/* eslint-disable */
import {useState } from "react";
import {useHistory, useLocation} from "react-router-dom";
import Button from "../../components/Button/Button";

import "./Home.css"

//var webOSBridge = new WebOSServiceBridge();
/*
const sendMqtt = (exchange, routingKey, msg) => {
    console.log("displayReponse function excuted");

    var url = 'luna://com.ta.car2webos.service/sendMqtt';
    var params = JSON.stringify({
        "exchange": exchange,
        "routingKey": routingKey,
        "msg":msg        
    });
  
    webOSBridge.call(url, params); 

    console.log("sendMqtt function end");
};
*/

const Home = () => {
    const history = useHistory();
    const location = useLocation();

    const [exchange, setExchange] = useState("");
    const [routingKey, setRoutingKey] = useState("");
    const [msg, setMsg] = useState("");

    const onExchangeChange = (event) => {
        const {target : {value}} = event;
        setExchange(value);
    };
    const onRoutingKeyChange = (event) => {
        const {target : {value}} = event;
        setRoutingKey(value);
    };
    const onMsgChange = (event) => {
        const {target : {value}} = event;
        setMsg(value);
    };
    const onSendMqtt = () => {
        //sendMqtt(exchange, routingKey, msg);
    };

    const onBack = () => {
        history.push('/');
    }; 

    return(
        <div className="home">
            <p>{location.state.name}</p>
            <input type="exchange" value={exchange} onChange={onExchangeChange} placeholder="exchange" required />
            <br />
            <input type="routingKey" value={routingKey} onChange={onRoutingKeyChange} placeholder="routingKey" required />
            <br />
            <input type="msg" value={msg} onChange={onMsgChange} placeholder="msg" required />
            <br />

            <Button value="MQTT SEND" onClick={onSendMqtt} />
            <br />
            <Button value="이전" onClick={onBack} />
        </div>
    );
}

export default Home;