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

import { db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc, deleteDoc } from "../../firebase";

let scheduleData = [];
let docID = [];
let pageNum = 0;
let i;

async function getStoreDB() {
    try {
        i=0;
        console.log("[Schedule:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "schedule_mode"));
        //console.log("[Schedule:store listener] querySnapshot :", querySnapshot);
        querySnapshot.forEach((doc) => {
            //console.log("[Schedule:store]", doc.id, " => ", doc.data());
            docID[i] = doc.id;
            scheduleData[i] = doc.data();
            i++;
        });
        //console.log("[Schedule:getStoreDB] scheduleData :", scheduleData);
        //console.log("[Schedule:getStoreDB] scheduleData.length :", scheduleData.length);
        //console.log("[Schedule:getStoreDB] scheduleData[0].daysOfWeek :", scheduleData[0].daysOfWeek);
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

    const [checkMyProfile, setCheckMyProfile] = useState(false);

    const [addDocName, setAddDocName] = useState(); //useState(""); 하면 글자 안써짐

    const [titleName, setTitleName] = useState();
    //const [daysOfWeek, setdaysOfWeek] = useState([]);
    const [startTime, setStartTime] = useState();
    const [activeDate, setActivedate] = useState();

    const [sun, setSun] = useState();
    const [mon, setMon] = useState();
    const [tue, setTue] = useState();
    const [wed, setWed] = useState();
    const [thr, setThr] = useState();
    const [fri, setFri] = useState();
    const [sat, setSat] = useState();

    const [schedule, setSchedule] = useState('');//스케줄 테이블
    const [scheduleEnable, setScheduleEnable] = useState();//스케줄 테이블
    const [selectedSchedule, setSelectedSchedule] = useState(0);//선택한 스케줄

    const [modeNum, setModeNum] = useState(0);
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
            onSelectSchedule(0);
            setScheduleUI();
        });
        console.log("[Schedule:useEffect] pageNum :",pageNum)
        
        return() => {
            scheduleData = [];
            docID = [];
            pageNum = 0;
            i = 0;
        };
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
    
    const setScheduleUI = () => {
        // 반환 받은 테이블 값을 설정
        scheduleList = scheduleData.map(
            (item, index) => (
                <tr key={index} >
                    <tr>
                        <td>
                            <button className="schedule_list_button" 
                                onClick={() => {onSelectSchedule(index)}}>
                                <span className="schedule_list_title">
                                    {item.title}
                                </span>
                                <br/>
                                <span className="schedule_list_date">
                                    <div>
                                        <span>
                                            {item.name}
                                        </span>
                                    </div>

                                    <div>
                                        <span>
                                            {item.startTime.substring(0,2)+":"+item.startTime.substring(2,4)+" "}
                                        </span>
                                        <span>{
                                            item.repeat?(item.daysOfWeek[1]?"월 ":"")+(item.daysOfWeek[2]?"화 ":"")+(item.daysOfWeek[3]?"수 ":"")+(item.daysOfWeek[4]?"목 ":"")+(item.daysOfWeek[5]?"금 ":"")+(item.daysOfWeek[6]?"토 ":"")+(item.daysOfWeek[0]?"일 ":""):""
                                        }</span>
                                    </div>
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
    };

    const onAddDoc = () => {
        try {
            if(addDocName) {
                console.log("[Schedule:onAddDoc] addDocName :", addDocName);

                let addDocData = {
                    "daysOfWeek" : [false, false, false, false, false, false, false],
                    "enabled" : false,
                    "startTime" : "0000",
                    "title" : addDocName,
                    "name" : name,
                    "airconEnable" : false,
                    "airconWindPower" : 0,
                    "gasValveEnable" : false,
                    "lightBrightness" : 5,
                    "lightColor" : 2,
                    "lightEnable" : false,
                    "lightMode" : 0,
                    "modeNum" : 0,
                    "repeat" : true,
                    "windowOpen" : false
                };
    
                scheduleData.push(addDocData);
                docID.push(addDocName);
    
                // firestore 에 추가
                setDoc(doc(storeDB, "schedule_mode", addDocName),addDocData);
               
                setScheduleUI();
            } else {
                console.log("[Schedule:onAddDoc] 이름이 없습니다.");
            }            
        } catch (e) {
            console.log("[Schedule:onAddDoc] error :", e);   
        };
    };

    const onSave = () => {
        try {
            console.log("[Schedule:onSave] clicked");

            let saveScheduleData = {
                "enabled" : scheduleEnable,
                "startTime" : startTime.replace(":",""),
                "title" : titleName,
                "name" : name,
                "airconEnable" : aircon,
                "airconWindPower" : airconValue,
                "gasValveEnable" : valve,
                "lightBrightness" : lightValue,
                "lightColor" : lightColor,
                "lightEnable" : light,
                "lightMode" : lightMode,
                "modeNum" : modeNum,
                "repeat" : repeat,
                "windowOpen" :window
            };

            repeat?
            saveScheduleData["daysOfWeek"] = [sun, mon, tue, wed, thr, fri, sat]:
            saveScheduleData["activeDate"] = activeDate.replace(/\-/g,".");
            
            console.log("[Schedule:onSave] docID[selectedSchedule] :", docID[selectedSchedule]); 
            console.log("[Schedule:onSave] saveScheduleData :", saveScheduleData);    
            
            scheduleData[selectedSchedule]=saveScheduleData;

            // firestore 에 저장
            setDoc(doc(storeDB, "schedule_mode", String(docID[selectedSchedule])),saveScheduleData);
            setScheduleUI(); 
        } catch (e) {
            console.log("[Schedule:onSave] error :", e);   
        };
    };

    const onDeleteDoc = () => {
        try {
            console.log("[Schedule:onDeleteDoc] clicked");

            // firestore 에서 삭제
            deleteDoc(doc(storeDB, "schedule_mode", String(docID[selectedSchedule]))); 

            scheduleData.splice(selectedSchedule,1);
            docID.splice(selectedSchedule,1);

            setScheduleUI();
        } catch (e) {
            console.log("[Schedule:onAddDoc] error :", e);   
        };
    };

    const onAddDocNameChange = (event) => {  // 문서 추가 이름 작성이 감지되면 변수에 값을 넣는다.
        const {target : {value}} = event;
        setAddDocName(value);
    };

    const onSelectSchedule = (num) => {
        setSelectedSchedule(num);
        
        if(scheduleData[num].repeat) {
            setSun(scheduleData[num].daysOfWeek[0]);
            setMon(scheduleData[num].daysOfWeek[1]);
            setTue(scheduleData[num].daysOfWeek[2]);
            setWed(scheduleData[num].daysOfWeek[3]);
            setThr(scheduleData[num].daysOfWeek[4]);
            setFri(scheduleData[num].daysOfWeek[5]);
            setSat(scheduleData[num].daysOfWeek[6]);
        } else  {
            setActivedate(scheduleData[num].activeDate.replace(/\./g,"-"));
        }
        // 모드 선택 시 해당 모드 점등, 가전 선택 시 모드 선택 해제
        setTitleName(scheduleData[num].title);
        setScheduleEnable(scheduleData[num].enabled);
        setModeNum(0);
        setCheckMyProfile(true); //모드면 false / 가전이면 true

        if(scheduleData[num].modeNum>0){
            setCheckMyProfile(false);
            setIndoorMode(scheduleData[num].modeNum==1?true:false);
            setOutdoorMode(scheduleData[num].modeNum==2?true:false);
            setEcoMode(scheduleData[num].modeNum==3?true:false);
            setNightMode(scheduleData[num].modeNum==4?true:false);
            setModeNum(scheduleData[num].modeNum);
        };
        setAircon(scheduleData[num].airconEnable);
        setAirconValue(scheduleData[num].airconWindPower);
        setLight(scheduleData[num].lightEnable);
        setlightValue(scheduleData[num].lightBrightness);
        setlightColor(scheduleData[num].lightColor);
        setlightMode(scheduleData[num].lightMode);
        setWindow(scheduleData[num].windowOpen);
        setValve(scheduleData[num].gasValveEnable);
        setRepeat(scheduleData[num].repeat);
        setStartTime(scheduleData[num].startTime.substring(0,2)+":"+scheduleData[num].startTime.substring(2,4));
    }

    const onSelectApplience = (num) => {
        switch(num) {
            case 0 : {setAircon(aircon?false:true); break;} 
            case 1 : {setLight(light?false:true); break;} 
            case 2 : {setValve(valve?false:true); break;} 
            case 3 : {setWindow(window?false:true); break;} 
            default : {console.log("[Schedule:onSelectApplience] switch default"); break;}
        }
    };

    const modeTurnOff = () => {
        setIndoorMode(false);
        setOutdoorMode(false);
        setEcoMode(false);
        setNightMode(false);
        setModeNum(0);
    };

    //style={{display: checkMyProfile?"block":"none"}}
    
    return(
        <div className="mode-setting">
        <div className="mode-setting__head">
            <h3 className="title">스케줄 설정 페이지</h3>
            <button className="back-button" onClick={onGotoHome}>
                <span className="material-icons">reply</span>
            </button>

            { /*
            <button className="mode-setting__head__navigation mode-setting__head__mode_button">
                <span className="material-icons">star</span>
                모드
            </button>
            <button className="mode-setting__head__navigation mode-setting__head__schedule_button">
                <span className="material-icons">pending_actions</span>
                스케쥴
            </button>
            */ }

            <button className="delete-button" onClick={onDeleteDoc}>
                <span className="material-icons">delete</span>
            </button>

            <button className="save-button" onClick = {onSave}>
                <span className="material-icons">save</span>
            </button>
        </div>

        <div className="mode-setting__box">
            <div className="mode-setting__box__left">
                <input className="schedule_list_add_title" type="text" value={addDocName} onChange={onAddDocNameChange} placeholder="추가할 문서명을 입력하세요." required />
                <button className="schedule_list_add_button" onClick={onAddDoc}>
                    <span className="material-icons">add_box</span>
                </button>
                {schedule}
            </div>

            <div className="mode-setting__box__light-setting">
                <div className="setting-box-title">
                    <div className="title">
                        <h3 className="schedule_title_h3">{titleName}</h3>

                        <div className="togglebox">
                            <div className="togglebox_name">
                                <span>사용하기</span>
                            </div>
                            <div className="togglebox_input">
                                <input className="toggle_checkbox" type="checkbox" id="chk1"
                                    onChange={() => {setScheduleEnable(scheduleEnable?false:true);}} checked={scheduleEnable?"checked":""} />
                                <label className="toggle_label" for="chk1">
                                    <span>사용온오프 스위치</span>
                                </label>
                            </div>
                            <br/>
                            
                            <div className="togglebox_name">
                                <span>모드제어</span>
                            </div>
                            <div className="togglebox_input">
                                <input className="toggle_checkbox" type="checkbox" id="chk2"
                                onChange={() => {
                                    if(checkMyProfile) {
                                        setCheckMyProfile(false);
                                        modeTurnOff();
                                    } else {
                                        setCheckMyProfile(true);
                                        setModeNum(scheduleData[selectedSchedule].modeNum);
                                        switch(scheduleData[selectedSchedule].modeNum) {
                                            case 1 : {modeTurnOff(); setIndoorMode(true); break;}
                                            case 2 : {modeTurnOff(); setOutdoorMode(true); break;}
                                            case 3 : {modeTurnOff(); setEcoMode(true); break;}
                                            case 4 : {modeTurnOff(); setNightMode(true); break;}
                                            default : {modeTurnOff(); setIndoorMode(true); break;}
                                        }
                                    }
                                }}
                                checked={checkMyProfile?"checked":""}/>
                                <label className="toggle_label" for="chk2">
                                    <span>모드로할지 개별제어로 할지 고르는 스위치</span>
                                </label>
                            </div>
                            <br/>

                            <div className="togglebox_name">
                                <span>반복</span>
                            </div>
                            <div className="togglebox_input">
                                <input className="toggle_checkbox" type="checkbox" id="chk3"
                                    onChange={() => {setRepeat(repeat?false:true);}} checked={repeat?"checked":""} />
                                <label className="toggle_label" for="chk3">
                                    <span>repeat 온오프 스위치</span>
                                </label>
                            </div>
                            <br />
                        </div>

                    </div>
                    <div className="date">
                        {repeat?
                            <span>
                                요일
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setSun(sun?false:true)}} checked={sun?"checked":""}/>
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setMon(mon?false:true)}} checked={mon?"checked":""}/>
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setTue(tue?false:true)}} checked={tue?"checked":""}/>
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setWed(wed?false:true)}} checked={wed?"checked":""}/>
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setThr(thr?false:true)}} checked={thr?"checked":""}/>
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setFri(fri?false:true)}} checked={fri?"checked":""}/>
                                <input className="daysOfWeek" type="checkbox" onChange={() => {setSat(sat?false:true)}} checked={sat?"checked":""}/>
                            </span>:
                            <span>
                                <input className="schedule_date" type="date" value={activeDate} onChange={(event) => setActivedate(event.target.value)} />
                            </span>
                        }
                        <br/>
                        <input className="schedule_time" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
                    </div>
                </div>
                <hr className="row_line" />


