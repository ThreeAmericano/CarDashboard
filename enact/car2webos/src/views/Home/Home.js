/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Home.css"

// Import Icon
import { FiChevronsLeft } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";

// 날씨
import sunny from '../../../resources/weather_image/drawable/sunny.png';
import littlecloudy from '../../../resources/weather_image/drawable/littlecloudy.png';
import cloudy from '../../../resources/weather_image/drawable/cloudy.png';
import darkcloudy from '../../../resources/weather_image/drawable/darkcloudy.png';
import rain from '../../../resources/weather_image/drawable/rain.png';
import rainsunny from '../../../resources/weather_image/drawable/rainsunny.png';
import thunder from '../../../resources/weather_image/drawable/thunder.png';
import snow from '../../../resources/weather_image/drawable/snow.png';
import fog from '../../../resources/weather_image/drawable/fog.png';

// 모드 + 가전
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

//import LS2Request from '@enact/webos/LS2Request';

var webOSBridge = new WebOSServiceBridge();
/*
var firebase = require("../../../node_modules/firebase");

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
let listenerData;

var dbRef = firebase.database().ref();
dbRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("[Service] listener :",data);
    console.log("[Service] listener :",data.smarthome.status);

    listenerData = data;

    //var url = 'luna://com.ta.car2webos.service/listener';
    //var params = JSON.stringify({
    //    "data": data 
    //});
    //service.call(url, params);
});
*/
const Home = () => {
    const history = useHistory();
    const location = useLocation();
    const [name, setName] = useState();
    const [temp, setTemp] = useState();
    const [humi, setHumi] = useState();
    const [weather, setWeather] = useState();
    const [w_icon,setW_icon] = useState();
    const [dust, setDust] = useState();

    const [indoorMode, setIndoorMode] = useState(false);
    const [outdoorMode, setOutdoorMode] = useState(false);
    const [ecoMode, setEcoMode] = useState(false);
    const [nightMode, setNightMode] = useState(false);
    
    const [aircon, setAircon] = useState(false);
    const [light, setLight] = useState(false);
    const [valve, setValve] = useState(false);
    const [window, setWindow] = useState(false);

    let smarthome = "";

	//const LS2 = new LS2Request();

    useEffect(() => {
        console.log("[Home] 컴포넌트가 화면에 나타남");
        // 초기값 설정
        setName(location.state.name);
        setTemp(location.state.temp);
        setHumi(location.state.humi);
        setW_icon(location.state.w_icon);
        setWeather("날씨 : "+location.state.w_description+", "+location.state.temp+"°C")

        smarthome = location.state.smarthome;
        if(Number(smarthome[0])>0) onDoMode(Number(smarthome[0])-1);
        else modeTurnOff;

        switch(location.state.air_level) {
            case 1 : setDust("매우 좋음"); break;
            case 2 : setDust("좋음"); break;
            case 3 : setDust("보통"); break;
            case 4 : setDust("나쁨"); break;
            case 5 : setDust("매우 나쁨"); break;
            default : break;
        }
        if(Number(smarthome[1]) < 2) {
            setAircon(Number(smarthome[1])?true:false);
        };
        if(Number(smarthome[3]) < 2) {
            setLight(Number(smarthome[3])?true:false);
        };
        if(Number(smarthome[7]) < 2) {
            setWindow(Number(smarthome[7])?true:false);
        };
        if(Number(smarthome[8]) < 2) {
            setValve(Number(smarthome[8])?true:false);
        };

        return() => {
            console.log("[Home] 컴포넌트가 화면에서 사라짐");
        };
    }, []);

    webOSBridge.onservicecallback = callback;  
    function callback(msg){
        var response = JSON.parse(msg);
        let db = response.Response;
        console.log("[Home] listener db :",db);
    }

/*
/////////////////////////////////////////////////////////// 리스너
    const listen = () => {
        setTemp(location.state.temp);
        setHumi(location.state.humi);
        setW_icon(location.state.w_icon);
        setWeather("날씨 : "+location.state.w_description+", "+location.state.temp+"°C")
        
        switch(location.state.air_level) {
            case 1 : setDust("매우 좋음"); break;
            case 2 : setDust("좋음"); break;
            case 3 : setDust("보통"); break;
            case 4 : setDust("나쁨"); break;
            case 5 : setDust("매우 나쁨"); break;
            default : break;
        }
    }
*/

    let test = "122222220";

    const modeTurnOff = () => {
        setIndoorMode(false);
        setOutdoorMode(false);
        setEcoMode(false);
        setNightMode(false);
    };

    const onDoMode = (num) => {
        console.log("[Home:onDoMode] num :", num);
        switch(num) {
            case 0 : {
                indoorMode ? setIndoorMode(false) : setIndoorMode(true); 
                setOutdoorMode(false);
                setEcoMode(false);
                setNightMode(false);
                console.log("[Home] indoorMode :", indoorMode);
                break;
            };
            case 1 : {
                setIndoorMode(false); 
                outdoorMode ? setOutdoorMode(false) : setOutdoorMode(true) ;
                setEcoMode(false);
                setNightMode(false);
                console.log("[Home] outdoorMode :", outdoorMode);
                break;
            };
            case 2 : {
                setIndoorMode(false); 
                setOutdoorMode(false);
                ecoMode ? setEcoMode(false) : setEcoMode(true);
                setNightMode(false);
                console.log("[Home] ecoMode :", ecoMode);
                break;
            };
            case 3 : {
                setIndoorMode(false);  
                setOutdoorMode(false);
                setEcoMode(false);
                nightMode ? setNightMode(false) : setNightMode(true);
                console.log("[Home] nightMode :", nightMode);
                break;
            };
            default : break;
        };
    };

    const onDoApplience = (num) => {
        console.log("[Home:onDoMode] num :", num);
        let command = "";
        switch(num) {
            case 0 : {
                modeTurnOff();
                if(aircon) {
                    setAircon(false);
                    command = "002222222";
                } else {
                    setAircon(true); 
                    command = "016222222";
                } 
                console.log("[Home] aircon :", aircon);
                //sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            case 1 : {
                modeTurnOff();
                if(light) {
                    setLight(false);
                    command = "022022222";
                } else {
                    setLight(true);
                    command = "022160222";
                } 
                console.log("[Home] light :", light);
                //sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            case 2 : {
                modeTurnOff();
                if(valve) {
                    setValve(false);
                    command = "022222220";
                } else {
                    setValve(true);
                    command = "022222221";
                } 
                console.log("[Home] valve :", valve);
                //sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            case 3 : {
                modeTurnOff();
                if(window) {
                    setWindow(false);
                    command = "022222202";
                } else {
                    setWindow(true);
                    command = "022222212";
                }
                console.log("[Home] window :", window);
                //sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            default : break;
        };
    };

    const onGotoSignin = () => {
        console.log("[Home] 뒤로 돌아가기");
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
      
        webOSBridge.onservicecallback = callback;   /////////////////////////////// 이것을 함수 밖 최상단에 두면 리스너를 만들 수 있을까?
        function callback(msg){
            var response = JSON.parse(msg);
            let db = response.Response;
            console.log("[Home] db :",db);
            setTemp(db.sensor.hometemp.temp);
            setHumi(db.sensor.hometemp.humi);
            smarthome = db.smarthome.status;
            
            if(Number(smarthome[1]) < 2) {
                setAircon(Number(smarthome[1])?true:false);
            };
            if(Number(smarthome[3]) < 2) {
                setLight(Number(smarthome[3])?true:false);
            };
            if(Number(smarthome[7]) < 2) {
                setWindow(Number(smarthome[7])?true:false);
            };
            if(Number(smarthome[8]) < 2) {
                setValve(Number(smarthome[8])?true:false);
            };
            if(Number(smarthome[0])>0) onDoMode(Number(smarthome[0])-1);
            else modeTurnOff;
        }
        webOSBridge.call(url, params);
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
                                "01" : sunny,
                                "02" : littlecloudy,
                                "03" : cloudy,
                                "04" : darkcloudy,
                                "09" : rain,
                                "10" : rainsunny,
                                "11" : thunder,
                                "13" : snow,
                                "50" : fog
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
                                    <button 
                                        onClick = {() => onDoMode(0)} 
                                        style={{
                                            backgroundColor : indoorMode ? 'blue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={indoorIcon} />
                                    </button>
                                    <p>실내 모드</p>
                                </td>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(1)} 
                                        style={{
                                            backgroundColor : outdoorMode ? 'blue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={outdoorIcon} />
                                    </button>
                                    <p>외출 모드</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(2)} 
                                        style={{
                                            backgroundColor : ecoMode ? 'blue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={ecoIcon} />
                                    </button>
                                    <p>에코 모드</p>
                                </td>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(3)} 
                                        style={{
                                            backgroundColor : nightMode ? 'blue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={nightIcon} />
                                    </button>
                                    <p>슬립 모드</p>
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
                                        <button 
                                            onClick = {() => onDoApplience(0)} 
                                            style={{
                                                backgroundColor : aircon ? 'blue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={airconIcon} />
                                        </button>
                                        <p>에어컨</p>
                                    </td>
                                    <td>
                                        <button 
                                            onClick = {() => onDoApplience(1)} 
                                            style={{
                                                backgroundColor : light ? 'blue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={lightIcon} />
                                        </button>
                                        <p>무드등</p>
                                    </td>
                                    <td>
                                        <button 
                                            onClick = {() => onDoApplience(2)} 
                                            style={{
                                                backgroundColor : valve ? 'blue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={valveIcon} />
                                        </button>
                                        <p>가스밸브</p>
                                    </td>
                                    <td>
                                        <button 
                                            onClick = {() => onDoApplience(3)} 
                                            style={{
                                                backgroundColor : window ? 'blue' : 'white'
                                            }}
                                        >
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