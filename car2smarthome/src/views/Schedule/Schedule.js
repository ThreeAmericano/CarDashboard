/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Schedule.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"
//import "../../../resources/script/access_document.js"

// 모드 + 가전
import indoorIcon from '../../../resources/smarthome_icon/indoor.png';
import outdoorIcon from '../../../resources/smarthome_icon/outdoor.png';
import ecoIcon from '../../../resources/smarthome_icon/eco_energy.png';
import nightIcon from '../../../resources/smarthome_icon/night.png';

import airconIcon from '../../../resources/smarthome_icon/air_conditioner.png';
import lightIcon from '../../../resources/smarthome_icon/light.png';
import valveIcon from '../../../resources/smarthome_icon/valve.png';
import windowIcon from '../../../resources/smarthome_icon/window.png';

//var webOSBridge = new WebOSServiceBridge();
import { db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc } from "../../firebase";

let scheduleData = [];
let pageNum;
let i;

async function getStoreDB() {
    try {
        i=0;
        console.log("[Schedule:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "schedule_mode"));
        //console.log("[Schedule:store listener] querySnapshot :", querySnapshot);
        querySnapshot.forEach((doc) => {
            console.log("[Schedule:store]", doc.id, " => ", doc.data());
            /*
            scheduleData[i] = {
                "Daysofweek" : doc.data().Daysofweek,
                "Enabled" : doc.data().Enabled,
                "Start_time" : doc.data().Start_time,
                "Title" : doc.data().Title,
                "UID" : doc.data().UID,
                "airconEnable" : doc.data().airconEnable,
                "airconWindPower" : doc.data().airconWindPower,
                "gasValveEnable" : doc.data().gasValveEnable,
                "lightBrightness" : doc.data().lightBrightness,
                "lightColor" : doc.data().lightColor,
                "lightEnable" : doc.data().lightEnable,
                "lightMode" : doc.data().lightMode,
                "modeNum" : doc.data().modeNum,
                "repeat" : doc.data().repeat,
                "windowOpen" : doc.data().windowOpen
            };*/
            scheduleData[i] = doc.data();
            i++;
        });
        console.log("[Schedule:getStoreDB] scheduleData :", scheduleData);
        console.log("[Schedule:getStoreDB] scheduleData.length :", scheduleData.length);
        console.log("[Schedule:getStoreDB] scheduleData[0] :", scheduleData[0]);
    } catch(e) {
        console.log("[Schedule:getStoreDB] error : ", e);
    };
};

if(pageNum == 3) getStoreDB();

const Schedule = () => {
    const history = useHistory();
    const location = useLocation();

    const name = location.state.name;
    const oldDB = location.state.db;

    const [schedule, setSchedule] = useState('');//스케줄 테이블
    const [selectedSchedule, setSelectedSchedule] = useState('');//선택한 스케줄

    const [selectedMode, setSelectedMode] = useState(0);

    const [indoorMode, setIndoorMode] = useState(false);
    const [outdoorMode, setOutdoorMode] = useState(false);
    const [ecoMode, setEcoMode] = useState(false);
    const [nightMode, setNightMode] = useState(false);

    const [aircon, setAircon] = useState(false);
    const [light, setLight] = useState(false);
    const [valve, setValve] = useState(false);
    const [window, setWindow] = useState(false);

    const [airconValue, setAirconValue] = useState(70);
    const [lightValue, setlightValue] = useState(70);
    const [lightColor, setlightColor] = useState(0);
    const [lightMode, setlightMode] = useState(0);

    let scheduleList;

    useEffect(() => {
        pageNum = 3;
        getStoreDB().then((res) => {
            console.log("[Schedule:useEffect] .then(res) test :",res);
            setScheduleUI();
        });
        console.log("[Schedule:useEffect] pageNum :",pageNum)
    }, []);

    const onGotoHome = () => {
        pageNum = 1;
        history.push({
            pathname: '/home',
            state: {
                'name' : name,
                'db' : oldDB
            }
        });
    };

    const setScheduleUI = () => {
        try{  // 반환 받은 테이블 값을 설정
            scheduleList = scheduleData.map(
                (item, index) => (
                    <tr key={index}>
                        <tr>
                            <td>{item.Title}</td>
                            <td>
                                <label class="switch">
                                    <input type="checkbox" />
                                    <span class="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <button onClick={() => setSelectedSchedule(index)}>
                                    {index}번 선택
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>{item.Start_time}</td>
                            <td>{item.Daysofweek}</td>
                        </tr>
                    </tr>
                )
            );
            setSchedule(
                <div className="schedule-list">
                    <table border = '1' align='center'>
                        {scheduleList}
                    </table>
                </div>
            );
        } catch (e) {
            console.log("[Schedule:setScheduleUI] error :", e);
        }
    };

    const onSave = () => {
        if(i>1) {
            console.log("[Schedule:onSave] clicked")
            setScheduleUI();
        }
    };
    
    const onRadio = (num) => {
        setlightColor(num);
    }

    const onSelectMode = (num) => {
        // 모드 선택 시 해당 모드 점등, 가전 선택 시 모드 선택 해제
        /*
        console.log("[Mode:onSelectMode] num :", num);
        smarthome = mode[num].split('');//해당 모드의 가전 제어 값
        setSelectedMode(num);
        setIndoorMode(num==0?true:false);
        setOutdoorMode(num==1?true:false);
        setEcoMode(num==2?true:false);
        setNightMode(num==3?true:false);
        console.log("[Mode:onSelectMode] mode code :", mode[num]);
        console.log("[Mode:onSelectMode] smarthome :", smarthome);
        setAircon(Number(smarthome[1])?true:false);
        setAirconValue(Number(smarthome[2]));
        setLight(Number(smarthome[3])?true:false);
        setlightValue(Number(smarthome[4]));
        setlightColor(Number(smarthome[5]));
        setlightMode(Number(smarthome[6]));
        setWindow(Number(smarthome[7])?true:false);
        setValve(Number(smarthome[8])?true:false);
        */
    }

    const onSelectApplience = (num) => {
        switch(num) {
            case 0 : {
                smarthome[1] = Number(smarthome[0])?'0':'1';
                setAircon(aircon?false:true); 
                break;
            } 
            case 1 : {
                smarthome[3] = Number(smarthome[3])?'0':'1';
                setLight(light?false:true);
                break;
            } 
            case 2 : {
                smarthome[8] = Number(smarthome[8])?'0':'1';
                setValve(valve?false:true);
                break;
            } 
            case 3 : {
                smarthome[7] = Number(smarthome[7])?'0':'1';
                setWindow(window?false:true);
                break;
            } 
            default : {
                console.log("[Mode:onSelectApplience] switch default");
                break;
            }
        }
    };
    //(event) => setAirconValue(event.target.value)
    //() => onRadio(1)
    return(
        <div className="mode-setting">
            <div className="mode-setting__head">
                <h3 className="title">스케줄 설정 페이지</h3>
                <button className="back-button" onClick={onGotoHome}>
                    <span class="material-icons">reply</span>
                </button>
                <button className="mode-setting__head__mode mode-setting__head__mode1" 
                    onClick = {() => onSelectMode(0)} 
                    style={{
                        backgroundColor : indoorMode ? '#3264fe' : 'white'
                    }} >
                    <img src={indoorIcon} style={{
                        filter : indoorMode ? 'invert(1)' : 'invert(0)'
                    }} />
                </button>
                <button  className="mode-setting__head__mode mode-setting__head__mode2" 
                    onClick = {() => onSelectMode(1)} 
                    style={{
                        backgroundColor : outdoorMode ? '#3264fe' : 'white'
                    }}>
                    <img src={outdoorIcon} style={{
                        filter : outdoorMode ? 'invert(1)' : 'invert(0)'
                    }} />
                </button>
                <button  className="mode-setting__head__mode mode-setting__head__mode3" 
                    onClick = {() => onSelectMode(2)} 
                    style={{
                        backgroundColor : ecoMode ? '#3264fe' : 'white'
                    }}>
                    <img src={ecoIcon} style={{
                        filter : ecoMode ? 'invert(1)' : 'invert(0)'
                    }} />
                </button>
                <button  className="mode-setting__head__mode mode-setting__head__mode4" 
                    onClick = {() => onSelectMode(3)} 
                    style={{
                        backgroundColor : nightMode ? '#3264fe' : 'white'
                    }}>
                    <img src={nightIcon} style={{
                        filter : nightMode ? 'invert(1)' : 'invert(0)'
                    }} />
                </button>
                <button className="save-button" onClick = {onSave}>
                    <span class="material-icons">save</span>
                </button>
            </div>

            <div className="mode-setting__box">
                <div className="mode-setting__box__left">
                    <div>
                        <b>{schedule}</b>
                    </div>
                    <div className="aircon-setting">
                        <p className="large_font">에어컨</p>
                        <button 
                            className="appliance_button" 
                            onClick = {() => onSelectApplience(0)} 
                            style={{
                                backgroundColor : aircon ? '#3264fe' : 'white'
                            }}
                        >
                            <img className="control-appliance" src={airconIcon} style={{
                                filter : aircon ? 'invert(1)' : 'invert(0)'
                            }} />
                        </button>
                        <br />
                        <span>세기</span>
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
                    <div className="valve-window">
                        <div className="valve-setting">
                            <p className="large_font">가스벨브</p>
                            <button 
                                className="appliance_button" 
                                onClick = {() => onSelectApplience(2)} 
                                style={{
                                    backgroundColor : valve ? '#3264fe' : 'white'
                                }}
                            >
                                <img className="control-appliance" src={valveIcon} style={{
                                    filter : valve ? 'invert(1)' : 'invert(0)'
                                }} />
                            </button>
                        </div>
                        <div className="window-setting">
                            <p className="large_font">창문</p>
                            <button 
                                className="appliance_button" 
                                onClick = {() => onSelectApplience(3)} 
                                style={{
                                    backgroundColor : window ? '#3264fe' : 'white'
                                }}
                            >
                                <img className="control-appliance" src={windowIcon} style={{
                                    filter : window ? 'invert(1)' : 'invert(0)'
                                }} />
                            </button>
                        </div>
                    </div>
                </div>
            
                <div className="mode-setting__box__light-setting">
                    <p className="large_font">무드등</p>
                    <button 
                        className="appliance_button" 
                        onClick = {() => onSelectApplience(1)} 
                        style={{
                            backgroundColor : light ? '#3264fe' : 'white'
                        }}
                    >
                        <img className="control-appliance" src={lightIcon} style={{
                            filter : light ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    <br />
                    <span>밝기</span>
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
                    <br />
                    <div>
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
                    <br />
                    <div>
                        <span>모드 선택</span><br/>
                        <label className="label-lightmode-radio">
                            <input type="radio" className="lightmode lightmode1" name="lightmode-select" value="1" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==1?"checked":""}/>
                            <span>일반모드</span> 
                        </label>
                        <label className="label-lightmode-radio">
                            <input type="radio" className="lightmode lightmode2"  name="lightmode-select" value="2" onClick={(event) => setlightMode(event.target.value)} checked={lightMode==2?"checked":""}/>
                            <span>슬립모드</span> 
                        </label>
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
    );
}

export default Schedule;