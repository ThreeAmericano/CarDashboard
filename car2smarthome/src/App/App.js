//import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import {useState } from "react";

import SignIn from "../views/SignIn/SignIn";			// 시작 시 사인인 페이지
import SignUp from "../views/SignUp/SignUp";			// 회원가입 페이지
import Home from "../views/Home/Home";					// 홈 페이지
import Mode from "../views/Mode/Mode";					// 모드 설정 페이지
import Schedule from "../views/Schedule/Schedule";		// 스케줄 설정 페이지
import Alarm from "../views/Alarm/Alarm";				// 알람 + UI 모드 설정 페이지
import Appliance from "../views/Appliance/Appliance";	// 가전 상세 제어 페이지

const App = function () {
	const [darkMode, setDarkMode] = useState(false);

	return(
		<div style={{filter : darkMode ? 'invert(1)' : 'invert(0)'}}>
			<Router>
				<Switch>
					<Route exact path="/" component={SignIn} />
					<Route path="/sign-up" component={SignUp} />
					<Route path="/home">
						<Home darkMode={darkMode} setDarkMode={setDarkMode}/>
					</Route>
					<Route path="/mode" component={Mode} />
					<Route path="/schedule" component={Schedule} />
					<Route path="/appliance" component={Appliance} />
					<Route path="/alarm">
						<Alarm darkMode={darkMode} setDarkMode={setDarkMode}/>
					</Route>
					<Redirect to="/" />
				</Switch>
			</Router>
		</div>
	);
};


export default App;
export {App};