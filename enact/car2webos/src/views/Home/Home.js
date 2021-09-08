/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Home.css"

// Import Icon
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

import sunny from '../../../resources/weather_image/drawable/sunny.png';
import littlecloudy from '../../../resources/weather_image/drawable/littlecloudy.png';
import cloudy from '../../../resources/weather_image/drawable/cloudy.png';
import darkcloudy from '../../../resources/weather_image/drawable/darkcloudy.png';
import rain from '../../../resources/weather_image/drawable/rain.png';
import rainsunny from '../../../resources/weather_image/drawable/rainsunny.png';
import thunder from '../../../resources/weather_image/drawable/thunder.png';
import snow from '../../../resources/weather_image/drawable/snow.png';
import fog from '../../../resources/weather_image/drawable/fog.png';


var webOSBridge = new WebOSServiceBridge();

const Home = () => {
    const history = useHistory();
    const location = useLocation();
    const [name, setName] = useState();
    const [temp, setTemp] = useState();
    const [humi, setHumi] = useState();
    const [weather, setWeather] = useState();
    const [w_icon,setW_icon] = useState();
    const [dust, setDust] = useState();

    useEffect(() => {
        console.log("[Home] 컴포넌트가 화면에 나타남");
        // 초기값 설정
        setName(location.state.name);
        setTemp(location.state.temp);
        setHumi(location.state.humi);
        setW_icon(location.state.w_icon);
        setWeather("날씨 : "+location.state.w_description+" "+location.state.temp+"°C")
        
        switch(location.state.air_level) {
            case 1 : setDust("매우 좋음"); break;
            case 2 : setDust("좋음"); break;
            case 3 : setDust("보통"); break;
            case 4 : setDust("나쁨"); break;
            case 5 : setDust("매우 나쁨"); break;
            default : break;
        }

        return() => {
            console.log("[Home] 컴포넌트가 화면에서 사라짐");
        };
    }, []);
/*
    webOSBridge.onservicecallback = callback;

    function callback(msg){
        var response = JSON.parse(msg);
        let db = response.Response;
        console.log("[Home] db :",db);
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
    let test = "122222220";

    const onGotoSignin = () => {
        history.push('/');
    }

    const onGotoMode = () => {
        console.log("[Home] 모드 설정 페이지");
        //모드 설정 페이지
        //history.push('/');
    }

    const onGotoAppliance = () => {
        console.log("[Home] 개별 가전 제어 페이지");
        //가전 제어 페이지
        //history.push('/');

        //firebase test
        console.log("[Home] firebase db test excuted");

        var url = 'luna://com.ta.car2webos.service/getDB';
        var params = JSON.stringify({
            "data":"getDB"
        });
      
        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = callback;   /////////////////////////////// 이것을 함수 밖 최상단에 두면 리스너를 만들 수 있을까?
        function callback(msg){
            var response = JSON.parse(msg);
            let db = response.Response;
            console.log("[Home] db :",db);
            setTemp(db.hometemp.temp);
            setHumi(db.hometemp.humi);
        }
        console.log("[Home] firebase db test end");   
    };
    
    const sendMqtt = (exchange, routingKey, msg) => {
        console.log("[Home] displayReponse function excuted");
    
        var url = 'luna://com.ta.car2webos.service/sendMqtt';
        var params = JSON.stringify({
            "exchange": exchange,
            "routingKey": routingKey,
            "msg":msg        
        });
      
        webOSBridge.call(url, params); 
    
        console.log("[Home] sendMqtt function end");
    };
//<WiCloudy size="130" color="#000"/>
    return(
        <div className="home">
            <div className="home__head">
                <button className="back-button" onClick={onGotoSignin}>
                    <FiChevronsLeft size="40" color="#000"/>
                </button>
                <p className="name">{name} 님 안녕하세요.</p>
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
                        <img className="w_icon" src = {
                            {
                                "01d" : sunny,
                                "02d" : littlecloudy,
                                "03d" : cloudy,
                                "04d" : darkcloudy,
                                "09d" : rain,
                                "10d" : rainsunny,
                                "11d" : thunder,
                                "13d" : snow,
                                "50d" : fog
                            }[w_icon]
                        } />
                        <br />
                        <p>{weather}</p>
                        <br />
                        <p>미세먼지 : {dust}</p>
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
                                    <button onClick={sendMqtt("webos.topic","webos.smarthome.info", test)}>
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