/* eslint-disable */
import {useState} from "react";
import {useHistory, useLocation} from "react-router-dom";
import Button from "../../components/Button/Button";
import { FiChevronsLeft } from "react-icons/fi";
import { WiCloudy } from "react-icons/wi";

import modeIcon from '../../../resources/webos_project_icon/removeLogo/gear.png';
import applianceIcon from '../../../resources/webos_project_icon/removeLogo/eco_energy.png';
import "./Home.css"

var webOSBridge = new WebOSServiceBridge();

const Home = () => {
    const history = useHistory();
    const location = useLocation();

    const [exchange, setExchange] = useState("");
    const [routingKey, setRoutingKey] = useState("");
    const [msg, setMsg] = useState("");

    let test = "022222220";

    const onGotoSignin = () => {
        history.push('/');
    }

    const onGotoMode = () => {
        //history.push('/');
    }

    const onGotoAppliance = () => {
        //history.push('/');
    }
    
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
        sendMqtt(exchange, routingKey, msg);
    };
    const onTest = () => {
        sendMqtt("webos.topic", "webos.smarthome", test);
    };

    // 다음에는 grid 태그로 화면 구성하기
    return(
        <div className="home">
            <div className="home__head">
                <button onClick={onGotoSignin}>
                    <FiChevronsLeft />
                </button>
                <p className="name">{location.state.name}</p>
                <div className="weather">
                    <div className="temp">
                        <p>온도</p>
                        <progress value="24.5" max="40"></progress>
                    </div>
                    <div className="hum">
                        <p>습도</p>
                        <progress value="70" max="100"></progress>
                    </div>
                    <div className="weather-icon">
                        <WiCloudy />
                    </div>
                </div>
            </div>
            <div className="home__box">
                <div className="mode">
                    <div className="mode__head">
                        <button onClick={onGotoMode}>
                            <img className="Mode-icon" src={modeIcon} />
                            <p>모드</p>
                        </button>
                    </div>
                    <div className="mode__box">
                        <table>
                            <tr>
                                <td>
                                    <button>
                                        <img src={modeIcon} />
                                    </button>
                                    <p>ㅇㅇ모드</p>
                                </td>
                                <td>
                                    <button>
                                        <img src={modeIcon} />
                                    </button>
                                    <p>ㅇㅇ모드</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button>
                                        <img src={modeIcon} />
                                    </button>
                                    <p>ㅇㅇ모드</p>
                                </td>
                                <td>
                                    <button>
                                        <img src={modeIcon} />
                                    </button>
                                    <p>ㅇㅇ모드</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="appliance">
                    <div className="appliance__head">
                        <button onClick={onGotoAppliance}>
                            <img className="appliance-icon" src={applianceIcon} />
                            <p>모드</p>
                        </button>
                    </div>
                    <div className="appliance__box">
                        <div >
                            <table>
                                <tr>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img src={applianceIcon} />
                                        </button>
                                        <p>가전</p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

/*
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
            <br />
            <Button value="가전 off" onClick={onTest} />
        </div>
*/