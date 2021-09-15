/* eslint-disable */
import {useState } from "react";
import {useHistory} from "react-router-dom";
//import Button from '@enact/sandstone/Button';
//import Button from "../../components/Button/Button";

import "./SignUp.css"
import "../../../resources/css/sam_style.css"

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
        <div className="sign-up">
            <div className="sign-up__box">
                <h3>E-Mail 회원가입</h3>
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
                <div className="button__box">
                    <button class="button" value="가입">
                        <span class="material-icons">assignment_ind</span>
                        가입
                    </button>
                    <button class="button" value="취소" onClick={onCancel}>
                        <span class="material-icons">reply</span>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUp;