/* eslint-disable */
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button/Button";

import "./SignIn.css"

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

        //setLoginFlag(true);
    };

    const onSignUp = () => {
        history.push('/sign-up');
    };

    const onRetry = async() => {
        setRetryFlag(false);
        //await visionSignIn();
        setRetryFlag(true);
    };

    return(
        <div className="sign-in">
            <div className="sign-in-form">
                <div className="face-recognation-form">
                    <div className="video-contents">
                        <div>asdf</div>
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