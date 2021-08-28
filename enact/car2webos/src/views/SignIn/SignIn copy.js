/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";

import LS2Request from '@enact/webos/LS2Request';
//var Service = require('webos-service');
//var service = new Service("com.ta.car2webos.mqttservice");

var webOSBridge = new LS2Request();

import "./SignIn.css"

const displayReponse = () => {
    console.log("displayReponse function excuted");

    //var mqttApi = 'luna://com.ta.car2webos.mqttservice/mqtt';
    var helloParams = '{"name":"webOS"}';
  
    var lsRequest = {
        service: 'luna://com.ta.car2webos.mqttservice',
        method:'mqtt',
        parameters: helloParams,
        onSuccess: onMqttSuccess,
        onFailure: onMqttFailure
    };
    webOSBridge.send(lsRequest);   
    
    console.log("displayReponse function end");
}
const onMqttSuccess = (msg) => {
    console.log(msg);
 }
 
 const onMqttFailure = (msg) => {
    console.log(msg);
 }

const SignIn = ({setLoginFlag, setUser}) => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retryFlag, setRetryFlag] = useState(false);

    const onPlay = () => {
        setRetryFlag(true)
        setVisionProcessMessage("얼굴인식을 통해 로그인하시려면 버튼을 눌러주세요.");
    }

    const onEmailChange = (event) => {
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {
        const {target : {value}} = event;
        setPassword(value);
    };

    const onSignIn = () => {
        //여기서 firebase에서 id password체크
        //mqtt.run();      
        
        console.log("onSignIn function excuted");

        //setLoginFlag(true);
    };

    const onSignUp = () => {
        history.push('/sign-up');
    };

    const onRetry = async() => {
        setRetryFlag(false);
        console.log("onRetry function excuted");
        //await visionSignIn();
        displayReponse();
        setRetryFlag(true);
    };

    return(
        <div className="sign-in">
            <div className="sign-in-form">
                <div className="face-recognation-form">
                    <div className="video-contents">
                        <div>asdf</div>
                        <Button value="face 로그인" onClick={onRetry} />
                        {retryFlag && <Button value="face 로그인" onClick={onRetry} />}
                    </div>
                </div>
                <div className="email-form">
                    <div className="email-contents">
                        <h3>로그인</h3>
                        <label>이메일</label>
                        <input type="email" value={email} onChange={onEmailChange} placeholder="이메일을 입력하세요." required />
                        <label>비밀번호</label>
                        <input type="password" value={password} onChange={onPasswordChange} placeholder="비밀번호를 입력하세요." required />
                        <Button value="로그인" onClick={onSignIn} />
                        <Button value="회원가입" onClick={onSignUp} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;