/* eslint-disable */
import {useState } from "react";
import {useHistory} from "react-router-dom";
//import Button from '@enact/sandstone/Button';
//import Button from "../../components/Button/Button";

var webOSBridge = new WebOSServiceBridge(); // 서비스 연결 브릿지 (저레벨 루나버스)

import "./SignUp.css"
import "../../../resources/css/set_font.css"
import "../../../resources/css/sam_style.css"

const SignUp = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCert, setPasswordCert] = useState("");
    
    const onEmailChange = (event) => {
        const {target : {value}} = event;
        setEmail(value);
    };

    const onNameChange = (event) => {
        const {target : {value}} = event;
        setName(value);
    };

    const onPasswordChange = (event) => {
        const {target : {value}} = event;
        setPassword(value);
    };
    
    const onPasswordCertChange = (event) => {
        const {target : {value}} = event;
        setPasswordCert(value);
    };

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

    const onSignUp = () => {
        if (name && email && password && passwordCert && password == passwordCert) {    // 칸이 비어있지 않고, 비밀번호와 비밀번호 확인이 다르지 않을 때
            let user;

            var url = 'luna://com.ta.car2smarthome.service/signUp'; // JS 서비스의 signUp 서비스를 이용한다.
            var params = JSON.stringify({
                "email":email,
                "password":password,
                "name":name
            });

            webOSBridge.call(url, params);
            webOSBridge.onservicecallback = signUpCallback;

            function signUpCallback(msg){
                var response = JSON.parse(msg); 
                console.log("[SignUp:onSignUp callback] response :", response);
                let returnValue = response.Response;

                user = returnValue.user;
                console.log("[SignUp:onSignUp callback] user :", user);
                console.log("[SignUp:onSignUp callback] user.uid :", user.uid);

                
                createToast("회원가입 완료");
            };
        } else {
            createToast("입력 오류");
        };
    }

    const onGotoSignIn = () => {
        history.goBack();
    }

    return(
        <div className="sign-up">
            <div className="sign-up__box">
                <h3>E-Mail 회원가입</h3>
                <div className="input-box">
                    <input type="email" value={email} onChange={onEmailChange} maxlength='30' placeholder="이메일을 입력하세요." required />
                    <label for="email">E-mail</label>
                </div>    
                <div className="input-box">
                    <input type="text" value={name} onChange={onNameChange} maxlength='10'  placeholder="이름을 입력하세요." required />
                    <label for="name">Name</label>
                </div>    
                <div className="input-box">
                    <input type="password" value={password} onChange={onPasswordChange} maxlength='30'  placeholder="비밀번호를 입력하세요." required />
                    <label for="password">Password</label>
                </div>     
                <div className="input-box">
                    <input type="password" value={passwordCert} onChange={onPasswordCertChange} maxlength='30'  placeholder="비밀번호를 다시 입력하세요." required />
                    <label for="password">Password Cert</label>
                </div> 
                <br />
                <div className="button__box">
                    <button className="button" value="가입" onClick={onSignUp}>
                        <span className="material-icons">assignment_ind</span>
                        가입
                    </button>
                    <button className="button" value="취소" onClick={onGotoSignIn}>
                        <span className="material-icons">reply</span>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUp;