//import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";
import Home from "../views/Home/Home";
import Mode from "../views/Mode/Mode";
import Schedule from "../views/Schedule/Schedule";

const App = function () {
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
					<Route path="/mode">
						<Mode />
					</Route>
					<Route path="/schedule">
						<Schedule />
					</Route>
					<Redirect to="/" />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
export {App};