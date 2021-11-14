/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import "./Appliance.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"

// 가전
import airconIcon from '../../../resources/smarthome_icon/air_conditioner.png';
import lightIcon from '../../../resources/smarthome_icon/light.png';
import valveIcon from '../../../resources/smarthome_icon/valve.png';
import windowIcon from '../../../resources/smarthome_icon/window.png';

var webOSBridge = new WebOSServiceBridge();
import { appl_db, ref, onValue } from "../../firebase";

let pageNum;

const Appliance = ({darkMode, oldDB, setOldDB}) => {   // 가전 상세 제어 페이지
    const history = useHistory();

    let command = "";

    const [aircon, setAircon] = useState(false);
    const [light, setLight] = useState(false);
    const [valve, setValve] = useState(false);
    const [window, setWindow] = useState(false);

    const [airconValue, setAirconValue] = useState(70);
    const [lightValue, setlightValue] = useState(70);
    const [lightColor, setlightColor] = useState(0);
    const [lightMode, setlightMode] = useState(0);

    useEffect(() => {
        console.log("[Appliance:useEffect] Appliance 페이지 실행");

        getApplRTDB();
        pageNum = 5;
        setAppliUI(oldDB);

        return() => {
            console.log("[Appliance:useEffect] 종료 pageNum :", pageNum);
            pageNum = 1;
        };
    }, []);

    const onGotoHome = () => {
        pageNum = 1;
        history.goBack();
    };

    const setAppliUI = (data) => {
        console.log("[Appliance:setAppliUI] 함수 실행 data :", data);

        let listenHome = data.smarthome.status;
        console.log("[Appliance:setAppliUI] listenHome :",listenHome);
        
        if(Number(listenHome[1]) != 2) {
            setAircon(Number(listenHome[1])==1?true:false);
        };
        if(Number(listenHome[3]) != 2) {
            setLight(Number(listenHome[3])==1?true:false);
        };
        if(Number(listenHome[7]) != 2) {
            setWindow(Number(listenHome[7])==1?true:false);
        };
        if(Number(listenHome[8]) != 2) {
            setValve(Number(listenHome[8])==1?true:false);
        };

        setAirconValue(Number(listenHome[2]));
        setlightValue(Number(listenHome[4]));
        setlightColor(Number(listenHome[5]));
        setlightMode(Number(listenHome[6]))

        console.log("[Appliance:setAppliUI] 함수 종료");
    };

    const onDoApplience = () => {
        command = "0";                  // mode 0 (개별 가전 제어)
        command += aircon?"1":"0" ;     // 에어컨 실행
        command += String(airconValue); // 에어컨 세기
        command += light?"1":"0";       // 무드등 실행
        command += String(lightValue);  // 무드등 세기
        command += String(lightColor);  // 무드등 색상
        command += String(lightMode);   // 무드등 모드
        command += window?"1":"0";      // 창문 실행
        command += valve?"1":"0";       // 가스 밸브 실행
        console.log("[Appliance:onDoApplience] command :",command);
        sendMqtt("webos.topic", "webos.smarthome.info", command);
    }

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
    
    const getApplRTDB = () => {
        const appl_dbRef = ref(appl_db);
        onValue(appl_dbRef, (snapshot) => {
            let data = snapshot.val();

            if(oldDB.smarthome.status == data.smarthome.status && oldDB.sensor.openweather.update == data.sensor.openweather.update && oldDB.sensor.hometemp.humi == data.sensor.hometemp.humi && oldDB.sensor.hometemp.temp == data.sensor.hometemp.temp) {
                console.log("[Appliance:listener] 변화 없음");
            } else {
                console.log("[Appliance:listener] 변화 있음");
                if(pageNum == 5) {
                    console.log("[Appliance:listener] setAppliUI 실행");
                    setOldDB(data);  
                    setAppliUI(data);
                };
            };
        });
    };      
    
    return(
        <div className="appliance-setting">
            <div className="appliance-setting__head">
                <h3 className="title">개별 가전 페이지</h3>
                <button className="back-button" onClick={onGotoHome}>
                    <span className="material-icons">reply</span>
                </button>
                <button className="save-button" onClick = {onDoApplience}>
                    <span className="material-icons">save</span>
                </button>
            </div>

            <div className="appliance-setting__box">
                <div className="appliance-setting__box__light-setting">
                    <div className="" > 
                        <div className="appliance-box-windowvalve">
                            <div className="title">
                                창문/가스밸브
                            </div>
                            <div className="content-box">
                                <div className="window">
                                    <button 
                                        className="appliance_button" 
                                        onClick = {() => setWindow(window?false:true)} 
                                        style={{
                                            backgroundColor : window ? '#3264fe' : 'white'
                                        }}
                                    >
                                        <img className="schedule-control-appliance" src={windowIcon} style={{
                                            filter : window ? 'invert(1)' : 'invert(0)'
                                        }} />
                                    </button>
                                </div>
                                <div className="valve">
                                    <button 
                                        className="appliance_button" 
                                        onClick = {() => setValve(valve?false:true)} 
                                        style={{
                                            backgroundColor : valve ? '#3264fe' : 'white'
                                        }}
                                    >
                                        <img className="schedule-control-appliance" src={valveIcon} style={{
                                            filter : valve ? 'invert(1)' : 'invert(0)'
                                        }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <hr className="row_line" />
                        
                        <div className="appliance-box-aircon">
                            <div className="title">
                                에어컨
                            </div>
                            <div className="content-box">
                                <div className="enable-button">
                                    <button 
                                        className="appliance_button" 
                                        onClick = {() => setAircon(aircon?false:true)} 
                                        style={{
                                            backgroundColor : aircon ? '#3264fe' : 'white'
                                        }}
                                    >
                                        <img className="schedule-control-appliance" src={airconIcon} style={{
                                            filter : aircon ? 'invert(1)' : 'invert(0)'
                                        }} />
                                    </button>
                                </div>
                                <div className="power-level">
                                    <input 
                                        type="range" 
                                        id="airconInputValue" 
                                        name="airconInputValue"  
                                        value={airconValue}
                                        min="1" 
                                        max="9" 
                                        step="1" 
                                        onChange={(event) => setAirconValue(event.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className="row_line" />
                        
                        <div className="appliance-box-light">
                            <div className="title">
                                무드등
                            </div>
                            <div className ="content-box">
                                <div>
                                    <div className ="enable-button">
                                        <button 
                                            className="appliance_button" 
                                            onClick = {() => setLight(light?false:true)} 
                                            style={{
                                                backgroundColor : light ? '#3264fe' : 'white'
                                            }}
                                        >
                                            <img className="schedule-control-appliance" src={lightIcon} style={{
                                                filter : light ? 'invert(1)' : 'invert(0)'
                                            }} />
                                        </button>      
                                    </div>
                                    <div className="power-level">
                                        <input 
                                            type="range" 
                                            id="lightInputValue" 
                                            name="lightInputValue" 
                                            value={lightValue}
                                            min="1" 
                                            max="9" 
                                            step="1" 
                                            onChange={(event) => setlightValue(event.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                            
                        <div className ="appliance-box-lightdetail">
                            <div className ="title">
                                -
                            </div>
                            <div className ="content-box">
                                <div>
                                    <div className ="color-selection" style={{filter : darkMode ? 'invert(1)' : 'invert(0)'}}>
                                        <span>색 선택</span><br/>
                                        <input type="radio" className="color-white" name="color-select" value="0" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==0?"checked":""}/>
                                        <input type="radio" className="color-red"  name="color-select" value="1" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==1?"checked":""}/>
                                        <input type="radio" className="color-blue"  name="color-select" value="2" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==2?"checked":""}/>
                                        <input type="radio" className="color-green"  name="color-select" value="3" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==3?"checked":""}/>
                                        <br/>
                                        <input type="radio" className="color-yellow"  name="color-select" value="4" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==4?"checked":""}/>
                                        <input type="radio" className="color-purple"  name="color-select" value="5" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==5?"checked":""}/>
                                        <input type="radio" className="color-orange"  name="color-select" value="6" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==6?"checked":""}/>
                                        <input type="radio" className="color-skyblue"  name="color-select" value="7" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==7?"checked":""}/>
                                    </div>
                                    <div className ="mode-selection">
                                        <span>모드 선택</span><br/>
                                        <label className="label-lightmode-radio">
                                            <input type="radio" className="lightmode lightmode1" name="lightmode-select" value="0" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==0?"checked":""}/>
                                            <span>일반모드</span> 
                                        </label>
                                        <label className="label-lightmode-radio">
                                            <input type="radio" className="lightmode lightmode2"  name="lightmode-select" value="1" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==1?"checked":""}/>
                                            <span>슬립모드</span> 
                                        </label>
                                        <br/>
                                        <label className="label-lightmode-radio">
                                            <input type="radio" className="lightmode lightmode3"  name="lightmode-select" value="2" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==2?"checked":""}/>
                                            <span>안내모드</span> 
                                        </label>
                                        <label className="label-lightmode-radio">
                                            <input type="radio" className="lightmode lightmode4"  name="lightmode-select" value="3" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==3?"checked":""}/>
                                            <span>트리모드</span> 
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Appliance;