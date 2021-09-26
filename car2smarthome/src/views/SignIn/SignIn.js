/* eslint-disable */
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import faceIcon from '../../../resources/smarthome_icon/smile.png'; // 얼굴인식 버튼 아이콘

const webOSBridge = new WebOSServiceBridge(); // 서비스 연결 브릿지 (저레벨 루나버스)
const kindID = "com.ta.car2smarthome:1";
let internetConnection = "";
let dbResult = [];
let name;

import "./SignIn.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"

const SignIn = () => {
    // 로그인 페이지
    const history = useHistory();   // 페이지 이동에 사용된다.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // 초기값 설정
        checkInternet();
        putKind(); // db8 kind 생성
        putPermissions();
        return() => {
            console.log("[Signin: useEffect] 닫힘");
        };
    }, []);

    const checkInternet = () => {
        console.log("[SignIn:checkInternet] checkInternet function excuted");

        let url = 'luna://com.webos.service.connectionmanager/getStatus';
        webOSBridge.call(url, '{}');  // JS 서비스 호출
        
        webOSBridge.onservicecallback = checkInternetCallback;
        function checkInternetCallback(msg){
            let response = JSON.parse(msg); 
            try {
                console.log("[SignIn:checkInternet callback] response :", response);
                dbResult = response.results;
                console.log("[SignIn:checkInternet callback] response.offlineMode :", response.offlineMode);
                if((response.offlineMode == "enabled")||((response.wifi.state=="disconnected")&&(response.wired.state=="disconnected"))) {
                    internetConnection = "enabled";
                } else {
                    internetConnection = "disabled";
                } 
                console.log("[SignIn:checkInternet] internet Connection :",internetConnection);
            } catch(e) {
                console.log("[SignIn:checkInternet callback] response :", response);
                console.log("[SignIn:checkInternet callback] response.result :", response.result);
                try {                    
                    console.log("[SignIn:checkInternet callback] dbResult :", dbResult);
                    console.log("[SignIn:checkInternet callback] dbResult :", dbResult[0]);
                    tts(String(dbResult[0].name)+"님 안녕하세요");

                    history.push({
                        pathname: '/home',
                        state: {
                            'name' : dbResult[0].name,
                            'db' : dbResult[0].db,
                            'pageNum' : 1,
                            'UID' : dbResult[0].UID
                        }
                    });
                } catch (e) {
                    console.log("[SignIn callback] e :", e);
                }
            }
        }
        console.log("[SignIn:sendMqtt] checkInternet function end");
    };

    const onEmailChange = (event) => {  // 이메일 작성이 감지되면 이메일 변수에 값을 넣는다.
        const {target : {value}} = event;
        setEmail(value);
    };

    const onPasswordChange = (event) => {   // 비밀번호 작성이 감지되면 비밀번호 변수에 값을 넣는다.
        const {target : {value}} = event;
        setPassword(value);
    };

    const onSignIn = () => {    // 이메일 로그인 함수
        console.log("[SignIn:onSignIn] onSignIn function excuted :",internetConnection);

        // if(internetConnection == "enabled") {
        //     createToast("인터넷이 끊겼습니다.");
        //     console.log("[Signin:onSignin] 인터넷 끊김")
        //     // findUserData(email, password);
        // } else if(internetConnection == "disabled") {

            let url = 'luna://com.ta.car2smarthome.service/signIn'; // JS 서비스의 signIn 서비스를 이용한다.
            let params = JSON.stringify({
                "email":email,
                "password":password
            });
          
            createToast("이메일 로그인 중");
            webOSBridge.onservicecallback = signInCallback;

            webOSBridge.call(url, params);
            webOSBridge.onservicecallback = signInCallback;
            function signInCallback(msg){
                let response = JSON.parse(msg);
                try {
                    console.log("[SignIn:onSignIn CallBack] response :", response);
                    if(response.provider == "googleassistant") {    // 음성 콜백
                        console.log("[SignIn:onSignIn CallBack] 음성");
                        return null;
                    } else if(typeof(response.toastID)=="string") {    // 토스트 콜백
                        console.log("[SignIn:onSignIn CallBack] 토스트");
                        return null;
                    } else {
                        try {
                            let returnValue = response.Response;    // 로그인 콜백
                            console.log("[SignIn:onSignIn CallBack] returnValue :", returnValue);
                
                            name = returnValue.name;
                
                            if(name == "fail") {
                                createToast("로그인 실패");
                            } else {
                                console.log("이메일 로그인")
                                //internetConnection = true;
                                putUserData(email, password, name, returnValue.db, returnValue.UID);
                                tts(String(name)+"님 안녕하세요");
                                history.push({
                                    pathname: '/home',
                                    state: {
                                        'name' : name,
                                        'db' : returnValue.db,
                                        'UID' : returnValue.UID,
                                        'pageNum' : 1
                                    }
                                });
                                return null;
                            };
                        } catch(e) {
                            console.log("[SignIn:onSignIn callback] e :", e);
                            //internetConnection = false;
                            // findUserData(email, password);
                            // createToast("인터넷 연결을 확인하세요.");
                        };
                    }
                } catch(e) {
                    console.log("[SignIn:onFaceSignIn callback] e :", e);
                };
            };
        //};
        
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

        createToast("얼굴인식 로그인 중 (1 ~ 2분 동안 작동 금지)");
        webOSBridge.onservicecallback = serviceCallBack;

        let url = 'luna://com.ta.car2smarthome.service/facerSignIn'; // JS 서비스의 signIn 서비스를 이용한다.
        let params = JSON.stringify({
            "facer":"start"
        });
      
        webOSBridge.call(url, params);
        webOSBridge.onservicecallback = serviceCallBack;
        function serviceCallBack(msg){  // service call back
            let response = JSON.parse(msg); 
            console.log("[SignIn:serviceCallBack] response :", response);
            try {
                console.log("[SignIn:onSignIn CallBack] response :", response);
                if(response.provider == "googleassistant") {    // 음성 콜백
                    console.log("[SignIn:onSignIn CallBack] 음성");
                    return null;
                } else if(typeof(response.toastID)=="string") {    // 토스트 콜백
                    console.log("[SignIn:onSignIn CallBack] 토스트");
                    return null;
                } else {
                    try {
                        let returnValue = response.Response;    // 로그인 콜백
                        console.log("[SignIn:serviceCallBack] returnValue :", returnValue);
            
                        result = returnValue.result;
                        console.log("[SignIn:serviceCallBack] result :", result);
                        name = returnValue.name;
                        console.log("[SignIn:serviceCallBack] name :", name);
            
                        if(result == "Exception" || result == "Error" || result == "None" || result == "fail" || name == "fail") {
                            createToast("로그인 실패");
                        } else {
                            tts(String(name)+"님 안녕하세요");
                            history.push({
                                pathname: '/home',
                                state: {
                                    'name' : name,
                                    'db' : returnValue.db,
                                    'pageNum' : 1
                                }
                            });
                        };
                        return null;
                    } catch(e) {
                        console.log("[SignIn:onFaceSignIn callback] e :", e);
                        //internetConnection = false;
                        //createToast("인터넷 연결을 확인하세요.");
                    };
                }
            } catch (e) {
                console.log("[SignIn:onFaceSignIn callback] e :", e);
            };
        };
        console.log("[SignIn:onFaceSignIn] onSignIn function end");
    };
