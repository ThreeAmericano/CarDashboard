/* eslint-disable */
import {useState } from "react";
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";
import faceIcon from '../../../resources/webos_project_icon/removeLogo/smile.png';

var webOSBridge = new WebOSServiceBridge(); // 서비스 연결 브릿지 (저레벨 루나버스)

import "./SignIn.css"

const sendMqtt = (exchange, routingKey, msg) => {
    // JS 서비스의 sendMqtt 서비스를 이용하여 MQTT 메세지를 보낸다.
    console.log("displayReponse function excuted");

    var url = 'luna://com.ta.car2webos.service/sendMqtt';
    var params = JSON.stringify({
        "exchange": exchange,
        "routingKey": routingKey,
        "msg":msg        
    });
  
    webOSBridge.call(url, params);  // JS 서비스 호출

    console.log("sendMqtt function end");
}

const SignIn = () => {
    // 로그인 페이지
    const history = useHistory();   // 페이지 이동에 사용된다.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let test = "022222220";

    const onEmailChange = (event) => {  // 이메일 작성이 감지되면 이메일 변수에 값을 넣는다.
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {  // 비밀번호 작성이 감지되면 비밀번호 변수에 값을 넣는다.
        const {target : {value}} = event;
        setPassword(value);
    };

    const onSignIn = () => {    // 이메일 로그인 함수
        console.log("onSignIn function excuted");

        var url = 'luna://com.ta.car2webos.service/signIn'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = JSON.stringify({
            "email":email,
            "password":password
        });

        let name = '';
      
        webOSBridge.call(url, params);  // 서비스 호출
        webOSBridge.onservicecallback = callback;   // 콜백 설정
        function callback(msg){
            var response = JSON.parse(msg); // 서버에서 보낸 이름을 가져온다.

            name = response.Response;
            console.log(name);

            history.push({  // 받은 이름과 함께 홈 페이지로 넘어간다.
                pathname: '/home',
                state: {'name': name}
            });

        }
        console.log("onSignIn function end");
    };

    const onTestSignIn = () => {    
        // 테스트 계정으로 로그인 한다. 방식은 onSignIn 함수와 동일
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
        history.push('/sign-up');   // 회원가입 페이지로 넘어간다.
    };

    const onFaceSignIn = async() => {
        console.log("onFaceSignIn function excuted");
        //await visionSignIn();
        // 얼굴인식 시작 mqtt를 server로 보냄
        //sendMqtt("webos.topic", "start_facer", test);
    };

    return( // 표시되는 html 코드
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