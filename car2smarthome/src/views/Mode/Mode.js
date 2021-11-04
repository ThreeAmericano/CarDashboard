/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Mode.css"
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

import { db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc } from "../../firebase";

let modeData = [];
let docID = [];
let pageNum = 0;

async function getStoreDB() {
    try {
        let i = 0;
    
        console.log("[Mode:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "modes"));
        //console.log("[Mode:store listener] querySnapshot :", querySnapshot);
        querySnapshot.forEach((doc) => {
            //console.log("[Mode:store listener]", doc.id, " => ", doc.data());
            docID[i] = doc.id;
            modeData[i] = doc.data();
            i++;
        });
    } catch(e) {
        console.log("[Mode:getStoreDB] error : ", e);        
    }
};

//if(pageNum == 2) getStoreDB();

const Mode = ({darkMode}) => {
    const history = useHistory();
    
    const [modeNum, setModeNum] = useState();
    const [modeName, setModeName] = useState();
    const [indoorMode, setIndoorMode] = useState();
    const [outdoorMode, setOutdoorMode] = useState();
    const [ecoMode, setEcoMode] = useState();
    const [sleepMode, setSleepMode] = useState();

    const [aircon, setAircon] = useState();
    const [light, setLight] = useState();
    const [valve, setValve] = useState();
    const [window, setWindow] = useState();

    const [airconValue, setAirconValue] = useState();
    const [lightValue, setlightValue] = useState();
    const [lightColor, setlightColor] = useState();
    const [lightMode, setlightMode] = useState();

    useEffect(() => {
        pageNum = 2;
        getStoreDB().then(() => {
            onSelectMode(0);
        });
    }, []);

    const onGotoHome = () => {
        pageNum = 1;
        /////////////////////////////////////////////////////////////////
        history.goBack();
        /*
        history.push({
            pathname: '/home',
            state: {
                'name' : name,
                'db' : oldDB,
                'pageNum' : 1
            }
        });
        */
    };

    const onSelectMode = (num) => {
        console.log("[Mode:onSelectMode] num :", num);
        console.log("[Mode:onSelectMode] modeData[num] :", modeData[num]);

        setIndoorMode(num==0?true:false);
        setOutdoorMode(num==1?true:false);
        setSleepMode(num==2?true:false);
        setEcoMode(num==3?true:false);
        
        setModeNum(modeData[num].modeNum);
        setModeName(modeData[num].modeName);

        setAircon(modeData[num].airconEnable);
        setAirconValue(modeData[num].airconWindPower);
        setLight(modeData[num].lightEnable);
        setlightValue(modeData[num].lightBrightness);
        setlightColor(modeData[num].lightColor);
        setlightMode(modeData[num].lightMode);
        setWindow(modeData[num].windowOpen);
        setValve(modeData[num].gasValveEnable);
    }

    const onSave = () => {
        console.log("[Mode:onSave] clicked");

        let saveModeData = {
            "airconEnable" : aircon,
            "airconWindPower" : airconValue,
            "gasValveEnable" : valve,
            "lightBrightness" : lightValue,
            "lightColor" : lightColor,
            "lightEnable" : light,
            "lightMode" : lightMode,
            "windowOpen" : window,
            "modeNum" : modeNum,
            "modeName" : modeName
        }

        // firestore 에 저장
        setDoc(doc(storeDB, "modes", String(modeNum)+". "+modeName), saveModeData);
        
    };
    
    const onSelectApplience = (num) => {
        switch(num) {
            case 0 : {setAircon(aircon?false:true); break;} 
            case 1 : {setLight(light?false:true); break;} 
            case 2 : {setValve(valve?false:true); break;} 
            case 3 : {setWindow(window?false:true); break;} 
            default : {console.log("[Mode:onSelectApplience] switch default"); break;}
        }
    };
    
    return(
        <div className="mode-setting-ori">
            <div className="mode-setting-ori__head">
                <h3 className="title">모드 설정 페이지</h3>
                <button className="back-button" onClick={onGotoHome}>
                    <span className="material-icons">reply</span>
                </button>
                <button className="save-button" onClick = {onSave}>
                    <span className="material-icons">save</span>
                </button>
            </div>

            <div className="mode-setting-ori__box">
                <div className="mode-setting-ori__box__left">
                    <button className="mode-setting-ori__head__mode mode-setting-ori__head__mode1" 
                        onClick = {() => onSelectMode(0)} 
                        style={{
                            backgroundColor : indoorMode ? '#3264fe' : 'white'
                        }} >
                        <img src={indoorIcon} style={{
                            filter : indoorMode ? 'invert(1)' : 'invert(0)'
                        }} />
                        <br/>
                        <span>
                            실내모드
                        </span>
                    </button>
                    <br/>
                    <button  className="mode-setting-ori__head__mode mode-setting-ori__head__mode2" 
                        onClick = {() => onSelectMode(1)} 
                        style={{
                            backgroundColor : outdoorMode ? '#3264fe' : 'white'
                        }}>
                        <img src={outdoorIcon} style={{
                            filter : outdoorMode ? 'invert(1)' : 'invert(0)'
                        }} />
                        <br/>
                        <span>
                            외출모드
                        </span>
                    </button>
                    <br/>
                    <button  className="mode-setting-ori__head__mode mode-setting-ori__head__mode4" 
                        onClick = {() => onSelectMode(2)} 
                        style={{
                            backgroundColor : sleepMode ? '#3264fe' : 'white'
                        }}>
                        <img src={nightIcon} style={{
                            filter : sleepMode ? 'invert(1)' : 'invert(0)'
                        }} />
                        <br/>
                        <span>
                            슬립모드
                        </span>
                    </button>
                    <br/>
                    <button  className="mode-setting-ori__head__mode mode-setting-ori__head__mode3" 
                        onClick = {() => onSelectMode(3)} 
                        style={{
                            backgroundColor : ecoMode ? '#3264fe' : 'white'
                        }}>
                        <img src={ecoIcon} style={{
                            filter : ecoMode ? 'invert(1)' : 'invert(0)'
                        }} />
                        <br/>
                        <span>
                            에코모드
                        </span>
                    </button>
                </div>


                <div className="mode-setting-ori__box__light-setting">
                    <div className="mode-box-title">
                        <div className="title">
                            <h3 className="schedule_title_h3">{modeNum}. {modeName}</h3>
                        </div>
                    </div>
                    <hr className="row_line" />

                    <div className="" > 
                        <div className="mode-box-windowvalve">
                            <div className="title">
                                창문/가스밸브
                            </div>
                            <div className="content-box">
                                <div className="window">
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
                                <div className="valve">
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
                        <hr className="row_line" />
                        
                        
                        <div className="mode-box-aircon">
                            <div className="title">
                                에어컨
                            </div>
                            <div className="content-box">
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
                        </div>
                        <hr className="row_line" />
                        
                        <div className="mode-box-light">
                            <div className="title">
                                무드등
                            </div>
                            <div className="content-box">
                                <div>
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
                                </div>
                            </div>
                        </div>
                            
                            
                        <div className="mode-box-lightdetail">
                            <div className="title">
                                -
                            </div>
                            <div className="content-box">
                                <div>
                                    <div className="color-selection" style={{filter : darkMode ? 'invert(1)' : 'invert(0)'}}>
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
                                    <div className="mode-selection">
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
}

export default Mode;