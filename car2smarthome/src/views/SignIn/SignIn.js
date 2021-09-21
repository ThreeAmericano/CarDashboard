/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import faceIcon from '../../../resources/smarthome_icon/smile.png';

var webOSBridge = new WebOSServiceBridge(); // 서비스 연결 브릿지 (저레벨 루나버스)

import "./SignIn.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"

const SignIn = () => {
    // 로그인 페이지
    const history = useHistory();   // 페이지 이동에 사용된다.
    //const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        // 초기값 설정
        //console.log("[Signin: useEffect] 음성인식 시작")
        return() => {
            console.log("[Signin: useEffect] 닫힘")
        };
    }); 

    const onEmailChange = (event) => {  // 이메일 작성이 감지되면 이메일 변수에 값을 넣는다.
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {  // 비밀번호 작성이 감지되면 비밀번호 변수에 값을 넣는다.
        const {target : {value}} = event;
        setPassword(value);
    };

    const onSignIn = () => {    // 이메일 로그인 함수
        console.log("[SignIn:onSignIn] onSignIn function excuted");
        let name;

        var url = 'luna://com.ta.car2smarthome.service/signIn'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = JSON.stringify({
            "email":email,
            "password":password
        });
      
        //createToast("이메일 로그인 중")
        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = signInCallback;
        function signInCallback(msg){
            var response = JSON.parse(msg); 
            console.log("[SignIn:onSignIn callback] response :", response);
            let returnValue = response.Response;

            name = returnValue.name;

            if(name == "fail") {
                createToast("로그인 실패");
            } else {
                history.push({
                    pathname: '/home',
                    state: {
                        'name' : name,
                        'db' : returnValue.db,
                        'pageNum' : 1
                    }
                });
            };
        };
        console.log("[SignIn:onSignIn] onSignIn function end");
    };

    const onTestSignIn = () => {    
        // 테스트 계정으로 로그인
        setEmail("lee@test.com");
        setPassword("123412");
        console.log("[SignIn:onTestSignIn] 테스트 계정 타이핑")
    };

    const onSignUp = () => {
        history.push('/sign-up');   // 회원가입 페이지로 넘어간다.
    };

    const onFaceSignIn = () => {
        console.log("[SignIn:onFaceSignIn] onFaceSignIn function excuted");
        let name, result;

        var url = 'luna://com.ta.car2smarthome.service/facerSignIn'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = JSON.stringify({
            "facer":"start"
        });
      
        //createToast("얼굴인식 로그인 중 (1 ~ 2분 동안 작동 금지)");

        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = facerSignInCallback;
        function facerSignInCallback(msg){
            var response = JSON.parse(msg); 

            if(response.provider == "googleassistant") {
                console.log("before-parse-response");
                var response = JSON.parse(msg);
                console.log(response);
                return null;
            }

            console.log("[SignIn:onFaceSignIn callback] response :", response);
            let returnValue = response.Response;
            console.log("[SignIn:onFaceSignIn callback] returnValue :", returnValue);

            result = returnValue.result;
            name = returnValue.name;

            if(result == "Exception" || result == "Error" || result == "None" || result == "fail" || name == "fail") {
                createToast("로그인 실패");
            } else {
                history.push({
                    pathname: '/home',
                    state: {
                        'name' : name,
                        'db' : returnValue.db,
                        'pageNum' : 1
                    }
                });
            };
        };
        console.log("[SignIn:onFaceSignIn] onSignIn function end");
    };

    const sendMqtt = (exchange, routingKey, msg) => {
        // JS 서비스의 sendMqtt 서비스를 이용하여 MQTT 메세지를 보낸다.
        console.log("[SignIn:sendMqtt] displayReponse function excuted");
    
        var url = 'luna://com.ta.car2smarthome.service/sendMqtt';
        var params = JSON.stringify({
            "exchange": exchange,
            "routingKey": routingKey,
            "msg":msg        
        });
      
        webOSBridge.call(url, params);  // JS 서비스 호출
    
        console.log("[SignIn:sendMqtt] sendMqtt function end");
    }
 
    const ttsTest = () => {
        console.log("[Signin:ttsTest] test start");
    
        var url = 'luna://com.webos.service.tts/speak'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = {
            "text":"얼굴 인식을 시작합니다", 
            "language": "ko-KR", 
            "clear":false
        };
          
        webOSBridge.call(url, JSON.stringify(params));

        console.log("[Signin:ttsTest] test end");
    }
    
    function createToast(ment) {
        console.log("[SignIn:createToast] ment :", ment);
    
        var url = 'luna://com.webos.notification/createToast';
        var params = {
            "sourceId":"com.ta.car2smarthome",
            "message":String(ment)
        };
    
        webOSBridge.call(url, JSON.stringify(params));
    
        webOSBridge.onservicecallback = toastCallback;
        function toastCallback(msg){
            var response = JSON.parse(msg); 
            console.log("[SignIn:createToast callback] response :", response);
        }
    }

    return( // 표시되는 html 코드
        <div className="sign-in">
            <audio id="tts">
                <source id="tts_source" src="" type="audio/mp3" />
            </audio>
            <div className="sign-in__head">
            </div>
            <div className="sign-in__box">
                <div className="face-recognation">		   
					<h3>얼굴인식 로그인</h3>
                    <div className="face-recognation__box">
                        <button onClick={onFaceSignIn}>
                            <img className="face-button-icon" src={faceIcon} />    
                        </button>
                    </div>
                </div>
                <div className="email">	 
					<h3>E-Mail 로그인</h3>
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
                        <button class="button" onClick={onSignIn}>
                            <span class="material-icons">arrow_upward</span>
                            로그인
                        </button>
                        <button class="button" onClick={onSignUp}>
                            <span class="material-icons">assignment_ind</span>
                            회원가입
                        </button>
						<br />
						<br />					
                        <button class="button" onClick={onTestSignIn}>
						test계정</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;