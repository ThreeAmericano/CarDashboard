/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Home.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"

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

import scheduleIcon from '../../../resources/smarthome_icon/schedule.png'
import applianceIcon from '../../../resources/smarthome_icon/gear.png'
import airconIcon from '../../../resources/smarthome_icon/air_conditioner.png';
import lightIcon from '../../../resources/smarthome_icon/light.png';
import valveIcon from '../../../resources/smarthome_icon/valve.png';
import windowIcon from '../../../resources/smarthome_icon/window.png';

var webOSBridge = new WebOSServiceBridge();
import { firebase, firebaseConfig, home_db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc, deleteDoc } from "../../firebase";

let oldDB;  // DB 이전 상태와 비교하여 다르면 동작하도록 하기 위함
let smarthome = "";
// let listendarkMode; 
let uid;
let mode = new Array(4);

let pageNum = 0;

async function getStoreDB() {
    try {
        let i = 0;

        console.log("[Home:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "modes"));
        querySnapshot.forEach((doc) => {
            //console.log("[Home:store listener]", doc.id, " => ", doc.data());
            
            mode[i] = String(i+1); // 모드 번호
            mode[i] += doc.data().airconEnable ? '1' : '0';  // 에어컨 상태 (0~1)
            mode[i] += String(doc.data().airconWindPower);   // 에어컨 강도 (0~9)
            mode[i] += doc.data().lightEnable ? '1' : '0';   // 무드등 상태 (0~1)
            mode[i] += String(doc.data().lightBrightness);   // 무드등 밝기 (1~9)
            mode[i] += String(doc.data().lightColor);        // 무드등 색상 ()
            mode[i] += String(doc.data().lightMode);       // 무드등 모드 (0~3)
            mode[i] += doc.data().windowOpen ? '1' : '0';    // 창문 상태
            mode[i] += doc.data().gasValveEnable ? '1' : '0';// 가스 밸브 상태
            console.log("[Home:store] mode",i+1,":",mode[i]);
            i++;
        });
    } catch(e) {
        console.log("[Home:getStoreDB] error : ", e);
    };
};

async function getUIDB() {
    try {
        let i = 0;

        console.log("[Home:store UI start]")
        const querySnapshot = await getDocs(collection(storeDB,"uiux_preset"));
        querySnapshot.forEach((doc) => {
            if(String(doc.id) == String(uid)){
                console.log("[Home:store UI listener]", doc.id, " => ", doc.data());
                //listendarkMode = doc.data();
                return doc.data();
            }
        });
    } catch(e) {
        console.log("[Home:getStoreDB] error : ", e);
    };
};

if(pageNum == 1) getStoreDB();
let home_dbRef;

const Home = ({setDarkMode, darkMode}) => {
    const history = useHistory();
    const location = useLocation();

    const [homeListen, setHomeListen]  = useState();
    
    const [name, setName] = useState();         // 로그인한 사용자 이름
    const [temp, setTemp] = useState();         // 스마트홈 센서 측정 온도
    const [humi, setHumi] = useState();         // 스마트홈 센서 측정 습도
    const [weather, setWeather] = useState();   // Open Weather Map API 날씨 정보
    const [w_icon, setW_icon] = useState();     // Open Weather Map API 날씨 아이콘
    const [dust, setDust] = useState();         // Open Weather Map API 대기질

    const [indoorMode, setIndoorMode] = useState();     // 실내 모드 아이콘
    const [outdoorMode, setOutdoorMode] = useState();   // 외출 모드 아이콘
    const [sleepMode, setSleepMode] = useState();       // 슬립 모드 아이콘
    const [ecoMode, setEcoMode] = useState();           // 에코 모드 아이콘
    
    const [aircon, setAircon] = useState(); // 에어컨 아이콘
    const [light, setLight] = useState();   // 무드등 아이콘    
    const [valve, setValve] = useState();   // 가스밸브 아이콘
    const [window, setWindow] = useState(); // 창문 아이콘

    let prevHome = [false, false, false, false];    // 가전 이전 상태

    useEffect(() => {
        console.log("[Home:useEffect] useEffect 실행");
        //firebase.deleteApp();
        //firebase.initializeApp(firebaseConfig);
        home_dbRef = ref(home_db);
        getHomeRTDB();
        // 초기값 설정
        pageNum = 1;

        uid = location.state.UID;  
        //getUIDB()
        //    .then((res) => setDarkMode(res=="darkmode"?true:false));
        //console.log("[Home:useEffect] listendarkMode :",listendarkMode);
        //setDarkMode(listendarkMode=="darkmode"?true:false);/////////////////////////////////////////

        stopAssistant();    // 음성인식 설정
        startAssistant();
        GetState();
        
        setName(location.state.name);
        
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
            prevHome[0] = (Number(smarthome[1]))?true:false;
        };
        if(Number(smarthome[3]) < 2) {
            setLight(Number(smarthome[3])?true:false);
            prevHome[1] = (Number(smarthome[3]))?true:false;
        };
        if(Number(smarthome[7]) < 2) {
            setWindow(Number(smarthome[7])?true:false);
            prevHome[2] = (Number(smarthome[7]))?true:false;
        };
        if(Number(smarthome[8]) < 2) {
            //setValve(Number(smarthome[8])?true:false);
            prevHome[3] = (Number(smarthome[8]))?true:false;
            if(Number(smarthome[8])) {
                setValve(true);
                createToast("가스밸브가 잠기지 않았습니다.")                
            } else {
                setValve(false);
            }
        };

        if(Number(smarthome[0])>0){
            modeTurnOff();
            switch(Number(smarthome[0])-1) {
                case 0 : {setIndoorMode(true); break;}
                case 1 : {setOutdoorMode(true); break;}
                case 2 : {setSleepMode(true); break;}
                case 3 : {setEcoMode(true); break;}
                default : {
                    console.log("[Home:useEffect] Number(smarthome[0])-1 switch default :", Number(smarthome[0])-1);
                    modeTurnOff();
                    break;
                }
            };
        } else modeTurnOff();
        
        return() => {
            stopAssistant(); // 음성인식 종료
            //firebase.deleteApp(home_dbRef);
            console.log("[Home:useEffect] 종료 pageNum :", pageNum);
        };
        
    }, []);

    const getHomeRTDB = () => {
        onValue(home_dbRef, (snapshot) => {
            let data = snapshot.val();

            if(oldDB.smarthome.status == data.smarthome.status && oldDB.sensor.openweather.update == data.sensor.openweather.update && oldDB.sensor.hometemp.humi == data.sensor.hometemp.humi && oldDB.sensor.hometemp.temp == data.sensor.hometemp.temp && oldDB.server.notification == data.server.notification) {
                console.log("[Home:listener] 변화 없음");
            } else {
                console.log("[Home:listener] 변화 있음");
                if(oldDB.server.notification != data.server.notification) {
                    if(data.server.notification != "none") {
                        createToast(data.server.notification);
                        tts(data.server.notification);
                    }
                };
                if(pageNum == 1) {
                    console.log("[Home:listener] setUI 실행");
                    //setUI(data);
                    setHomeListen(data);///////////////////////////////////////////////////////////////////////////
                };
                oldDB = data;
            };
        });
    };

    useEffect(() => {////////////////////////////////////////////////////////////////////////
        console.log("[Home:homeListen useEffect]")
        if(homeListen) {
            console.log("[Home:homeListen useEffect] homeListen :", homeListen)
            setUI(homeListen);
        }
    },[homeListen])

    if(pageNum == 1) {
        getHomeRTDB();
        //getUIDB()
        //    .then((res) => setDarkMode(res=="darkmode"?true:false));
        // listendarkMode = getUIDB();
        // console.log("[Home:useEffect] listendarkMode :",listendarkMode);
        // setDarkMode(listendarkMode=="darkmode"?true:false);
    };

    const startAssistant = () => {  // 음성인식 설정
        let url = 'luna://com.webos.service.ai.voice/start';

        let params = {
            "mode":"continuous",
            "keywordDetect":"true",
        };

        console.log("[home:startAssistant] before startAssistant call");
        webOSBridge.call(url, JSON.stringify(params));
        console.log("[home:startAssistant] after startAssistant call");
    };

    const GetState = () => {  // 음성인식 설정
        var url = 'luna://com.webos.service.ai.voice/getResponse';

        var params = {
            "subscribe": true
        };

        console.log("[home:GetState] before GetState call");
        webOSBridge.call(url, JSON.stringify(params));
        console.log("[home:GetState] after GetState call");
    };

    const stopAssistant = () => {  // 음성인식 설정
        let url = 'luna://com.webos.service.ai.voice/stop';

        let params = {
        };

        console.log("[home:stopAssistant] before stopAssistant call");
        webOSBridge.call(url, JSON.stringify(params));
        console.log("[home:stopAssistant] after stopAssistant call");
    };
    
    const tts = (ment) => {
        console.log("[Home:tts] ment :", ment);
    
        var url = 'luna://com.webos.service.tts/speak'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = {
            "text": ment, 
            "language": "ko-KR", 
            "clear":false
        };
          
        webOSBridge.call(url, JSON.stringify(params));
    }
    
    
    let setUI = (data) => { ///////////////////////////////////////////////////////////////////////// const를 let으로 해볼까?
        /* //////////////////////////////////////////////////////////////////////////////////////////// setState 사용에 문제가 있을수도 있다.
        https://berkbach.com/setstate-%ED%8C%8C%ED%97%A4%EC%B9%98%EA%B8%B0-28b207fc81df
        https://soldonii.tistory.com/103
        https://soldonii.tistory.com/112
        */
        console.log("[Home:setUI] 함수 실행 data :", data);

        let listenTemp = data.sensor.hometemp.temp;
        let listenHumi = data.sensor.hometemp.humi;

        let listenAir = data.sensor.openweather.air_level;
        let listenDescription = data.sensor.openweather.description;
        let listenIcon = data.sensor.openweather.icon.substring(0,2);
        let listenWTemp = data.sensor.openweather.temp;
        
        let listenHome = data.smarthome.status;

        console.log("[Home:setUI] listenHome :",listenHome);
        
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
        if(Number(listenHome[1]) != 2) {
            let onOff = Number(listenHome[1])==1?true:false;
            console.log("[Home:setUI aircon] prevHome[0], onOff :",prevHome[0],",",onOff);
            if(prevHome[0] != onOff) {
                prevHome[0] = onOff;
                setAircon(onOff);
                /////////////////////////////////////////////////////////////////////////////////////////////////// setState가 비동기라는데 값을 확인해볼까?
                console.log("[Home:setUI] aircon, onOff :",aircon,onOff);
                /////////////////////////////////////////////////////////////////////////////////////////////////// 
                //setAircon(() => onOff);
                let comment = onOff ? "에어컨이 켜졌습니다" : "에어컨이 꺼졌습니다";
                //createToast(comment);
                tts(comment);
            };
            console.log("[Home:setUI] aircon :",aircon);
        };
        if(Number(listenHome[3]) != 2) {
            let onOff = Number(listenHome[3])==1?true:false;
            console.log("[Home:setUI] prevHome[1], onOff :",prevHome[1],",",onOff);
            if(prevHome[1] != onOff) {
                prevHome[1] = onOff;
                setLight(onOff);
                let comment = (onOff) ? "무드등이 켜졌습니다" : "무드등이 꺼졌습니다";
                //createToast(comment);
                tts(comment);
            };
        };
        if(Number(listenHome[7]) != 2) {
            let onOff = Number(listenHome[7])==1?true:false;
            console.log("[Home:setUI] prevHome[2], onOff :",prevHome[2],",",onOff);
            if(prevHome[2] != onOff) {
                prevHome[2] = onOff;
                setWindow(onOff);
                let comment = (onOff) ? "창문이 열렸습니다" : "창문이 닫혔습니다";
                //createToast(comment);
                tts(comment);
            };
        };
        if(Number(listenHome[8]) != 2) {
            let onOff = Number(listenHome[8])==1?true:false;
            console.log("[Home:setUI] prevHome[3], onOff :",prevHome[3],",",onOff);
            if(prevHome[3] != onOff) {
                prevHome[3] = onOff;
                setValve(onOff);
                let comment = (onOff) ? "가스밸브가 열렸습니다" : "가스밸브가 닫혔습니다";
                //createToast(comment);
                tts(comment);
            };
        };
        if(Number(listenHome[0])>0){
            modeTurnOff();
            switch(Number(listenHome[0])-1) {
                case 0 : {setIndoorMode(true); break;}
                case 1 : {setOutdoorMode(true); break;}
                case 2 : {setSleepMode(true); break;}
                case 3 : {setEcoMode(true); break;}
                default : {modeTurnOff(); break;}
            }
        } else {
            onDoMode(4);
            modeTurnOff();
        } 
        console.log("[Home:setUI] 함수 종료");
    };

    const modeTurnOff = () => {
        setIndoorMode(false);
        setOutdoorMode(false);
        setSleepMode(false);
        setEcoMode(false);
    };

    const onDoMode = (num) => {
        getStoreDB();
        modeTurnOff(); 
        console.log("[Home:onDoMode] num :", num);
        switch (num) {
            case 0 : {
                setIndoorMode(indoorMode?false:true);
                sendMqtt("webos.topic", "webos.smarthome.info", mode[num]);
                break;
            }
            case 1 : {
                setOutdoorMode(outdoorMode?false:true);
                sendMqtt("webos.topic", "webos.smarthome.info", mode[num]);
                break;
            }
            case 2 : {
                setSleepMode(sleepMode?false:true);
                sendMqtt("webos.topic", "webos.smarthome.info", mode[num]);
                break;
            }
            case 3 : {
                setEcoMode(ecoMode?false:true);
                sendMqtt("webos.topic", "webos.smarthome.info", mode[num]);
                break;
            }
            default : {
                console.log("[Home:onDoMode] switch default");
                modeTurnOff();
                break;
            }
        };
    };

    const onDoApplience = (num) => {
        console.log("[Home:onDoApplience] num :", num);
        modeTurnOff();
        let command = "";
        switch(num) {
            case 0 : {
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
        history.replace('/');
    }

    const onGotoMode = () => {
        console.log("[Home:onGotoMode] 모드 설정 페이지");
        pageNum = 2;
        //모드 설정 페이지
        history.push({
            pathname: '/mode',
            state: {
                'name' : name,
                'db' : oldDB,
                'pageNum' : pageNum
            }
        });
    }

    const onGotoSchedule = () => {
        console.log("[Home:onGotoSchedule] 스케줄 설정 페이지");
        pageNum = 3;
        //스케줄 설정 페이지
        history.push({
            pathname: '/schedule',
            state: {
                'name' : name,
                'db' : oldDB,
                'pageNum' : pageNum
            }
        });
    }

    const onGotoSetting = () => {
        console.log("[Home:onGotoSetting] 다크모드 설정 + 알람 페이지");

        pageNum = 4;
        //스케줄 설정 페이지
        history.push({
            pathname: '/alarm',
            state: {
                'name' : name,
                'db' : oldDB,
                'pageNum' : pageNum,
                'UID' : uid
            }
        });
    }

    const onGotoAppliance = () => {
        console.log("[Home:onGotoAppliance] 개별 가전 제어 페이지");
        //가전 제어 페이지

        pageNum = 5;
        //스케줄 설정 페이지
        history.push({
            pathname: '/appliance',
            state: {
                'name' : name,
                'db' : oldDB,
                'pageNum' : pageNum,
                'UID' : uid
            }
        });
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
        
        webOSBridge.onservicecallback = serviceCallback;
        function serviceCallback(msg){
            try {
                if(response.provider == "googleassistant") {
                    console.log("before-parse-response");
                    var response = JSON.parse(msg);
                    console.log(response);
                    return null;
                }
            } catch (e) {
                var response = JSON.parse(msg); 
                console.log("[Home:callback] response :", response);
            };            
        };        
    };
    
    return(
        <div className="home">
            <audio id="tts">
                <source id="tts_source" src="" type="audio/mp3" />
            </audio>
            <div className="home__head">
                <button className="back-button" onClick={onGotoSignin}>
                    <span className="material-icons">reply</span>
                </button>
                
                <p className="name">
                    <span className="name_top">{name}님,</span>
                    <p className="name_small">안녕하세요.</p>
                </p>
        
                <p className="home_sensor_data temp-value">
                    <span className="material-icons">thermostat</span>
                    {temp}℃
                </p>
                <div className="temp">
                    <progress value={temp} max="40"></progress>
                </div>
        
                <p className="home_sensor_data hum-value">
                    <span className="material-icons">water_drop</span>
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
                    <span className="weather-icon__weather">{weather}</span> <br/>
                    <span className="weather-icon__airlevel">미세먼지: {dust}</span>
                </div>
                
                <button className="setting-button" onClick={onGotoSetting}>
                    <span className="material-icons">settings</span>
                </button>
            </div>
            <br />
        
            <div className="home__box">
                <div className="mode">
                    <div className="mode__head">
                        <button onClick={onGotoMode}>
                            <img className="menu-icon" src={modeIcon} />
                            <p className="menu_title">모드</p>
                        </button>
                        <button onClick={onGotoSchedule}>
                            <img className="menu-icon" src={scheduleIcon} />
                            <p className="menu_title">스케줄</p>
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
                                            backgroundColor : indoorMode ? '#3264fe' : 'white'
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
                                            backgroundColor : outdoorMode ? '#3264fe' : 'white'
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
                                            backgroundColor : sleepMode ? '#3264fe' : 'white'
                                        }}
                                    >
                                        <img className="control-mode" src={nightIcon} style={{
                                            filter : sleepMode ? 'invert(1)' : 'invert(0)'
                                        }} />
                                        <p style={{
                                            color : sleepMode ? 'white' : 'black'
                                        }} >
                                            슬립 모드
                                        </p>
                                    </button>
                                </td>
                                <td>
                                    <button 
                                        onClick = {() => onDoMode(3)} 
                                        style={{
                                            backgroundColor : ecoMode ? '#3264fe' : 'white'
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
                                                backgroundColor : aircon ? '#3264fe' : 'white'
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
                                                backgroundColor : light ? '#3264fe' : 'white'
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
                                                backgroundColor : valve ? '#3264fe' : 'white'
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
                                                backgroundColor : window ? '#3264fe' : 'white'
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
                                        <button className="button">
                                            ㅁ
                                        </button>
                                    </td>
                                    <td>
                                        <button className="button">
                                            ㅁ
                                        </button>
                                    </td>
                                    <td>
                                        <button className="button">
                                            ㅁ
                                        </button>
                                    </td>
                                    <td>
                                        <button className="button" onClick={() => getUIDB()}>
                                            ㅁ
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