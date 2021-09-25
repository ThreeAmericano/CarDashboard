/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Appliance.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"
//import "../../../resources/script/access_document.js"

// 가전
import airconIcon from '../../../resources/smarthome_icon/air_conditioner.png';
import lightIcon from '../../../resources/smarthome_icon/light.png';
import valveIcon from '../../../resources/smarthome_icon/valve.png';
import windowIcon from '../../../resources/smarthome_icon/window.png';

var webOSBridge = new WebOSServiceBridge();
import { db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc, deleteDoc } from "../../firebase";

let oldDB;
let pageNum;

const Appliance = () => {   // 가전 상세 제어 페이지
    const history = useHistory();
    const location = useLocation();

    const name = location.state.name;

    const [aircon, setAircon] = useState(false);
    const [light, setLight] = useState(false);
    const [valve, setValve] = useState(false);
    const [window, setWindow] = useState(false);

    const [airconValue, setAirconValue] = useState(70);
    const [lightValue, setlightValue] = useState(70);
    const [lightColor, setlightColor] = useState(0);
    const [lightMode, setlightMode] = useState(0);

    useEffect(() => {
        pageNum = 5;
        oldDB = location.state.db;
        setUI(oldDB);
    }, []);

    const onGotoHome = () => {
        pageNum = 1;
        history.replace({
            pathname: '/home',
            state: {
                'name' : name,
                'db' : oldDB,
                'pageNum' : 1
            }
        });
    };

    const onDoApplience = (num) => {
        console.log("[Appliance:onDoApplience] num :", num);
        let command = "";
        let commandArray = ['0', '2', '2', '2', '2', '2', '2', '2', '2'];
        switch(num) {
            case 0 : {
                if(aircon) {
                    setAircon(false);
                    commandArray[1] = '0';
                    command = commandArray.toString().replace(/\,/g,"");
                } else {
                    setAircon(true); 
                    commandArray[1] = '1';
                    commandArray[2] = String(airconValue);
                    command = commandArray.toString().replace(/\,/g,"");
                } 
                console.log("[Appliance:onDoApplience] aircon command :", command);
                sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            case 1 : {
                if(light) {
                    setLight(false);
                    commandArray[3] = '0';
                    command = commandArray.toString().replace(/\,/g,"");
                } else {
                    setLight(true);
                    commandArray[3] = '1';
                    commandArray[4] = String(lightValue);
                    commandArray[5] = String(lightColor);
                    commandArray[6] = String(lightMode);
                    command = commandArray.toString().replace(/\,/g,"");
                } 
                console.log("[Appliance:onDoApplience] light command :", command);
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
                console.log("[Appliance:onDoApplience] valve command :", command);
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
                console.log("[Appliance:onDoApplience] window command :", command);
                sendMqtt("webos.topic", "webos.smarthome.info", command);
                break;
            };
            default : break;
        };
    };

    const setUI = (data) => {
        console.log("[Appliance:setUI] 함수 실행 data :", data);

        let listenHome = data.smarthome.status;
        console.log("[Appliance:setUI] listenHome :",listenHome);
        
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
            console.log("[Home:setUI] valve listenHome[8] :",listenHome[8]);
            console.log("[Home:setUI] Number(listenHome[8])==1?true:false :",Number(listenHome[8])==1?true:false);
            setValve(Number(listenHome[8])==1?true:false);
        };

        setAirconValue(Number(listenHome[2]));
        setlightValue(Number(listenHome[4]));
        setlightColor(Number(listenHome[5]));
        setlightMode(Number(listenHome[6]))

        console.log("[Home:setUI] 함수 종료");
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

    if(pageNum == 5) {
        try { 
            const dbRef = ref(db);
            onValue(dbRef, (snapshot) => {
                let data = snapshot.val();
    
                if(oldDB.smarthome.status == data.smarthome.status && oldDB.sensor.openweather.update == data.sensor.openweather.update && oldDB.sensor.hometemp.humi == data.sensor.hometemp.humi && oldDB.sensor.hometemp.temp == data.sensor.hometemp.temp) {
                    console.log("[Appliance:listener] 변화 없음");
                } else {
                    console.log("[Appliance:listener] 변화 있음");
                    setUI(data);
                    oldDB = data;
                };
            });
        } catch (e) {
            console.log("[Appliance:rtdb listener] error :", e);   
        };
    };
    
    return(
        <div className="appliance-setting">
        <div className="appliance-setting__head">
            <h3 className="title">개별 가전 페이지</h3>
            <button className="back-button" onClick={onGotoHome}>
                <span class="material-icons">reply</span>
            </button>
        </div>

        <div className="appliance-setting__box">
            <div className="appliance-setting__box__light-setting">
                <div class="" > 
                    <div class="appliance-box-windowvalve">
                        <div class="title">
                            창문/가스밸브
                        </div>
                        <div class="content-box">
                            <div class="window">
                                <button 
                                    className="appliance_button" 
                                    onClick = {() => onDoApplience(3)} 
                                    style={{
                                        backgroundColor : window ? '#3264fe' : 'white'
                                    }}
                                >
                                    <img className="schedule-control-appliance" src={windowIcon} style={{
                                        filter : window ? 'invert(1)' : 'invert(0)'
                                    }} />
                                </button>
                            </div>
                            <div class="valve">
                                <button 
                                    className="appliance_button" 
                                    onClick = {() => onDoApplience(2)} 
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
                    <hr class="row_line" />
                    
                    <div class="appliance-box-aircon">
                        <div class="title">
                            에어컨
                        </div>
                        <div class="content-box">
                            <div class="enable-button">
                                <button 
                                    className="appliance_button" 
                                    onClick = {() => onDoApplience(0)} 
                                    style={{
                                        backgroundColor : aircon ? '#3264fe' : 'white'
                                    }}
                                >
                                    <img className="schedule-control-appliance" src={airconIcon} style={{
                                        filter : aircon ? 'invert(1)' : 'invert(0)'
                                    }} />
                                </button>
                            </div>
                            <div class="power-level">
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
                    <hr class="row_line" />
                    
                    <div class="appliance-box-light">
                        <div class="title">
                            무드등
                        </div>
                        <div class="content-box">
                            <div>
                                <div class="enable-button">
                                    <button 
                                        className="appliance_button" 
                                        onClick = {() => onDoApplience(1)} 
                                        style={{
                                            backgroundColor : light ? '#3264fe' : 'white'
                                        }}
                                    >
                                        <img className="schedule-control-appliance" src={lightIcon} style={{
                                            filter : light ? 'invert(1)' : 'invert(0)'
                                        }} />
                                    </button>      
                                </div>
                                <div class="power-level">
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
                        
                        
                    <div class="appliance-box-lightdetail">
                        <div class="title">
                            -
                        </div>
                        <div class="content-box">
                            <div>
                                <div class="color-selection">
                                    <span>색 선택</span><br/>
                                    <input type="radio" className="color-white" name="color-select" value="1" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==1?"checked":""}/>
                                    <input type="radio" className="color-red"  name="color-select" value="2" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==2?"checked":""}/>
                                    <input type="radio" className="color-blue"  name="color-select" value="3" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==3?"checked":""}/>
                                    <input type="radio" className="color-green"  name="color-select" value="4" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==4?"checked":""}/>
                                    <br/>
                                    <input type="radio" className="color-yellow"  name="color-select" value="5" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==5?"checked":""}/>
                                    <input type="radio" className="color-purple"  name="color-select" value="6" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==6?"checked":""}/>
                                    <input type="radio" className="color-orange"  name="color-select" value="7" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==7?"checked":""}/>
                                    <input type="radio" className="color-skyblue"  name="color-select" value="8" onClick={(event) => setlightColor(event.target.value)} checked={lightColor==8?"checked":""}/>
                                </div>
                                <div class="mode-selection">
                                    <span>모드 선택</span><br/>
                                    <label className="label-lightmode-radio">
                                        <input type="radio" className="lightmode lightmode1" name="lightmode-select" value="1" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==1?"checked":""}/>
                                        <span>일반모드</span> 
                                    </label>
                                    <label className="label-lightmode-radio">
                                        <input type="radio" className="lightmode lightmode2"  name="lightmode-select" value="2" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==2?"checked":""}/>
                                        <span>슬립모드</span> 
                                    </label>
                                    <br/>
                                    <label className="label-lightmode-radio">
                                        <input type="radio" className="lightmode lightmode3"  name="lightmode-select" value="3" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==3?"checked":""}/>
                                        <span>파티모드</span> 
                                    </label>
                                    <label className="label-lightmode-radio">
                                        <input type="radio" className="lightmode lightmode4"  name="lightmode-select" value="4" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==4?"checked":""}/>
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