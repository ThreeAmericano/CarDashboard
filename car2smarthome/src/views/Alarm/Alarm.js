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
let i;
let pageNum;

async function getStoreDB() {
    try {
        i=0;
        console.log("[Alarm:store start]")
        const querySnapshot = await getDocs(collection(storeDB, "appliance_alarm"));
        querySnapshot.forEach((doc) => {
            alarmData[i] = doc.data();
            i++;
        });
    } catch(e) {
        console.log("[Alarm:getStoreDB] error : ", e);
    };
};

if(pageNum == 4) getStoreDB();

const Alarm = () => {
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
    
    const setAlarmUI = () => {
        // 반환 받은 테이블 값을 설정
        alarmList = alarmData.map(
            (item, index) => (
                <tr key={index} >
                    <tr>
                        <td>
                            <p>
                                {item.date}
                            </p>
                            <p>
                                {item.inform}
                            </p>
                            <p>
                                <img className="control-mode" 
                                    src={
                                        item.icon == "aircon_icon"?aircon_icon:
                                        item.icon == "light_icon"?light_icon:
                                        item.icon == "gasvalve_icon"?gasvalve_icon:
                                        window_icon
                                    } />
                            </p>
                        </td>
                    </tr>
                </tr>
            )
        );

        setAlarm(
            <table className="schedule_list_table" border = '1' align='center'>
                {alarmList}
            </table>
        );
    };
    
    return(
        <div className="mode-setting">
        <div className="mode-setting__head">
            <h3 className="title">알람 목록 페이지</h3>
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

            <button className="add-button">
                <span class="material-icons">add</span>
            </button>

            <button className="delete-button">
                <span class="material-icons">delete</span>
            </button>

            <button className="save-button">
                <span class="material-icons">save</span>
            </button>
        </div>

        <div className="mode-setting__box">
            <div className="mode-setting__box__left">
                {alarm}
            </div>

            <div className="mode-setting__box__light-setting">
                UI 모드 설정
            </div>                    
        </div>
    </div>
    );
}

export default Alarm;