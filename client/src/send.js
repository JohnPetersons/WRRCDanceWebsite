import React from 'react';

class Send extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			status: 0,
			message: "",
			updateFunc: null
		}
	}

	send = () => {
		this.setState({
			status: 1,
			message: "Sending"
		});
		document.getElementById("sendBtn").disabled = true;
		this.props.postFunc("/api/send", {
			messageCode: document.getElementById("messageCode").value,
			userNumber: localStorage.getItem("userNumber"),
			target: document.getElementById("messageTarget").value}).then((res) => {
				this.setState({
					status: 2,
					message: "Sent",
					updateFunc: setTimeout(() => {
						document.getElementById("sendBtn").disabled = false;
						this.setState({
							status: 0,
							message: "",
							updateFunc: null
						});
					}, 2000)
				});
			});
	}

	componentWillUnmount() {
		if (this.state.updateFunc != null)
			clearTimeout(this.state.updateFunc);
	}

	render() { //status==1?"Sending...":"Sent"
		const {
			status,
			message
		} = this.state;
		return (
			<div className="messages">
				{status>0?<div className="flex rightTilt">
					<div><p>{message}</p></div>
				</div>:null}
				<div className="flex"><div><p>Tell # <input id="messageTarget" type="number"/></p><div className="selectBox"><select id="messageCode">
					{this.props.options.map((option) => <option key={option.code} value={option.code}>{option.text}</option>)}
				</select></div></div></div>
				<div className="flex rightTilt">
					<div><button id="sendBtn" className="navBtn" onClick={this.send}>Send</button></div>
				</div>
			</div>
		);
	}
}
export {Send};
