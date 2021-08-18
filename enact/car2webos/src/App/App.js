import React, {useState, useEffect} from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";

const App = () => {
	const [loginFlag, setLoginFlag] = useState(false);
	const [user, setUser] = useState({
		name: '홍길동',
		job: '구급대원',
	});
	return(
		<Router>
			<Switch>
					<Route exact path="/">
						<SignIn setLoginFlag={setLoginFlag} setUser={setUser} />
					</Route>
					<Route path="/sign-up">
						<SignUp />
					</Route>
					<Redirect to="/" />
				</Switch>
		</Router>
	);
}

export default App;