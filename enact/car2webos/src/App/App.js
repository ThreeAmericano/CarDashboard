//import {useState, useEffect} from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";
import Home from "../views/Home/Home";

//import './App.css';

const App = function () {
	/*
	const [loginFlag, setLoginFlag] = useState(false);
	const [user, setUser] = useState({
		name: '홍길동'
	});
	<SignIn setLoginFlag={setLoginFlag} setUser={setUser} />
	*/
	return(
		<div>
			<Router>
				<Switch>
						<Route exact path="/">
							<SignIn />
						</Route>
						<Route path="/sign-up">
							<SignUp />
						</Route>
						<Route path="/home">
							<Home />
						</Route>
						<Redirect to="/" />
					</Switch>
			</Router>
		</div>
	);
}

export default App;
export {App};