import React from 'react';
import { withRouter } from 'react-router-dom';

class NewUser extends React.Component {
	componentDidMount(){
		this.getUser();
	}

	getUser() {
		if (localStorage.getItem("userNumber")==null){
			this.props.postFunc("/api/newUser", {}).then((res) => {
				if (res.status === "success"){
					localStorage.setItem("userNumber", res.userNumber);
					localStorage.setItem("pin", res.pin);
					this.props.history.push("/newUser");
				}
			});
		}
	}

	render() {
		return (
			<div className="login">
				{localStorage.getItem("userNumber")==null?<div className="flex leftTilt"><p>Loading...</p></div>:
				<div className="flex rightTilt">
					<h1>Your Number is: {localStorage.getItem("userNumber")}<br/>Your PIN is: {localStorage.getItem("pin")}</h1>
				</div>}
			</div>
		);
	}
}
export default withRouter(NewUser);
