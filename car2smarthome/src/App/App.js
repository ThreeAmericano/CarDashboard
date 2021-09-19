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
					<Route exact path="/" match='0'>
						<SignIn />
					</Route>
					<Route exact path="/sign-up"  match={1}>
						<SignUp />
					</Route>
					<Route exact path="/home"  match={2}>
						<Home />
					</Route>
					<Route exact path="/mode"  match={3}>
						<Mode />
					</Route>
					<Route exact path="/schedule"  match={4}>
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