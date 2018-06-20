const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",  //The password for your mysql database
	database: "danceWebsite"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	let sql = ("CREATE DATABASE IF NOT EXISTS danceWebsite");
	con.query(sql, (err, result) => {
		if (err) throw err;
		console.log("danceWebsite database exists.")
		sql = "CREATE TABLE IF NOT EXISTS Users (UserID int NOT NULL AUTO_INCREMENT PRIMARY KEY, UserPIN varchar(255) NOT NULL)";
		con.query(sql, (err, result) => {
			if (err) throw err;
			console.log("Users table exists");
		});
		sql = "CREATE TABLE IF NOT EXISTS Messages (SenderID int, MessageID int, TargetID int, Time int)";
		con.query(sql, (err, result) => {
			if (err) throw err;
			console.log("Messages table exists");
		})
	});
});

const app = express();
const port = process.env.PORT || 5000;
let message = "5";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/api/messages', (req, res) => {
	let data = {messages:[],
		time: (new Date()).getTime(),
		status: "success"
	};
	con.connect(function(err) {
		if (!err) throw err;
		let sql = "SELECT * FROM ";
		if (req.body.userNumber != "public"){
			sql = sql.concat("Messages WHERE Time > '" + (req.body.time / 1000) + "'");
			sql = sql.concat(" AND TargetID = " + req.body.userNumber);
		} else {
			sql = sql.concat("(SELECT * FROM Messages ORDER BY Time DESC) as sortedMessages");
			sql = sql.concat(" WHERE Time > '" + (req.body.time / 1000) + "'");
			sql = sql.concat(" ORDER BY Time ASC LIMIT 50");
		}
		con.query(sql, (err, result) => {
			if (err) throw err;
			for (var i = 0; i < result.length; i++){
				let message = "";
				if (result[i].MessageID == 0)
					message = result[i].SenderID + " is interested in " + result[i].TargetID + ".";
				else if (result[i].MessageID == 1)
					message = result[i].SenderID + " would like to grab a drink with " + result[i].TargetID + ".";
				else if (result[i].MessageID == 2)
					message = result[i].SenderID + " wants " + result[i].TargetID + " to know they have a nice smile.";
				else if (result[i].MessageID == 3)
					message = result[i].SenderID + " likes " + result[i].TargetID + "'s' moves.";
				else if (result[i].MessageID == 4)
					message = result[i].SenderID + " would like to dance with " + result[i].TargetID + ".";
				else if (result[i].MessageID == 5)
					message = result[i].SenderID + " wants a picture with " + result[i].TargetID + ".";
				else if (result[i].MessageID == 6)
					message = result[i].SenderID + " would like to directions to " + result[i].TargetID + "'s heart'.";
				else if (result[i].MessageID == 7)
					message = result[i].SenderID + " asks " + result[i].TargetID + " how was heaven when you left?";
				else if (result[i].MessageID == 8)
					message = result[i].SenderID + " tells  " + result[i].TargetID + " they don't need keys to drive them crazy.";
				else if (result[i].MessageID == 9)
					message = result[i].SenderID + " thinks  " + result[i].TargetID + " is hot.";
				data.messages.push({
					text: message
				});
			}
			res.end(JSON.stringify(data));
		});
	});
});

app.post('/api/send', (req, res) => {
	message = req.body.messageCode;
	con.connect(function(err) {
		if (!err) throw err;
		let sql = "INSERT INTO Messages (SenderID, MessageID, TargetID, Time) VALUES ('" + req.body.userNumber + "', '" + req.body.messageCode + "', ' " + req.body.target + "', UNIX_TIMESTAMP())";
		con.query(sql, (err, result) => {
			if (err) throw err;
			res.end(JSON.stringify({status: "success"}));
		});
	});
});

app.post('/api/login', (req, res) => {
	con.connect(function(err) {
		if (!err) throw err;
		let sql = "SELECT UserPIN FROM Users WHERE UserID = '" + req.body.userNumber + "'"; 
		con.query(sql, (err, result) => {
			if (err) throw err;
			if (result.length > 0 && bcrypt.compareSync(req.body.pin, result[0].UserPIN)){
				res.end(JSON.stringify({
					status: "success"
				}));
			} else {
				res.end(JSON.stringify({
					status: "failure"
				}));
			}
		});
	});
});

app.post('/api/logout', (req, res) => {
	res.end(JSON.stringify({status: "success"}));
});

app.post('/api/newUser', (req, res) => {
	con.connect(function(err) {
		if (!err) throw err;
		let pin = parseInt(Math.random() * 899) + 100;
		let hash = bcrypt.hashSync("" + pin, saltRounds);
		let sql = "INSERT INTO Users (UserPIN) VALUES ('" + hash + "')"; 
		con.query(sql, (err, result) => {
			if (err) throw err;
			res.end(JSON.stringify({
				userNumber: result.insertId,
				pin: pin,
				status: "success"
			}));
		});
	});
});
app.listen(port, () => console.log(`Listening on port ${port}`));
