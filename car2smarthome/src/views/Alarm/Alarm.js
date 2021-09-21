/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Alarm.css"
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

// 현재 체크 박스 체크 안됨
// 스케줄 추가 기능
// 토글 스위치로 가전제어 or 모드 스케줄 선택
// 

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

let scheduleData = [];
let selectedScheduleArray = [];
let pageNum;
let i;
let daysofweek = [false, false, false, false, false, false, false];

async function getStoreDB() {
    try {
        i=0;
        console.log("[Schedule:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "schedule_mode"));
        //console.log("[Schedule:store listener] querySnapshot :", querySnapshot);
        querySnapshot.forEach((doc) => {
            //console.log("[Schedule:store]", doc.id, " => ", doc.data());
            scheduleData[i] = doc.data();
            i++;
        });
        //console.log("[Schedule:getStoreDB] scheduleData :", scheduleData);
        //console.log("[Schedule:getStoreDB] scheduleData.length :", scheduleData.length);
        //console.log("[Schedule:getStoreDB] scheduleData[0].Daysofweek :", scheduleData[0].Daysofweek);
    } catch(e) {
        console.log("[Schedule:getStoreDB] error : ", e);
    };
};

if(pageNum == 3) getStoreDB();

const Alarm = () => {
    const history = useHistory();
    const location = useLocation();

    const name = location.state.name;
    const oldDB = location.state.db;

    const [schedultState, setScheduleState] = useState(); // useState JSON 하나로 만드는 테스트
    const [checkMyProfile, setCheckMyProfile] = useState();

    const [titleName, setTitleName] = useState();
    //const [daysofweek, setDaysofweek] = useState([]);
    const [startTime, setStartTime] = useState();
    const [activeDate, setActivedate] = useState();

    const [schedule, setSchedule] = useState('');//스케줄 테이블
    const [scheduleEnable, setScheduleEnable] = useState();//스케줄 테이블
    const [selectedSchedule, setSelectedSchedule] = useState(0);//선택한 스케줄

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

    const [repeat, setRepeat] = useState();

    let scheduleList;

    useEffect(() => {
        pageNum = 3;
        getStoreDB().then(() => {
            console.log("[Schedule:useEffect]");
            setScheduleState(scheduleData);
            onSelectSchedule(0);
            setScheduleUI();
        });
        selectedScheduleArray = new Array(scheduleData.length);
        //selectedScheduleArray[0] = true;
        console.log("[Schedule:useEffect] pageNum :",pageNum)
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

    let test = [];
    /*
    <input 
        type="checkbox" 
        checked={scheduleData[index].Enabled?"checked":""} 
        onClick={() => onSetEnable(index)} 
    />
     */
//bgcolor={selectedScheduleArray[index] ? '#3264fe' : 'white'}
/*
onClick={() => {
                                        onSelectSchedule(index);
                                        setSelectedSchedule(index);
                                        test = test.map(e => false);
                                        test[index] = true;
                                    }} 
                                    style={{backgroundColor : (test[index]) ? '#3264fe' : 'white'}}>
                                    */
    const setScheduleUI = () => {
        try{  // 반환 받은 테이블 값을 설정
            scheduleList = scheduleData.map(
                (item, index) => (
                    <tr key={index} >
                        <tr>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={scheduleData[index].Enabled?"checked":""} 
                                    onClick={() => {onSetEnable(index)}} 
                                />
                            </td>
                            <td>
                                <button className="schedule_list_button" 
                                    onClick={() => {
                                        onSelectSchedule(index);
                                    }}>
                                    <span className="schedule_list_title">
                                        {"["+String(index)+"번] "}  {item.Title}
                                    </span>
                                    <br/>
                                    <span className="schedule_list_date">
                                        <span>
                                            {item.Start_time.substring(0,2)+":"+item.Start_time.substring(2,4)}
                                        </span>
                                        <span>{
                                            item.repeat?(item.Daysofweek[1]?"월 ":"")+(item.Daysofweek[2]?"화 ":"")+(item.Daysofweek[3]?"수 ":"")+(item.Daysofweek[4]?"목 ":"")+(item.Daysofweek[5]?"금 ":"")+(item.Daysofweek[6]?"토 ":"")+(item.Daysofweek[0]?"일 ":""):""
                                        }</span>
                                    </span>
                                </button>
                            </td>
                        </tr>
                    </tr>
                )
            );

            setSchedule(
                <table className="schedule_list_table" border = '1' align='center'>
                    {scheduleList}
                </table>
            );
        } catch (e) {
            console.log("[Schedule:setScheduleUI] error :", e);
        }
    };

    const onSetEnable = (index) => {
        scheduleData[index].Enabled = scheduleData[index].Enabled?false:true;
    }

    const onSave = () => {
        /*
        try {
            i=0;
            console.log("[Schedule:store start]")
            const querySnapshot = await getDocs(collection(storeDB, "schedule_mode"));
            //console.log("[Schedule:store listener] querySnapshot :", querySnapshot);
            querySnapshot.forEach((doc) => {
                //console.log("[Schedule:store]", doc.id, " => ", doc.data());
                scheduleData[i] = doc.data();
                i++;
            });
            //console.log("[Schedule:getStoreDB] scheduleData :", scheduleData);
            //console.log("[Schedule:getStoreDB] scheduleData.length :", scheduleData.length);
            //console.log("[Schedule:getStoreDB] scheduleData[0].Daysofweek :", scheduleData[0].Daysofweek);
        } catch(e) {
            console.log("[Schedule:getStoreDB] error : ", e);
        };
        */
        
        if(i>1) {
            console.log("[Schedule:onSave] clicked")
            setScheduleUI();
        }
    };

    const onSelectSchedule = (num) => {
        setSelectedSchedule(num);
        selectedScheduleArray = selectedScheduleArray.map(e => false);
        selectedScheduleArray[num] = true;
        daysofweek = scheduleData[num].Daysofweek;
        setScheduleState(scheduleData[num]); // 이거 하나로 퉁 칠수 있을까?
        // 모드 선택 시 해당 모드 점등, 가전 선택 시 모드 선택 해제
        setTitleName(scheduleData[num].Title);
        setScheduleEnable(scheduleData[num].Enabled);
        setSelectedMode(scheduleData[num].modeNum);
        setCheckMyProfile(scheduleData[num].modeNum>0?false:true);
        if(scheduleData[num].modeNum>0){
            setIndoorMode(scheduleData[num].modeNum==1?true:false);
            setOutdoorMode(scheduleData[num].modeNum==2?true:false);
            setEcoMode(scheduleData[num].modeNum==3?true:false);
            setNightMode(scheduleData[num].modeNum==4?true:false);
        }
        setAircon(scheduleData[num].aircon);
        setAirconValue(scheduleData[num].airconValue);
        setLight(scheduleData[num].lightEnable);
        setlightValue(scheduleData[num].lightBrightness);
        setlightColor(scheduleData[num].lightColor);
        setlightMode(scheduleData[num].lightMode);
        setWindow(scheduleData[num].windowOpen);
        setValve(scheduleData[num].gasValveEnable);
        setRepeat(scheduleData[num].repeat);
        console.log("scheduleData[num].Daysofweek :", scheduleData[num].Daysofweek);
        console.log("daysofweek :", daysofweek);
        setStartTime(scheduleData[num].Start_time.substring(0,2)+":"+scheduleData[num].Start_time.substring(2,4));
        if(scheduleData[num].repeat == false) setActivedate(scheduleData[num].Active_date.replace(/\./g,"-"));
    }

    const onSelectApplience = (num) => {
        switch(num) {
            case 0 : {
                //smarthome[1] = Number(smarthome[0])?'0':'1';
                setAircon(aircon?false:true); 
                break;
            } 
            case 1 : {
                //smarthome[3] = Number(smarthome[3])?'0':'1';
                setLight(light?false:true);
                break;
            } 
            case 2 : {
                //smarthome[8] = Number(smarthome[8])?'0':'1';
                setValve(valve?false:true);
                break;
            } 
            case 3 : {
                //smarthome[7] = Number(smarthome[7])?'0':'1';
                setWindow(window?false:true);
                break;
            } 
            default : {
                console.log("[Schedule:onSelectApplience] switch default");
                break;
            }
        }
    };
    
    return(
        <div className="mode-setting">
        <div className="mode-setting__head">
            <h3 className="title">스케줄 설정 페이지</h3>
            <button className="back-button" onClick={onGotoHome}>
                <span class="material-icons">reply</span>
            </button>

            <button className="mode-setting__head__navigation mode-setting__head__mode_button">
                <span class="material-icons">star</span>
                모드
            </button>
            <button className="mode-setting__head__navigation mode-setting__head__schedule_button">
                <span class="material-icons">pending_actions</span>
                스케쥴
            </button>

            <button className="delete-button" onClick = {onSave}>
                <span class="material-icons">delete</span>
            </button>

            <button className="save-button" onClick = {onSave}>
                <span class="material-icons">save</span>
            </button>
        </div>

        <div className="mode-setting__box">
            <div className="mode-setting__box__left">
                {schedule}
            </div>

            <div className="mode-setting__box__light-setting">
                <div class="setting-box-title">
                    <div class="title">
                        <h3 class="schedule_title_h3">{titleName}</h3>

                        <input class="toggle_checkbox" type="checkbox" id="chk1" checked={scheduleEnable?"checked":""} onclick={setScheduleEnable(scheduleEnable?false:true)}/>
                        <label class="toggle_label" for="chk1">
                            <span>사용온오프 스위치</span>
                        </label>

                    </div>
                    <div class="date">
                        {repeat?
                            <span>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[0]?"checked":""} onclick={(event) => daysofweek[0] = (event.target.checked?true:false)}/>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[1]?"checked":""} onclick={(event) => daysofweek[1] = (event.target.checked?true:false)}/>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[2]?"checked":""} onclick={(event) => daysofweek[2] = (event.target.checked?true:false)}/>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[3]?"checked":""} onclick={(event) => daysofweek[3] = (event.target.checked?true:false)}/>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[4]?"checked":""} onclick={(event) => daysofweek[4] = (event.target.checked?true:false)}/>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[5]?"checked":""} onclick={(event) => daysofweek[5] = (event.target.checked?true:false)}/>
                                <input class="daysofweek" type="checkbox" checked={daysofweek[6]?"checked":""} onclick={(event) => daysofweek[6] = (event.target.checked?true:false)}/>
                            </span>:
                            <span>
                                <input class="schedule_date" type="date" value={activeDate}/>
                            </span>
                        }
                        <br/>
                        <input class="schedule_time" type="time" value={startTime}/>
                    </div>
                </div>
                <hr class="row_line" />





                <input class="toggle_checkbox" type="checkbox" id="chk2" onClick={(event) => setCheckMyProfile(event.target.value)}/>
                <label class="toggle_label" for="chk2">
                    <span>모드로할지 개별제어로 할지 고르는 스위치</span>
                </label>

                <div class="" style={{display: checkMyProfile?"none":"block"}}> 
                    <button className="mode-setting__head__mode mode-setting__head__mode1" 
                    onClick = {() => setIndoorMode(indoorMode?false:true)} 
                    style={{
                        backgroundColor : indoorMode ? '#3264fe' : 'white'
                    }} >
                    <img src={indoorIcon} style={{
                        filter : indoorMode ? 'invert(1)' : 'invert(0)'
                    }} />
                    </button>
                    <button  className="mode-setting__head__mode mode-setting__head__mode2" 
                        onClick = {() => setOutdoorMode(outdoorMode?false:true)} 
                        style={{
                            backgroundColor : outdoorMode ? '#3264fe' : 'white'
                        }}>
                        <img src={outdoorIcon} style={{
                            filter : outdoorMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    <button  className="mode-setting__head__mode mode-setting__head__mode3" 
                        onClick = {() => setEcoMode(ecoMode?false:true)} 
                        style={{
                            backgroundColor : ecoMode ? '#3264fe' : 'white'
                        }}>
                        <img src={ecoIcon} style={{
                            filter : ecoMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    <button  className="mode-setting__head__mode mode-setting__head__mode4" 
                        onClick = {() => setNightMode(nightMode?false:true)} 
                        style={{
                            backgroundColor : nightMode ? '#3264fe' : 'white'
                        }}>
                        <img src={nightIcon} style={{
                            filter : nightMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                </div>
                




                <div class="" style={{display: checkMyProfile?"block":"none"}}> 
                    <div class="setting-box-windowvalve">
                        <div class="title">
                            창문/가스밸브
                        </div>
                        <div class="content-box">
                            <div class="window">
                                <button 
                                    className="appliance_button" 
                                    onClick = {() => onSelectApplience(3)} 
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
                                    onClick = {() => onSelectApplience(2)} 
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
                    
                    
                    <div class="setting-box-aircon">
                        <div class="title">
                            에어컨
                        </div>
                        <div class="content-box">
                            <div class="enable-button">
                                <button 
                                    className="appliance_button" 
                                    onClick = {() => onSelectApplience(0)} 
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
                    
                    <div class="setting-box-light">
                        <div class="title">
                            무드등
                        </div>
                        <div class="content-box">
                            <div>
                                <div class="enable-button">
                                    <button 
                                        className="appliance_button" 
                                        onClick = {() => onSelectApplience(1)} 
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
                        
                        
                    <div class="setting-box-lightdetail">
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
}

export default Alarm;