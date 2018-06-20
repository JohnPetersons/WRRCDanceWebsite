import React from 'react';
import { Link } from 'react-router-dom';

class Logout extends React.Component {
	render() {
		return (
			<div className="login">
				<div className="flex rightTilt"><div><Link to="/" className="navBtn" onClick={() => {
					localStorage.removeItem("userNumber");
				}}>Click here to Logout</Link></div></div>
			</div>
		);
	}
}
export {Logout};
