/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Home.css"
import "../../../resources/css/sam_style.css"

// Import Icon
//import { FiChevronsLeft } from "react-icons/fi";
//import { AiOutlinePlus } from "react-icons/ai";

// 날씨

import sunny from '../../../resources/weather_icon/sunny.png';
import littlecloudy from '../../../resources/weather_icon/littlecloudy.png';
import cloudy from '../../../resources/weather_icon/cloudy.png';
import darkcloudy from '../../../resources/weather_icon/darkcloudy.png';
import rain from '../../../resources/weather_icon/rain.png';
import rainsunny from '../../../resources/weather_icon/rainsunny.png';
import thunder from '../../../resources/weather_icon/thunder.png';
import snow from '../../../resources/weather_icon/snow.png';
import fog from '../../../resources/weather_icon/fog.png';

// 모드 + 가전
import modeIcon from '../../../resources/smarthome_icon/star.png';
import indoorIcon from '../../../resources/smarthome_icon/indoor.png';
import outdoorIcon from '../../../resources/smarthome_icon/outdoor.png';
import ecoIcon from '../../../resources/smarthome_icon/eco_energy.png';
import nightIcon from '../../../resources/smarthome_icon/night.png';

import applianceIcon from '../../../resources/smarthome_icon/gear.png'
import airconIcon from '../../../resources/smarthome_icon/air_conditioner.png';
import lightIcon from '../../../resources/smarthome_icon/light.png';
import valveIcon from '../../../resources/smarthome_icon/valve.png';
import windowIcon from '../../../resources/smarthome_icon/window.png';

var webOSBridge = new WebOSServiceBridge();
import { db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot } from "../../firebase";

let oldDB;
let smarthome = "";
let mode = new Array(4);

let i = 0;
let pageNum = 0;

async function getStoreDB() {
    let i = 0;

    console.log("[Home:store start]")
    const querySnapshot = await getDocs(collection(storeDB, "modes"));
    console.log("[Home:store listener] querySnapshot :", querySnapshot);
    querySnapshot.forEach((doc) => {
        console.log("[Home:store listener]", doc.id, " => ", doc.data());
        
        mode[i] = String(i+1); // 모드 번호
        mode[i] += doc.data().airconEnable ? '1' : '0'; // 에어컨 상태 (0~1)
        mode[i] += String(doc.data().airconWindPower);  // 에어컨 강도 (0~9)
        mode[i] += doc.data().lightEnable ? '1' : '0';  // 전등 상태 (0~1)
        mode[i] += String(doc.data().lightBrightness);  // 전등 밝기 (1~9)
        mode[i] += String(doc.data().lightColor);       // 전등 색상 ()
        mode[i] += String(doc.data().lightMode-8);        // 전등 모드 (0~3)
        mode[i] += doc.data().windowOpen ? '1' : '0';   // 창문 상태
        mode[i] += doc.data().gasValveEnable ? '1' : '0';//가스 밸브 상태
        console.log("[Home:store] mode",i+1,":",mode[i]); //.toString()

        i++;
    });
};

