import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class Login extends React.Component {

	LoginFunc = () => {
		
		const user = document.getElementById("user");
		const pin = document.getElementById("pin");
		const data = {
			userNumber: user.value,
			pin: pin.value
		};
		this.props.postFunc("/api/login", data).then((res) => {
			if (res.status === "success"){
				localStorage.setItem("userNumber", user.value);
				this.props.history.push("/");
			} else {
				user.value = "";
				pin.value = "";
			}
		});
	}

	LoginButton = withRouter(({history}) => 
		<button className="navBtn" onClick={() => {
			this.LoginFunc();
			if (localStorage.getItem("userNumber")!=null)
				history.push("/");
		}}>Login</button>
	);
	
	render() {
		return (
			<div className="login">
				<div className="flex rightTilt"><div>
					<p>Your Number: <br/><input id="user" type="number"/></p><br/>
					<p>Your PIN: <br/><input id="pin" type="number"/></p>
				</div></div>
				<div className="flex leftTilt"><div><Link to="/newUser" className="navBtn">New User</Link></div></div>
				<div className="flex rightTilt"><div><button className="navBtn" onClick={() => this.LoginFunc()}>Login</button></div></div>
			</div>
		);
	}
}
export default withRouter(Login);
