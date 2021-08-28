/* eslint-disable */
import {useState } from "react";
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";
import icon from '../../../resources/webos_project_icon/png/smile.png';

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
            
            //console.log("msg : "+msg);
            //console.log("JSON.parse(msg) : "+response);
            //console.log("response.returnValue : "+response.returnValue);
            //console.log("response.Response : "+response.Response);  

            name = response.Response;

            history.push({
                pathname: '/Home',
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
        //sendMqtt(exchange, routingKey, msg)
    };

    return(
        <div className="sign-in">
            <div className="sign-in-name">
                <h3>얼굴인식 로그인</h3>
                <h3>E-Mail 로그인</h3>
            </div>
            <div className="sign-in-form">
                <div className="face-recognation-form">
                    <div className="face-contents">
                        <button onClick={onFaceSignIn}>
                            <img className="face-button-icon" src={icon} />    
                        </button>
                    </div>
                </div>
                <div className="email-form">
                    <div className="email-contents">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;