{checkMyProfile?
                <div className="" > 
                    <div className="setting-box-windowvalve">
                        <div className="title">
                            에어컨
                        </div>
                        <div className="content-box">
                         



                            <div className="aircon_box">
                                <div className="enable-button">
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




                            <div className="windowvalve_box">
                                
                                <div className="window">
                                    <div className="title">
                                        창문
                                    </div>
                                    <div className="window_button">
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
                                </div>

                                <div className="valve">
                                    <div className="title">
                                        가스밸브
                                    </div>
                                    <div className="valve_button">
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





                        </div>
                    </div>
                    <hr className="row_line" />
                    
                    
                    <div className="setting-box-light">
                        <div className="title">
                            무드등
                        </div>
                        <div className="content-box">
                            <div className="color-selection">
                                <div className="enable-button">
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
                                <br/>
                                <br/>
                                <br/>
                                <br/>
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
                            </div>

                            <div className="mode-selection">
                                <br/>
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
                        
:
                <div className="">
                    <p> 
                    <button className="mode-setting__schedule__mode mode-setting__schedule__mode1" 
                        onClick = {() => {
                            modeTurnOff();
                            setIndoorMode(indoorMode?false:true);
                            setModeNum(indoorMode?0:1);
                        }} 
                        style={{
                            backgroundColor : indoorMode ? '#3264fe' : 'white'
                        }} >
                        <img src={indoorIcon} style={{
                            filter : indoorMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    <button  className="mode-setting__schedule__mode mode-setting__schedule__mode2" 
                        onClick = {() => {
                            modeTurnOff();
                            setOutdoorMode(outdoorMode?false:true);
                            setModeNum(outdoorMode?0:2);
                        }}
                        style={{
                            backgroundColor : outdoorMode ? '#3264fe' : 'white'
                        }}>
                        <img src={outdoorIcon} style={{
                            filter : outdoorMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    <br/>

                    <button  className="mode-setting__schedule__mode mode-setting__schedule__mode3" 
                        onClick = {() => {
                            modeTurnOff();
                            setEcoMode(ecoMode?false:true);
                            setModeNum(ecoMode?0:3);
                        }} 
                        style={{
                            backgroundColor : ecoMode ? '#3264fe' : 'white'
                        }}>
                        <img src={ecoIcon} style={{
                            filter : ecoMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    <button  className="mode-setting__schedule__mode mode-setting__schedule__mode4" 
                        onClick = {() => {
                            modeTurnOff();
                            setNightMode(nightMode?false:true);
                            setModeNum(nightMode?0:4);
                        }} 
                        style={{
                            backgroundColor : nightMode ? '#3264fe' : 'white'
                        }}>
                        <img src={nightIcon} style={{
                            filter : nightMode ? 'invert(1)' : 'invert(0)'
                        }} />
                    </button>
                    </p>
                </div>
}
            </div>
        </div>
    </div>
    );
}

export default Schedule;