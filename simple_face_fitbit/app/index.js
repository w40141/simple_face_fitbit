import document from "document";
import clock from "clock";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import * as util from "../common/utils";

// Get a handle on the cycleview
// const statsCyle = document.getElementById("statsCyle");

// Get an array of cycle-items
// const items = statsCyle.getElementsByClassName("cycle-item");

let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");

let monthDate = document.getElementById("monthDate");
let day = document.getElementById("day");

let time = document.getElementById("time");
let steps = document.getElementById("steps");
let hrm = document.getElementById("hrm");
let btry = document.getElementById("battery")

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes, seconds) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  let secondAngle = (360/ 12 / 60 / 60) * seconds;
  return hourAngle + minAngle + secondAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes, seconds) {
  let minAngle = (360 / 60) * minutes;
  let secondAngle = (360/ 60 / 60) * seconds;
  return minAngle + secondAngle;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

function setMonthDate(val) {
  monthDate.text = val;
}

//日付のテキストセット
function setDate(val) {
  return util.zeroPad(val);
}

function setMonth(val) {
  return util.zeroPad(val + 1);
}

//曜日のテキストセット
//getDayにより0~6で曜日を取得できるためそれぞれを文字に対応
function setDay(val) {
  switch(val){
    case 0:
      day.style.fill="#800000";
      day.text="SUN";
      break;
    case 1: 
      day.style.fill="#FFA500";
      day.text="MON";
      break;
    case 2:
      day.style.fill="#DC143C";
      day.text="TUE";
      break;
    case 3:
      day.style.fill="#4169E1";
      day.text="WED";
      break;
    case 4:
      day.style.fill="#3CB371";
      day.text="THU";
      break;
    case 5:
      day.style.fill="#FFD700";
      day.text="FRI";
      break;
    case 6:
      day.style.fill="#CD853F";
      day.text="SAT";
      break;
  }
}

//バッテーリのテキストセット
function setBattery(val){
  btry.text = val;
}

//歩数のテキストセット
function setSteps(val){
  steps.text = val;
}

//心拍数のテキストセット
function setHeartRate(val){
  // items[1].text = val;
  hrm.text = val;
}

//時計の更新頻度を毎秒に設定
clock.granularity = "seconds";

// Rotate the hands every tick
function updateClock() {
  let d = new Date();
  let hours24 = d.getHours();
  let hours = hours24 % 12;
  let mins = d.getMinutes();
  let secs = d.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins, secs);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins, secs);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
  
  setMonthDate(setMonth(d.getMonth()) + "/" + setDate(d.getDate()));
  setDay(d.getDay());
  
  setBattery(util.spacePad(3, Math.floor(battery.chargeLevel)) + "%");
  
  time.text = util.zeroPad(hours24) + ":" + util.zeroPad(mins) + ":" + util.zeroPad(secs);
  
  setSteps(util.spacePad(5, today.local.steps));

  //心拍数
  var hr = new HeartRateSensor();
  hr.onreading = function() {
    setHeartRate(hr.heartRate);
    //Stop monitoring the sensor
    hr.stop();
    }
  //Begin monitoring the sensor
  hr.start();
}

// Update the clock every tick event
clock.addEventListener("tick", updateClock);