if(pageNum == 1) getStoreDB();

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

    useEffect(() => {
        console.log("[Home:useEffect] 컴포넌트가 화면에 나타남");
        // 초기값 설정
        pageNum = 1;
        setName(location.state.name);
        ttsTest(String(location.state.name)+"님 안녕하세요");

        oldDB = location.state.db;
        console.log("[Home:useEffect] oldDB :",oldDB);

        setTemp(location.state.db.sensor.hometemp.temp);
        setHumi(location.state.db.sensor.hometemp.humi);
        setW_icon(location.state.db.sensor.openweather.icon.substring(0,2));
        setWeather(location.state.db.sensor.openweather.description+", "+location.state.db.sensor.openweather.temp+"°C")

        smarthome = location.state.db.smarthome.status;

        switch(location.state.db.sensor.openweather.air_level) {
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
            //setValve(Number(smarthome[8])?true:false);
            if(Number(smarthome[8])) {
                setValve(true);
                createToast("가스밸브가 잠기지 않았습니다.")                
            } else {
                setValve(false);
            }
        };

        if(Number(smarthome[0])>0) onDoMode(Number(smarthome[0])-1);
        else modeTurnOff;

        return() => {
            console.log("[Home:useEffect] 컴포넌트가 화면에서 사라짐");
        };
    }, []);

    const dbRef = ref(db);
    onValue(dbRef, (snapshot) => {
        let data = snapshot.val();
        console.log("[Home:listener] oldDB :", oldDB);
        console.log("[Home:listener] data :", data);
        console.log("[Home:listener] oldDB == data :", oldDB == data);

        if(oldDB.smarthome.status == data.smarthome.status && oldDB.sensor.openweather.update == data.sensor.openweather.update && oldDB.sensor.hometemp.humi == data.sensor.hometemp.humi && oldDB.sensor.hometemp.temp == data.sensor.hometemp.temp) {
            console.log("[Home:listener] 변화 없음");
        } else {
            console.log("[home : listener] old.smarthome.status :",oldDB.smarthome.status);
            console.log("[home : listener] listener.smarthome.status :",data.smarthome.status);
            oldDB = data;
            setUI(data);
        };
    });

    getStoreDB();
    
    const ttsTest = (ment) => {
        console.log("[Home:ttsTest] test start");
        console.log("[Home:ttsTest] ment :", ment);
    
        var url = 'luna://com.webos.service.tts/speak'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = {
            "text": ment, 
            "language": "ko-KR", 
            "clear":false
        };
          
        webOSBridge.call(url, JSON.stringify(params));

        console.log("[Home:ttsTest] test end");
    }
    
    
    const setUI = (data) => {
        console.log("[Home:setUI] 함수 실행 data :", data);
        let listenTemp = data.sensor.hometemp.temp;
        let listenHumi = data.sensor.hometemp.humi;

        let listenAir = data.sensor.openweather.air_level;
        let listenDescription = data.sensor.openweather.description;
        let listenIcon = data.sensor.openweather.icon.substring(0,2);
        let listenWTemp = data.sensor.openweather.temp;
        
        let listenHome = data.smarthome.status;
                     
        setTemp(listenTemp);
        setHumi(listenHumi);

        setW_icon(listenIcon);
        setWeather(listenDescription+", "+listenWTemp+"°C")
        
        switch(listenAir) {
            case 1 : setDust("매우좋음"); break;
            case 2 : setDust("좋음"); break;
            case 3 : setDust("보통"); break;
            case 4 : setDust("나쁨"); break;
            case 5 : setDust("매우나쁨"); break;
            default : break;
        }

        if(Number(listenHome[1]) < 2) {
            setAircon(Number(listenHome[1])?true:false);
        };
        if(Number(listenHome[3]) < 2) {
            setLight(Number(listenHome[3])?true:false);
        };
        if(Number(listenHome[7]) < 2) {
            setWindow(Number(listenHome[7])?true:false);
        };
        if(Number(listenHome[8]) < 2) {
            setValve(Number(listenHome[8])?true:false);
        };

        if(Number(listenHome[0])>0) onDoMode(Number(listenHome[0])-1);
        else modeTurnOff;
    };

    const modeTurnOff = () => {
        setIndoorMode(false);
        setOutdoorMode(false);
        setEcoMode(false);
        setNightMode(false);
    };

    const onDoMode = (num) => {
        console.log("[Home:onDoMode] num :", num);
        setIndoorMode(num==0?(indoorMode?false:true):false);
        setOutdoorMode(num==1?(outdoorMode?false:true):false);
        setEcoMode(num==2?(ecoMode?false:true):false);
        setNightMode(num==3?(nightMode?false:true):false);
        console.log("[Home:onDoMode] mode code :", mode[num]);
        sendMqtt("webos.topic", "webos.smarthome.info", mode[num]);
        /*
        switch(num) {
            case 0 : {
                indoorMode ? setIndoorMode(false) : setIndoorMode(true); 
                setOutdoorMode(false);
                setEcoMode(false);
                setNightMode(false);
                console.log("[Home:onDoMode] indoorMode button :", indoorMode);
                console.log("[Home:onDoMode] indoorMode code :", mode[0]);
                //sendMqtt("webos.topic", "webos.smarthome.info", mode[0]);
                break;
            };
            case 1 : {
                setIndoorMode(false); 
                outdoorMode ? setOutdoorMode(false) : setOutdoorMode(true) ;
                setEcoMode(false);
                setNightMode(false);
                console.log("[Home:onDoMode] outdoorMode button :", outdoorMode);
                console.log("[Home:onDoMode] outdoorMode code :", mode[1]);
                //sendMqtt("webos.topic", "webos.smarthome.info", mode[1]);
                break;
            };
            case 2 : {
                setIndoorMode(false); 
                setOutdoorMode(false);
                ecoMode ? setEcoMode(false) : setEcoMode(true);
                setNightMode(false);
                console.log("[Home:onDoMode] ecoMode button :", ecoMode);
                console.log("[Home:onDoMode] ecoMode code :", mode[2]);
                //sendMqtt("webos.topic", "webos.smarthome.info", mode[2]);
                break;
            };
            case 3 : {
                setIndoorMode(false);  
                setOutdoorMode(false);
                setEcoMode(false);
                nightMode ? setNightMode(false) : setNightMode(true);
                console.log("[Home:onDoMode] nightMode button :", nightMode);
                console.log("[Home:onDoMode] nightMode code :", mode[3]);
                //sendMqtt("webos.topic", "webos.smarthome.info", mode[4]);
                break;
            };
            default : break;
        };
        */

    };

    const onDoApplience = (num) => {
        console.log("[Home:onDoApplience] num :", num);
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
                console.log("[Home:onDoApplience] aircon :", aircon);
                sendMqtt("webos.topic", "webos.smarthome.info", command);
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
                console.log("[Home:onDoApplience] light :", light);
                sendMqtt("webos.topic", "webos.smarthome.info", command);
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
                console.log("[Home:onDoApplience] valve :", valve);
                sendMqtt("webos.topic", "webos.smarthome.info", command);
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
                console.log("[Home:onDoApplience] window :", window);
                sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            default : break;
        };
    };

    const onGotoSignin = () => {
        console.log("[Home:onGotoSignin] 뒤로 돌아가기");
        pageNum = 0;
        history.push('/');
    }

    const onGotoMode = () => {
        console.log("[Home:onGotoMode] 모드 설정 페이지");
        pageNum = 2;
        //모드 설정 페이지
        history.push({
            pathname: '/mode',
            state: {
                'name' : name,
                'db' : oldDB
            }
        });
    }

    const onGotoAppliance = () => {
        console.log("[Home:onGotoAppliance] 개별 가전 제어 페이지");
        //가전 제어 페이지
        //history.push('/');
/*
        //firebase test
        console.log("[Home:onGotoAppliance] firebase db test excuted");

        var url = 'luna://com.ta.car2smarthome.service/getDB';
        var params = JSON.stringify({
            "data":"getDB"
        });
      
        webOSBridge.onservicecallback = callback;
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
*/
    };
    
    const sendMqtt = (exchange, routingKey, msg) => {
        console.log("[Home:sendMqtt] displayReponse function excuted");
    
        var url = 'luna://com.ta.car2smarthome.service/sendMqtt';
        var params = JSON.stringify({
            "exchange": exchange,
            "routingKey": routingKey,
            "msg":msg        
        });
      
        webOSBridge.call(url, params); 
    
        console.log("[Home:sendMqtt] sendMqtt function end");
    };

    function createToast(ment) {
        console.log("[Home:createToast] ment :", ment);

        var url = 'luna://com.webos.notification/createToast';
        var params = {
            "sourceId":"com.ta.car2smarthome",
            "message":String(ment)
        };
        webOSBridge.call(url, JSON.stringify(params));

        webOSBridge.onservicecallback = toastCallback;
        function toastCallback(msg){
            var response = JSON.parse(msg); 
            console.log("[SignIn:createToast callback] response :", response);
        }
    }
    //<FiChevronsLeft size="40" color="#000"/>
    //<AiOutlinePlus size="130" color="#000" />
    
    return(
        <div className="home">
            <audio id="tts">
                <source id="tts_source" src="" type="audio/mp3" />
            </audio>
            <div className="home__head">
                <button className="back-button" onClick={onGotoSignin}>
                    <span class="material-icons">reply</span>
                </button>
                <p className="name">
                    <span className="name_top">{name}님,</span>
                    <p className="name_small">안녕하세요.</p>
                </p>
        
                <p className="home_sensor_data temp-value">
                    <span class="material-icons">thermostat</span>
                    {temp}℃
                </p>
                <div className="temp">
                    <progress value={temp} max="40"></progress>
                </div>
        
                <p className="home_sensor_data hum-value">
                    <span class="material-icons">water_drop</span>
                    {humi}%
                </p>
                <div className="hum">
                    <progress value={humi} max="100"></progress>
                </div>
        
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
                </div>
                <div className="weather-description">
                    <span class="weather-icon__weather">{weather}</span> <br/>
                    <span class="weather-icon__airlevel">미세먼지: {dust}</span>
                </div>
            </div>
            <br />
        
            <div className="home__box">
                <div className="mode">
                    <div className="mode__head">
                        <button onClick={onGotoMode}>
                            <img className="menu-icon" src={modeIcon} />
                            <p className="menu_title">모드</p>
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
                                            backgroundColor : indoorMode ? 'cornflowerblue' : 'white'
                                        }} >
                                        <img className="control-mode" src={indoorIcon} style={{
                                            filter : indoorMode ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : indoorMode ? 'white' : 'black'
                                        }} >
                                            실내 모드
                                        </p>
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(1)} 
                                        style={{
                                            backgroundColor : outdoorMode ? 'cornflowerblue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={outdoorIcon} style={{
                                            filter : outdoorMode ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : outdoorMode ? 'white' : 'black'
                                        }} >
                                            외출 모드
                                        </p>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(2)} 
                                        style={{
                                            backgroundColor : ecoMode ? 'cornflowerblue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={ecoIcon} style={{
                                            filter : ecoMode ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : ecoMode ? 'white' : 'black'
                                        }} >
                                            에코 모드
                                        </p>
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(3)} 
                                        style={{
                                            backgroundColor : nightMode ? 'cornflowerblue' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={nightIcon} style={{
                                            filter : nightMode ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : nightMode ? 'white' : 'black'
                                        }} >
                                            슬립 모드
                                        </p>
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="appliance">
                    <div className="appliance__head">
                        <button onClick={onGotoAppliance}>
                            <img className="menu-icon" src={applianceIcon} />
                            <p className="menu_title">가전</p>
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
                                                backgroundColor : aircon ? 'cornflowerblue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={airconIcon} style={{
                                                filter : aircon ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : aircon ? 'white' : 'black'
                                        }} >
                                            에어컨
                                        </p>
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick = {() => onDoApplience(1)} 
                                            style={{
                                                backgroundColor : light ? 'cornflowerblue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={lightIcon} style={{
                                                filter : light ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : light ? 'white' : 'black'
                                        }} >
                                            무드등
                                        </p>
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick = {() => onDoApplience(2)} 
                                            style={{
                                                backgroundColor : valve ? 'cornflowerblue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={valveIcon} style={{
                                                filter : valve ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : valve ? 'white' : 'black'
                                        }} >
                                            가스밸브
                                        </p>
                                        </button>
                                    </td>
                                    <td>
                                        <button 
                                            onClick = {() => onDoApplience(3)} 
                                            style={{
                                                backgroundColor : window ? 'cornflowerblue' : 'white'
                                            }}
                                        >
                                            <img className="control-appliance" src={windowIcon} style={{
                                                filter : window ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : window ? 'white' : 'black'
                                        }} >
                                            창문
                                        </p>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <button class="button">
                                            추가
                                        </button>
                                    </td>
                                    <td>
                                        <button class="button">
                                            추가
                                        </button>
                                    </td>
                                    <td>
                                        <button class="button">
                                            추가
                                        </button>
                                    </td>
                                    <td>
                                        <button class="button">
                                            추가
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