/*
    const sendMqtt = (exchange, routingKey, msg) => {
        // JS 서비스의 sendMqtt 서비스를 이용하여 MQTT 메세지를 보낸다.
        console.log("[SignIn:sendMqtt] displayReponse function excuted");
    
        let url = 'luna://com.ta.car2smarthome.service/sendMqtt';
        let params = JSON.stringify({
            "exchange": exchange,
            "routingKey": routingKey,
            "msg":msg        
        });
      
        webOSBridge.call(url, params);  // JS 서비스 호출
    
        console.log("[SignIn:sendMqtt] sendMqtt function end");
    }
*/  
    const tts = (ment) => {
        console.log("[Home:tts] ment :", ment);

        var url = 'luna://com.webos.service.tts/speak'; // JS 서비스의 signIn 서비스를 이용한다.
        var params = {
            "text": ment, 
            "language": "ko-KR", 
            "clear":false
        };
        
        webOSBridge.call(url, JSON.stringify(params));
    }
    
    const createToast = (ment) => {
        console.log("[SignIn:createToast] ment :", ment);
    
        let url = 'luna://com.webos.notification/createToast';
        let params = {
            "sourceId":"com.ta.car2smarthome",
            "message":String(ment)
        };
    
        webOSBridge.call(url, JSON.stringify(params));
        
        webOSBridge.onservicecallback = toastCallback;
        function toastCallback(msg){
            let response = JSON.parse(msg); 
            console.log("[SignIn:createToast callback] response :", response);
        }
    };

    const putKind = () => {
        console.log("[SignIn:putKind] 실행");
    
        let url = 'luna://com.webos.service.db/putKind';
        let params = {
            "id": kindID,
            "owner":"com.ta.car2smarthome",
            "indexes": [
                {
                    "name" : "email",
                    "props":[
                        {"name":"email"}
                    ]
                },
                {
                    "name" : "password",
                    "props":[
                        {"name":"password"}
                    ]
                },
                {
                    "name" : "userName",
                    "props":[
                        {"name":"userName"}
                    ]
                },
                {
                    "name" : "db",
                    "props":[
                        {"name":"db"}
                    ]
                },
                {
                    "name" : "UID",
                    "props":[
                        {"name":"UID"}
                    ]
                }
            ]
        };    
        webOSBridge.call(url, JSON.stringify(params));
        console.log("[SignIn:putKind] 종료");
    };

    const emptyDB = () => {
        // query, from을 사용하여 kindID의 모든 데이터를 삭제합니다. (쿼리와 동일하게 where절과 함께사용가능)
        let url = 'luna://com.webos.service.db/del';
        
        let params = {
            "query":{ 
                "from":kindID
            }
        };
        webOSBridge.call(url, JSON.stringify(params));
    }

    const putPermissions = () => {
        let url = 'luna://com.webos.service.db/putPermissions';
        let params = {
            "permissions":[ 
                { 
                   "operations":{ 
                      "read":"allow",
                      "create":"allow",
                      "update":"allow",
                      "delete":"allow"
                   },
                   "object":kindID,
                   "type":"db.kind",
                   "caller":"com.ta.car2smarthome" //소유자: Appid
                }
            ]
        };
        webOSBridge.call(url, JSON.stringify(params));
        /*
        webOSBridge.onservicecallback = putPermissionsCallback;
        function putPermissionsCallback(msg){
            let response = JSON.parse(msg); 
            console.log("[SignIn:putPermissions callback] response :", response);
        };
        */
    };

    const putUserData = (email, password, name, db, uid) => {
        // DB에 데이터를 추가하는 put method를 정의합니다.
        let url = 'luna://com.webos.service.db/put';
        let params = {
            "objects" : [
                {
                    "_kind": kindID,
                    "email": email,
                    "password" : password,
                    "name" : name,
                    "db" : db,
                    "UID" : uid
                }
            ]
        };
        webOSBridge.call(url, JSON.stringify(params));
        /*
        webOSBridge.onservicecallback = putUserDataCallback;
        function putUserDataCallback(msg){
            let response = JSON.parse(msg); 
            console.log("[SignIn:putUserData callback] response :", response);
        };
        */
    }

    const onDBSignIn = () => {
        console.log("[SignIn:onDBSignIn] DB로그인");
        findUserData(email, password);
    }

    const findUserData = (email, password) => {
        let url = 'luna://com.webos.service.db/find';
        let params = {
            "query":{ 
                "from":kindID,
                "where":[ 
                    { 
                       "prop":"email",
                       "op":"=",
                       "val":String(email)
                    }/*,
                    { 
                        "prop":"password",
                        "op":"=",
                        "val":String(password)
                    }*/
                ]
            }
        };
        webOSBridge.call(url, JSON.stringify(params));
    };

    return( // 표시되는 html 코드
        <div className="sign-in">
            <audio id="tts">
                <source id="tts_source" src="" type="audio/mp3" />
            </audio>
            <div className="sign-in__head">
            </div>
            <div className="sign-in__box">
                <div className="face-recognation">		   
					<h3 onClick={emptyDB}>얼굴인식 로그인</h3>
                    <div className="face-recognation__box">
                        <button onClick={onFaceSignIn}>
                            <img className="face-button-icon" src={faceIcon} />    
                        </button>
                    </div>
                </div>
                <div className="email">	 
					<h3 onClick={onTestSignIn}>E-Mail 로그인</h3>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <div className="email__box">
                        <div className="input-box">
                            <input type="email" value={email} onChange={onEmailChange} placeholder="이메일을 입력하세요." required />
                            <label htmlfor="email">E-mail</label>
                        </div>    
                        <div className="input-box">
                            <input type="password" value={password} onChange={onPasswordChange} placeholder="비밀번호를 입력하세요." required />
                            <label htmlfor="password">Password</label>
                        </div> 
                        <br />
                        <button className="button" onClick={onSignIn}>
                            <span className="material-icons">arrow_upward</span>
                            로그인
                        </button>
                        <button className="button" onClick={onSignUp}>
                            <span className="material-icons">assignment_ind</span>
                            회원가입
                        </button>
						<br />
						<br />				
                        <button className="button" onClick={onDBSignIn}>
						    오프라인 로그인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;