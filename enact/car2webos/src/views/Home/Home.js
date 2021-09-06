/* eslint-disable */
import { useState, Component } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FiChevronsLeft } from "react-icons/fi";
import { WiCloudy } from "react-icons/wi";
import { AiOutlinePlus } from "react-icons/ai";

import modeIcon from '../../../resources/webos_project_icon/removeLogo/star.png';
import indoorIcon from '../../../resources/webos_project_icon/removeLogo/indoor.png';
import outdoorIcon from '../../../resources/webos_project_icon/removeLogo/outdoor.png';
import ecoIcon from '../../../resources/webos_project_icon/removeLogo/eco_energy.png';
import nightIcon from '../../../resources/webos_project_icon/removeLogo/night.png';

import applianceIcon from '../../../resources/webos_project_icon/removeLogo/gear.png'
import airconIcon from '../../../resources/webos_project_icon/removeLogo/air_conditioner.png';
import lightIcon from '../../../resources/webos_project_icon/removeLogo/light.png';
import valveIcon from '../../../resources/webos_project_icon/removeLogo/valve.png';
import windowIcon from '../../../resources/webos_project_icon/removeLogo/window.png';

import "./Home.css"

var webOSBridge = new WebOSServiceBridge();
Component.componentDid

const Home = () => {
    const history = useHistory();
    const location = useLocation();
    const [temp, setTemp] = useState(24);
    const [humi, setHumi] = useState(70);
/*
    webOSBridge.onservicecallback = callback;

    function callback(msg){
        var response = JSON.parse(msg);
        let db = response.Response;
        console.log("db :",db);
        setTemp(db.hometemp.temp);
        setHumi(db.hometemp.humi);
    }
*/
/*
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
    const onTest = () => {
        //sendMqtt("webos.topic", "webos.smarthome", test);
    };
*/
    let test = "022222220";
    const name = location.state.name;

    const onGotoSignin = () => {
        history.push('/');
    }

    const onGotoMode = () => {
        console.log("모드 설정 페이지");
        //모드 설정 페이지
        //history.push('/');
    }

    const onGotoAppliance = () => {
        console.log("개별 가전 제어 페이지");
        //가전 제어 페이지
        //history.push('/');

        //firebase test
        console.log("firebase db test excuted");

        var url = 'luna://com.ta.car2webos.service/getDB';
        var params = JSON.stringify({
            "data":"getDB"
        });
      
        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = callback;   /////////////////////////////// 이것을 함수 밖 최상단에 두면 리스너를 만들 수 있을까?
        function callback(msg){
            var response = JSON.parse(msg);
            let db = response.Response;
            console.log("db :",db);
            setTemp(db.hometemp.temp);
            setHumi(db.hometemp.humi);
        }
        console.log("firebase db test end");   

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

    return(
        <div className="home">
            <div className="home__head">
                <button className="back-button" onClick={onGotoSignin}>
                    <FiChevronsLeft size="40" color="#000"/>
                </button>
                <p className="name">{location.state.name} 님 안녕하세요.</p>
                    <div className="temp">
                        <p>온도</p>
                        <progress value={temp} max="40"></progress>
                    </div>
                    <p className="temp-value">{temp}도</p>
                    <div className="hum">
                        <p>습도</p>
                        <progress value={humi} max="100"></progress>
                    </div>
                    <p className="hum-value">{humi}%</p>
                    <div className="weather-icon">
                        <WiCloudy size="130" color="#000"/>
                        <p>구름</p>
                    </div>
            </div>
            <br />
            <div className="home__box">
                <div className="mode">
                    <div className="mode__head">
                        <button onClick={onGotoMode}>
                            <img className="mode-icon" src={modeIcon} />
                            <p>모드</p>
                        </button>
                    </div>
                    <br />
                    <div className="mode__box">
                        <table>
                            <tr>
                                <td>
                                    <button>
                                        <img className="control-mode" src={indoorIcon} />
                                    </button>
                                    <p>실내 모드</p>
                                </td>
                                <td>
                                    <button>
                                        <img className="control-mode" src={outdoorIcon} />
                                    </button>
                                    <p>외출 모드</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button>
                                        <img className="control-mode" src={nightIcon} />
                                    </button>
                                    <p>슬립 모드</p>
                                </td>
                                <td>
                                    <button>
                                        <img className="control-mode" src={ecoIcon} />
                                    </button>
                                    <p>에코 모드</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="appliance">
                    <div className="appliance__head">
                        <button onClick={onGotoAppliance}>
                            <img className="appliance-icon" src={applianceIcon} />
                            <p>가전</p>
                        </button>
                    </div>
                    <br />
                    <div className="appliance__box">
                        <div >
                            <table>
                                <tr>
                                    <td>
                                        <button>
                                            <img className="control-appliance" src={airconIcon} />
                                        </button>
                                        <p>에어컨</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img className="control-appliance" src={lightIcon} />
                                        </button>
                                        <p>무드등</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img className="control-appliance" src={valveIcon} />
                                        </button>
                                        <p>가스밸브</p>
                                    </td>
                                    <td>
                                        <button>
                                            <img className="control-appliance" src={windowIcon} />
                                        </button>
                                        <p>창문</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
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