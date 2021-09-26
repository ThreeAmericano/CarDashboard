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

import aircon_icon from '../../../resources/smarthome_icon/air_conditioner.png';
import light_icon from '../../../resources/smarthome_icon/light.png';
import gasvalve_icon from '../../../resources/smarthome_icon/valve.png';
import window_icon from '../../../resources/smarthome_icon/window.png';

import { db, ref, onValue, storeDB, collection, doc, getDocs, onSnapshot, setDoc, deleteDoc } from "../../firebase";

let alarmData = [];
let iconData = [];
let i;
let pageNum;

async function getStoreDB() {
    try {
        i=0;
        console.log("[Alarm:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "appliance_alarm"));
        querySnapshot.forEach((doc) => {
            alarmData[i] = doc.data();
            iconData[i] = doc.data().icon;
            i++;
        });
    } catch(e) {
        console.log("[Alarm:getStoreDB] error : ", e);
    };
};

if(pageNum == 4) getStoreDB();

const Alarm = ({setDarkMode, darkMode}) => {
    const history = useHistory();
    const location = useLocation();

    const name = location.state.name;
    const oldDB = location.state.db;
    
    const [alarm, setAlarm] = useState('');//알람 테이블

    let alarmList;

    useEffect(() => {
        pageNum = 4;

        getStoreDB().then(() => {
            console.log("[Alarm:useEffect]");
            setAlarmUI();
        });
        console.log("[Alarm:useEffect] pageNum :",pageNum)
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

    const displayIcon = (num) => {
        switch (iconData[num]) {
            case "aircon_icon" : return aircon_icon;
            case "light_icon" : return light_icon;
            case "gasvalve_icon" : return gasvalve_icon;
            case "window_icon" : return window_icon;
            case "1mode_icon" : return indoorIcon;
            case "2mode_icon" : return outdoorIcon;
            case "3mode_icon" : return ecoIcon;
            case "4mode_icon" : return nightIcon;
            default : {
                console.log("[Alarm:displayIcon] switch select default :",iconData[num]);
                break;
            }
        }
    };
    
    const setAlarmUI = () => {
        // 반환 받은 테이블 값을 설정
        alarmList = alarmData.map(
            (item, index) => (
                <tr key={index} >
                    <tr>
                        <td>
                            <p>
                                <img className="appliance_img" 
                                    src={displayIcon(index)} />                                    
                            </p>
                        </td>
                        <td className="appliance_inform_td">
                            <span className="alarmlist_item_inform">
                                {item.inform}
                            </span>
                            <br/>
                            <span className="alarmlist_item_date">
                                {item.date}
                            </span>
                        </td>
                    </tr>
                </tr>
            )
        );

        setAlarm(
            <table className="alarm_list_table" border = '1' align='center'>
                {alarmList}
            </table>
        );
    };
    
    return(
        <div className="setting-page">
            <div className="setting-page__head">
                <h3 className="title">설정페이지</h3>
                <button className="back-button" onClick={onGotoHome}>
                    <span className="material-icons">reply</span>
                </button>
            </div>

            <div className="setting-page__box">
                <div className="setting-page__box__left">
                    <h3>
                        <span className="material-icons">
                        notifications
                        </span>
                        가전 동작 정보
                    </h3>
                    {alarm}
                </div>

                <div className="setting-page-user">
                    <h3>사용자 설정</h3>

                    <div className="togglebox togglebox_pluswidth">
                        <hr/>
                        <br/>

                        <div className="togglebox_name">
                            <span>다크모드 사용하기</span>
                        </div>
                        <div className="togglebox_input">
                            <input className="toggle_checkbox" type="checkbox" id="chk1" 
                                onChange={() => {
                                    setDarkMode(darkMode?false:true);
                                }} 
                                checked={darkMode?"checked":""} 
                            />
                            <label className="toggle_label" for="chk1">
                                <span>다크모드 스위치</span>
                            </label>
                        </div>
                        <br />
                        <div>
                            <p className="credit">
                                팀 : 삼아아 - 최현식, 박승운, 이준호
                                <br />
                                서버 : 리눅스
                                <br />
                                Client : WebOS - Enact / Android - Kotlin
                                <br />
                                통신 방식 : RabbitMQ
                                <br />
                                DB : WebOS - DB8 / System - 파이어베이스
                                <br />
                                감사합니다.
                            </p>
                        </div>
                    </div>
                </div>                    
            </div>
        </div>
    );
}

export default Alarm;