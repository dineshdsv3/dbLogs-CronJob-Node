import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Model from './models/model.js';
import cron from 'node-cron';
import schedule from 'node-schedule';

dotenv.config(); // To Trigger Enviroment Variable

connectDB(); // To Connect DB

const app = express();

let arr = ['A', 'B', 'C', 'D', 'E'];

// Need to define the time range here in our case (9:30 - 16-30)
let startHour = 18,
	startMin = 37;
let endHour = 18,
	endMin = 39;

// Function to store details in the DB
const every = (sec) => {
	let date = new Date();
	let h = date.getHours();
	let m = date.getMinutes();
	let s = date.getSeconds();
	arr.map((ele) => {
		Model.create({ element: ele, intervalTime: sec }); // To save the element in DB along with timestamp (Declared in model)
		console.log(`Running every ${sec} seconds with ${ele} started at ${h}:${m}:${s}`);
	});
};

// Used cron to run for every 10 seconds
let interval10 = cron.schedule(
	`*/10 * * * * *`,
	function () {
		every(10);
	},
	{
		scheduled: false,
	}
);
// used cron to run for every 60 seconds
let interval60 = cron.schedule(
	`*/60 * * * * *`,
	function () {
		every(60);
	},
	{
		scheduled: false,
	}
);

// Buffer Timers to run until the schedule is started
let buffer10 = cron.schedule(
	`*/10 * * * * *`,
	function () {
		every(10);
	},
	{
		scheduled: false,
	}
);
let buffer60 = cron.schedule(
	`*/60 * * * * *`,
	function () {
		every(60);
	},
	{
		scheduled: false,
	}
);

// Defined  schedule rule to start the interval10 and stop interval60 on the specified time
let startRule = new schedule.RecurrenceRule();
startRule.hour = startHour;
startRule.minute = startMin;
startRule.second = 1;

// This 10 seconds timer will run from the start time and ends when the specified duration completes
schedule.scheduleJob(startRule, function () {
	console.log('Normal Mode 10 sec Timer');
	interval10.start();
	interval60.stop();
	buffer10.stop();
	buffer60.stop();
});

// Defined  schedule rule to start the interval60-cron job and stop interval10-corn job on the specified time
let endRule = new schedule.RecurrenceRule();
endRule.hour = endHour;
endRule.minute = endMin;
endRule.second = 1;

// This 60 seconds will run and (10seconds timer will stop) after the time duration which we specified
schedule.scheduleJob(endRule, function () {
	console.log('Normal Mode 60 sec Timer');
	interval60.start();
	interval10.stop();
	buffer10.stop();
	buffer60.stop();
});

// Buffer Job to run until the timer starts
setImmediate(() => {
	let date = new Date();
	let h = date.getHours();
	let m = date.getMinutes();
	if (h >= startHour && h <= endHour) {
		if ((h === startHour && m <= startMin) || (h == endHour && m > endMin)) {
			console.log('Buffer mode');
			buffer60.start();
			buffer10.stop();
		} else {
			console.log('Buffer mode');
			buffer10.start();
			buffer60.stop();
		}
	} else {
		console.log('Buffer mode');
		buffer60.start();
		buffer10.stop();
	}
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`));
