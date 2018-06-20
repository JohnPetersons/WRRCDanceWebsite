import React from 'react';

class Messages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: this.props.items!=null?this.props.items:[],
			personal: this.props.personal!=null?this.props.personal:false,
			lastMessageTime: 0,
			updateFunc: null,
			newMessage: true
		};
	}

	updateFunc(first) {
		let data = {
			userNumber: this.props.personal?localStorage.getItem("userNumber"):"public",
			time: this.state.lastMessageTime
		};
		this.props.postFunc("/api/messages", data).then((res) => {
			this.setState((prev, props) => ({
				items: prev.items.concat(res.messages!=null?res.messages:[]),
				lastMessageTime: res.time!=null?res.time:0,
				updateFunc: setTimeout(() => this.updateFunc(false), this.props.personal?5000:3000),
				newMessage: res.messages!=null?res.messages.length!==0:false
			}))
		}, (err) => console.log(err));
	}

	componentDidMount(){
		if (this.props.postFunc != null)
			this.updateFunc(true);
	}

	componentWillUnmount() {
		if (this.state.updateFunc != null)
			clearTimeout(this.state.updateFunc);
	}

	render() {
		const {
			items,
			newMessage
		} = this.state;
		let left = true;
		let i = 0;
		if (newMessage)
			setTimeout(()=>document.getElementById("content").scrollTop = document.getElementById("content").scrollHeight, 1);
		return (
			<div id="messages" className="messages">
				{items.map((item) => {
					left = !left;
					return <div key={i++} className={left?"flex leftTilt":"flex rightTilt"}><p className="m">{item.text}</p></div>
				})}
			</div>
		);
	}
}
export {Messages};
