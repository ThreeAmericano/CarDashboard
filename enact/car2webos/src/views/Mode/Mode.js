/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import "./Mode.css"

const Home = () => {
    const history = useHistory();
    const location = useLocation();
    
    const sendMqtt = (exchange, routingKey, msg) => {
        console.log("[Home] displayReponse function excuted");
    
        var url = 'luna://com.ta.car2webos.service/sendMqtt';
        var params = JSON.stringify({
            "exchange": exchange,
            "routingKey": routingKey,
            "msg":msg        
        });
      
        webOSBridge.call(url, params); 
    
        console.log("[Home] sendMqtt function end");
    };
    
    return(
        <div className="home">
            <div className="home__head">
                <button className="back-button" onClick={onGotoSignin}>
                    <FiChevronsLeft size="40" color="#000"/>
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
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
                                        </button>
                                    </td>
                                    <td>
                                        <button>
                                            <AiOutlinePlus size="130" color="#000" />
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