import React from 'react';
import ReactDOM from 'react-dom';

import {Messages} from './messages';
import Login from './login';
import {Logout} from './logout';
import NewUser from './newUser';
import {Send} from './send';

import './index.css';

import { HashRouter, Link, Route } from 'react-router-dom';


class Page extends React.Component {

	post = (api, postData) => {
		return new Promise((resolve, reject) => {
			fetch(api, {
				method: 'POST',
				headers: {
				  'Accept': 'application/json',
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(postData)}).then((res) => {
				if (res.status !== 200) return {};
				return res.json();
			}).then((data) => resolve(data));			
		});
	};

	render() {
		const sendOptions = [{
			code: 0,
			text: "You are interested."
		},{
			code: 1,
			text: "You'd like to grab a drink."
		},{
			code: 2,
			text: "They have a nice smile."
		},{
			code: 3,
			text: "You like their moves."
		},{
			code: 4,
			text: "You would like to dance."
		},{
			code: 5,
			text: "You want a picture with them."
		},{
			code: 6,
			text: "You would like directions to their heart."
		},{
			code: 7,
			text: "You want to know how heaven was doing."
		},{
			code: 8,
			text: "They don't need keys to drive you crazy."
		},{
			code: 9,
			text: "You think they are hot."
		}];
		return (
			<div>
			
			<div className="page">
				<div className="darken yellow"></div>
				<NavBar/>
				<div id="content" className="content">
					<Route exact={true} path="/" component={() => <Messages postFunc={this.post}/>}/>
					<Route path="/login" component={() => <Login postFunc={this.post}/>}/>
					<Route path="/logout" component={() => <Logout postFunc={this.post}/>}/>
					<Route path="/newUser" component={() => <NewUser postFunc={this.post}/>}/>
					<Route path="/send" component={() => <Send options={sendOptions} postFunc={this.post}/>}/>
					<Route path="/messages" component={() => <Messages personal={true} postFunc={this.post}/>}/>
				</div>
			</div>
			</div>
		);
	}
}

class NavBar extends React.Component {
	render() {
		return (
			<div>

				<div className="blackBar"></div>
			<div className="navBarHeaderContainer">
				<div className="navBarHidden">
					<img src={require("./images/boombox.png")} className="backgroundImg" alt="Missing File"/>
				</div>
				<nav className="navBar">
					<div className="spacer"></div>
					<Link to="/" className="navBtn">Home</Link>
					<div className="spacer"></div>
					{localStorage.getItem("userNumber") == null?null:<Link to="/messages" className="navBtn">Inbox</Link>}
					{localStorage.getItem("userNumber") == null?null:<div className="spacer"></div>}
					{localStorage.getItem("userNumber") == null?<Link to="/login" className="navBtn">Login</Link>:null}
					{localStorage.getItem("userNumber") == null?null:<Link to="/send" className="navBtn">Send Message</Link>}
					{localStorage.getItem("userNumber") == null?null:<div className="spacer"></div>}
					{localStorage.getItem("userNumber") == null?null:<Link to="/logout" className="navBtn">Logout</Link>}
					<div className="spacer"></div>
				</nav>
				<div className="header">
					<h1>Retro Grindr</h1><br/>
					<a className="navBtn" href="https://yourwrrc.ca/">WRRC Website</a>
				</div>
				<div className="header2">
					<p>
					<Route exact={true} path="/" component={() => "Home"}/>
					<Route path="/login" component={() => "Login"}/>
					<Route path="/logout" component={() => "Logout"}/>
					<Route path="/newUser" component={() => "New User"}/>
					<Route path="/send" component={() => "Send Message"}/>
					<Route path="/messages" component={() => "Inbox"}/>
					</p>
				</div>
			</div>
			</div>
		);
	}
}

ReactDOM.render(
	<HashRouter>
        <Page />
    </HashRouter>,
	document.getElementById("root")
);
