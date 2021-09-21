//import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";


import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";
import Home from "../views/Home/Home";
import Mode from "../views/Mode/Mode";
import Schedule from "../views/Schedule/Schedule";
import Alarm from "../views/Alarm/Alarm";
import Appliance from "../views/Appliance/Appliance"

const App = function () {
	return(
		<div>
			<Router>
				<Switch>
					<Route exact path="/">
						<SignIn />
					</Route>
					<Route exact path="/sign-up">
						<SignUp />
					</Route>
					<Route exact path="/home">
						<Home />
					</Route>
					<Route exact path="/mode">
						<Mode />
					</Route>
					<Route exact path="/schedule">
						<Schedule />
					</Route>
					<Route exact path="/alarm">
						<Alarm />
					</Route>
					<Route exact path="/appliance">
						<Appliance />
					</Route>
					<Redirect to="/" />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
export {App};