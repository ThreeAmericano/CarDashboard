/* eslint-disable */
import {useState } from "react";
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";
import faceIcon from '../../../resources/webos_project_icon/removeLogo/smile.png';

var webOSBridge = new WebOSServiceBridge();

import "./SignIn.css"

const sendMqtt = (exchange, routingKey, msg) => {
    console.log("displayReponse function excuted");

    var url = 'luna://com.ta.car2webos.service/sendMqtt';
    var params = JSON.stringify({
        "exchange": exchange,
        "routingKey": routingKey,
        "msg":msg        
    });
  
    webOSBridge.call(url, params); 

    console.log("sendMqtt function end");
}

const SignIn = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let test = "022222220";

    const onEmailChange = (event) => {
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {
        const {target : {value}} = event;
        setPassword(value);
    };

    const onSignIn = () => {    
        console.log("onSignIn function excuted");

        var url = 'luna://com.ta.car2webos.service/signIn';
        var params = JSON.stringify({
            "email":email,
            "password":password
        });

        let name = '';
      
        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = callback;
        function callback(msg){
            var response = JSON.parse(msg); 

            name = response.Response;
            console.log(name);

            history.push({
                pathname: '/home',
                state: {'name': name}
            });

        }
        console.log("onSignIn function end");
    };

    const onTestSignIn = () => {    
        console.log("onSignIn function excuted");

        var url = 'luna://com.ta.car2webos.service/signIn';
        var params = JSON.stringify({
            "email":"lee@test.com",
            "password":"123412"
        });

        let name = '';
      
        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = callback;
        function callback(msg){
            var response = JSON.parse(msg); 

            name = response.Response;
            console.log(name);

            history.push({
                pathname: '/home',
                state: {'name': name}
            });

        }
        console.log("onSignIn function end");
    };

    const onSignUp = () => {
        history.push('/sign-up');
    };

    const onFaceSignIn = async() => {
        console.log("onFaceSignIn function excuted");
        //await visionSignIn();
        // 얼굴인식 시작 mqtt를 server로 보냄
        sendMqtt("webos.topic", "webos.smarthome", test);
        //smarthome test
    };

    return(
        <div className="sign-in">
            <div className="sign-in__head">
                <h3>얼굴인식 로그인</h3>
                <h3>E-Mail 로그인</h3>
            </div>
            <div className="sign-in__box">
                <div className="face-recognation">
                    <div className="face-recognation__box">
                        <button onClick={onFaceSignIn}>
                            <img className="face-button-icon" src={faceIcon} />    
                        </button>
                    </div>
                </div>
                <div className="email">
                    <div className="email__box">
                        <div className="input-box">
                            <input type="email" value={email} onChange={onEmailChange} placeholder="이메일을 입력하세요." required />
                            <label for="email">E-mail</label>
                        </div>    
                        <div className="input-box">
                            <input type="password" value={password} onChange={onPasswordChange} placeholder="비밀번호를 입력하세요." required />
                            <label for="password">Password</label>
                        </div> 
                        <br />
                        <Button value="로그인" onClick={onSignIn} /> 
                        <br />
                        <br />
                        <Button value="회원가입" onClick={onSignUp} />
                        <br />
                        <br />
                        <Button value="test 로그인" onClick={onTestSignIn} /> 
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;