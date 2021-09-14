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
import firebase, { db, ref, onValue, doc, getDocs, collection, onSnapshot, storeDB } from "../../firebase";
import { getDoc } from "@firebase/firestore";
let oldDB;

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

    useEffect(() => {
        console.log("[Home:useEffect] 컴포넌트가 화면에 나타남");
        // 초기값 설정
        setName(location.state.name);
        ttsTest(String(location.state.name)+"님 안녕하세요");

        oldDB = location.state.db;
        console.log("[Home:useEffect] oldDB :",oldDB);

        setTemp(location.state.db.sensor.hometemp.temp);
        setHumi(location.state.db.sensor.hometemp.humi);
        setW_icon(location.state.db.sensor.openweather.icon.substring(0,2));
        setWeather("날씨 : "+location.state.db.sensor.openweather.description+", "+location.state.db.sensor.openweather.temp+"°C")

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

    const docRef = doc(storeDB,"modes","1. 실내모드")
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("[Home:store listener] Document data:", docSnap.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("[Home:store listener] No such document!");
    }

    /*
    const docRef = collection(storeDB, "modes"); //.doc("1. 실내모드")
    docRef.get().then((doc) => {
        if (doc.exists) {
            console.log("[Home:store listener] Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("[Home:store listener] No such document!");
        }
    }).catch((error) => {
        console.log("[Home:store listener] Error getting document:", error);
    });
*/
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
        setWeather("날씨 : "+listenDescription+", "+listenWTemp+"°C")
        
        switch(listenAir) {
            case 1 : setDust("매우 좋음"); break;
            case 2 : setDust("좋음"); break;
            case 3 : setDust("보통"); break;
            case 4 : setDust("나쁨"); break;
            case 5 : setDust("매우 나쁨"); break;
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
        switch(num) {
            case 0 : {
                indoorMode ? setIndoorMode(false) : setIndoorMode(true); 
                setOutdoorMode(false);
                setEcoMode(false);
                setNightMode(false);
                console.log("[Home:onDoMode] indoorMode :", indoorMode);
                break;
            };
            case 1 : {
                setIndoorMode(false); 
                outdoorMode ? setOutdoorMode(false) : setOutdoorMode(true) ;
                setEcoMode(false);
                setNightMode(false);
                console.log("[Home:onDoMode] outdoorMode :", outdoorMode);
                break;
            };
            case 2 : {
                setIndoorMode(false); 
                setOutdoorMode(false);
                ecoMode ? setEcoMode(false) : setEcoMode(true);
                setNightMode(false);
                console.log("[Home:onDoMode] ecoMode :", ecoMode);
                break;
            };
            case 3 : {
                setIndoorMode(false);  
                setOutdoorMode(false);
                setEcoMode(false);
                nightMode ? setNightMode(false) : setNightMode(true);
                console.log("[Home:onDoMode] nightMode :", nightMode);
                break;
            };
            default : break;
        };
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
        history.push('/');
    }

    const onGotoMode = () => {
        console.log("[Home:onGotoMode] 모드 설정 페이지");
        //모드 설정 페이지
        //history.push('/');
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
                    뒤로가기
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
                                            추가
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            추가
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            추가
                                        </button>
                                    </td>
                                    <td>
                                        <button>
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