import {useState } from "react";
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";

import "./SignUp.css"

const SignUp = () => {
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

    const onCancel = () => {
        history.push('/');
    }

    return(
        <div className="email-form">
            <h3>E-Mail 로그인</h3>
            <div className="email-contents">
                <div className="input-box">
                    <input type="email" value={email} onChange={onEmailChange} placeholder="이메일을 입력하세요." required />
                    <label for="email">E-mail</label>
                </div>    
                <div className="input-box">
                    <input type="email" value={email} onChange={onEmailChange} placeholder="이름을 입력하세요." required />
                    <label for="email">Name</label>
                </div>    
                <div className="input-box">
                    <input type="password" value={password} onChange={onPasswordChange} placeholder="비밀번호를 입력하세요." required />
                    <label for="password">Password</label>
                </div>     
                <div className="input-box">
                    <input type="password" value={password} onChange={onPasswordChange} placeholder="비밀번호를 입력하세요." required />
                    <label for="password">Password Cert</label>
                </div> 
                <br />
                <Button value="로그인" />
                <Button value="취소" onClick={onCancel} />
            </div>
        </div>
    );
}

export default SignUp;