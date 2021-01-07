import express from 'express';
import dotenv from 'dotenv';
import cron from 'node-cron';
import schedule from 'node-schedule';
import connectDB from './config/db.js';
import Model from './models/model.js';

dotenv.config();

connectDB();

const app = express();

let arr = ['A', 'B', 'C', 'D', 'E'];

function every(sec) {
	let date = new Date();
	let h = date.getHours();
	let m = date.getMinutes();
	let s = date.getSeconds();
	arr.map((ele) => {
		Model.create({ element: ele, intervalTime: sec });
		console.log(`Running every ${sec} seconds with ${ele} started at ${h}:${m}:${s}`);
	});
}

let interval10 = setInterval(() => {
	every(10);
	// console.log(`running in every 10 according to time`);
}, 10 * 1000);

let interval60 = setInterval(() => {
	every(60);
	// console.log('running in every 60');
}, 60 * 1000);

setInterval(() => {
	let date = new Date();
	let h = date.getHours();
	let m = date.getMinutes();
	if (h >= 9 && m >= 30 && h <= 16 && m <= 30) {
		clearInterval(interval60);
		interval10;
	} else {
		clearInterval(interval10);
		interval60;
	}
}, 1 * 1000);

// function every10(time) {
// 	let date = new Date();
// 	let h = date.getHours();
// 	let m = date.getMinutes();
// 	let s = date.getSeconds();
// 	Model.create({ element: time.ele, intervalTime: time.seconds });
// 	console.log(
// 		`running a task every ${time.seconds} seconds - started @ ${time.hours}:${time.minutesStart} - ${time.ele}`
// 	);
// }

// // Cron Scheduled to run every 10 seconds in time interval
// arr.map((ele) => {
// 	let time = {
// 		seconds: 10,
// 		hours: 20,
// 		// hourEnd : 16,
// 		minutesStart: 13,
// 		minutesEnd: 14,
// 		ele,
// 	};

// 	cron.schedule(
// 		`*/${time.seconds} ${time.minutesStart}-${time.minutesEnd} ${time.hours} * * *`,

// 		every10(time),
// 		stop10(),
// 		{
// 			scheduled: true,
// 		}
// 	);
// });
// // Cron Scheduled to run every 60 seconds in a time interval
// arr.map((ele) => {
// 	let time = {
// 		seconds: 60,
// 		hours: 19,
// 		hourEnd: 9,
// 		minutesStart: 11,
// 		minutesEnd: 13,
// 		ele,
// 	};

// 	cron.schedule(
// 		`*/${time.seconds} ${time.minutesStart}-${time.minutesEnd} ${time.hours} * * *`,
// 		function () {
// 			every60(time);
// 		},
// 		{
// 			scheduled: true,
// 		}
// 	);
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));
