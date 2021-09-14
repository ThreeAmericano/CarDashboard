import React from 'react';
import {HashRouter as Router, Redirect, Route, Switch} from "react-router-dom";

import SignIn from "../views/SignIn/SignIn";
import SignUp from "../views/SignUp/SignUp";
import Home from "../views/Home/Home";
 
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
					<Redirect to="/" />
				</Switch>
			</Router>
		</div>
	);
};

export default App;
export {App};