'use strict';

/****************************************
 * Global Variables
 ****************************************/
var pageNav = document.querySelectorAll('.navigation');
var statusContainer = document.querySelector('#status');
var contentContainer = document.querySelector('#wrapper');
var sessStore = window.sessionStorage;
var locStore = window.localStorage;
var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
/* *************************************
*  Wind and Shine JavaScript Functions
************************************* */

// Listen for the DOM to finish building
document.addEventListener("DOMContentLoaded", function(){
    loadYear();
    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener('click', showMenu);
    let url = "../js/idahoweather.json";
    getweatherData(url);
})


//Variables for loadYear function, which retrieves the dates for the page footer.
var lastModif = new Date(document.lastModified);
var curDate= new Date();
var days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months=['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September',
'October', 'November', 'December'];

//function for Last Modified date and Current Date, gets the day, month, and year for each.
    function loadYear(){
    document.getElementById('copyRightYear').innerHTML=curDate.getFullYear();
    document.getElementById('lastModYear').innerHTML=days[lastModif.getDay()]+", "+lastModif.getDate()+
        " "+months[lastModif.getMonth()]+" "+lastModif.getFullYear() + ' Current Date: '+ days[curDate.getDay()]+", "+curDate.getDate()+
        " "+months[curDate.getMonth()]+" "+curDate.getFullYear();
    }

    function showMenu(){
        const navList = document.querySelector('.navigation');
        navList.classList.toggle("responsive");
    }

//function for calculating windchill tempurature
function buildWC(speed, temp){
    //Get where we need to place the windchill
    let feelTemp = document.getElementById('feelTemp');
    //Compute the windchill
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);
    // Round the answer down to integer
    wc = Math.floor(wc);
    console.log(wc);
    // If chill is greater than temp, return the temp
    wc = (wc > temp)?temp:wc;
    console.log(wc);
    //Build the windchill
    return wc;
}

// Time Indicator Function
function timeBall(hour){
    // Find all "ball" classes and remove them
    let x = document.querySelectorAll(".smallCircle");
    for (let item of x) {
        console.log(item);
        item.classList.remove("smallCircle");
    }
    
    // Find all hours that match the parameter and add the "ball" class
    let hr = document.querySelectorAll(".hour" + hour);
    for (let item of hr){
        item.classList.add("smallCircle");
        console.log(item);
    }
}

//Change the background
function changeBackground(condition){
    condition = condition.toLowerCase();
    if((condition.search('rain') > 0)||(condition.search('rainy') > 0)){
        condition = 'rain';
    }
    else if((condition.search('snow') > 0)||(condition.search('snowy') > 0)||(condition.search('sleet') > 0)){
        condition = 'snow';
    }
    else if((condition.search('fog') > 0)||(condition.search('foggy') > 0)){
        condition = 'fog';
    }
    else if((condition.search('clouds') > 0)||(condition.search('cloudy') > 0)){
        condition = 'clouds';
    }
    else if((condition.search('clear') > 0)||(condition.search('sunny') > 0)){
        condition = 'clear';
    }

    

    let background= document.querySelector(".background");
    background.classList.add(condition);
}

//fetches the data for the city, including the name, temp, location, and more.
function getweatherData(weatherURL){
    let cityName = document.querySelector('#active').innerHTML // The data we want from the weather.json file
    fetch(weatherURL)
    .then(function(response) {
    if(response.ok){
    return response.json();
    }
    throw new ERROR('Network response was not OK.');
    })
    .then(function(data){
      // Check the data object that was retrieved
      console.log(data);
      // data is the full JavaScript object, but we only want the preston part
      // shorten the variable and focus only on the data we want to reduce typing
      let p = data[cityName];
      console.log(p);
      // **********  Get the location information  **********
      let locName = p.properties.relativeLocation.properties.city;
      let locState = p.properties.relativeLocation.properties.state;
      // Put them together
      let fullName = locName+', '+locState;
      // See if it worked, using ticks around the content in the log
      console.log(`fullName is: ${fullName}`);
      // Get the longitude and latitude and combine them to
      // a comma separated single string
      const latLong = p.properties.relativeLocation.geometry.coordinates[1] + ", "+ p.properties.relativeLocation.geometry.coordinates[0];
      console.log(latLong);
      // Create a JSON object containing the full name, latitude and longitude
      // and store it into local storage.
      const prestonData = JSON.stringify({fullName,latLong});
      locStore.setItem("Preston,ID", prestonData);
      // **********  Get the current conditions information  **********
      // As the data is extracted from the JSON, store it into session storage
      sessStore.setItem("fullName", fullName);
      sessStore.setItem("latLong", latLong);
      // Get the temperature data
      let tempNow = p.properties.relativeLocation.properties.temperature;
      let tempHigh = p.properties.relativeLocation.properties.highTemp;
      let tempLow = p.properties.relativeLocation.properties.lowTemp;
      sessStore.setItem("tempNow",tempNow);
      sessStore.setItem("tempHigh",tempHigh);
      sessStore.setItem("tempLow",tempLow);
      // Get the wind data 
      let windSpeed = p.properties.relativeLocation.properties.windSpeed;
      let windGust = p.properties.relativeLocation.properties.windGust;
      sessStore.setItem("windSpeed",windSpeed);
      sessStore.setItem("windGust",windGust);
      // Get the hourly data using another function - should include the forecast temp, condition icons and wind speeds. The data will be stored into session storage.
      getHourly(p.properties.forecastHourly);

    })
    .catch(function(error){
    console.log('There was a fetch problem: ', error.message);
    statusContainer.innerHTML = 'Sorry, the data could not be processed.';
    })
  }

  //get hour data
  function getHourly(URL) {
    fetch(URL)
     .then(function (response) {
      if (response.ok) {
       return response.json();
      }
      throw new ERROR('Response not OK.');
     })
     .then(function (data) {
      console.log('Data from getHourly function:');
      console.log(data); // Let's see what we got back
   
      // Store 12 hours of data to session storage  
      var hourData = [];
      let todayDate = new Date();
      var nowHour = todayDate.getHours();
      console.log(`nowHour is ${nowHour}`);
      for (let i = 0, x = 11; i <= x; i++) {
       if (nowHour < 24) {
        hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windSpeed + "," + data.properties.periods[i].icon;
        sessStore.setItem(`hour${nowHour}`, hourData[nowHour]);
        nowHour++;
       } else {
        nowHour = nowHour - 12;
        hourData[nowHour] = data.properties.periods[i].temperature + "," + data.properties.periods[i].windSpeed + "," + data.properties.periods[i].icon;
        sessStore.setItem(`hour${nowHour}`, hourData[nowHour]);
        nowHour = 1;
       }
      }
   
      // Get the shortForecast value from the first hour (the current hour)
      // This will be the condition keyword for setting the background image
      sessStore.setItem('shortForecast', data.properties.periods[0].shortForecast);
   
      // Call the buildPage function
      buildPage();
     })
     .catch(error => console.log('There was a getHourly error: ', error))
   }

   //build the actual page
   function buildPage() {
    // Set the title with the location name at the first
    // Gets the title element so it can be worked with
    let pageTitle = document.querySelector('#pageTitle');
    // Create a text node containing the full name 
    let fullNameNode = document.createTextNode(sessStore.getItem('fullName'));
    // inserts the fullName value before any other content that might exist
    pageTitle.insertBefore(fullNameNode, pageTitle.childNodes[0]);
    // When this is done the title should look something like this:
    // Preston, Idaho | The Weather Site                    
    // Get the h1 to display the city location
 let contentHeading = document.querySelector('#cityName');
 contentHeading.innerHTML = sessStore.getItem('fullName');
 
 // Get the coordinates container for the location
 let latLong = document.querySelector('#gpsLocation');
 latLong.innerHTML = sessStore.getItem('latLong');
 // The latitude and longitude should match what was stored in session storage.

 // Get the condition keyword and set Background picture
changeBackground(sessStore.getItem('shortForecast'));
/* Keep in mind that the value may be different than 
what you need for your CSS to replace the image. You 
may need to make some adaptations for it to work.*/

    // **********  Set the current conditions information  **********
    // Set the temperature information
    let highTemp = $('#tempHigh');
    let loTemp = $('#tempLow');
    let currentTemp = $('#tempNow');
    let feelTemp = $('#feelTemp');
    $('#tempurature .midCircle').innerHTML=sessStore.getItem('tempNow');
    $('#wind .midCircle').innerHTML=sessStore.getItem('windSpeed');
    
    highTemp.innerHTML = sessStore.getItem('tempHigh') + "°F";
    loTemp.innerHTML = sessStore.getItem('tempLow') + "°F";
    currentTemp.innerHTML = sessStore.getItem('tempNow') + "°F";
    // Set the wind information
    let speed = $('#windSpeed');
    let gust = $('#gusts');
    speed.innerHTML = sessStore.getItem('windSpeed');
    gust.innerHTML = sessStore.getItem('windGust');
    // Calculate feel like temp
    feelTemp.innerHTML = buildWC(sessStore.getItem('windSpeed'), sessStore.getItem('tempNow')) + "°F";
    // **********  Set the Time Indicators  **********
    let thisDate = new Date();
    var currentHour = thisDate.getHours();
    let indicatorHour;
    // If hour is greater than 12, subtract 12
    if (currentHour > 12) {
    indicatorHour = currentHour - 12;
    } else {
    indicatorHour = currentHour;
    };
    console.log(`Current hour in time indicator is: ${currentHour}`);
    // Set the time indicator
    timeBall(indicatorHour);

    // ********** Hourly Temperature Component  **********
// Get the hourly data from storage as an array
let currentData = [];
let tempHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (tempHour <= 23) {
  currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
  tempHour++;
 } else {
  tempHour = tempHour - 12;
  currentData[i] = sessStore.getItem('hour' + tempHour).split(",");
  console.log(`CurrentData[i][0] is: ${currentData[i][0]}`);
  tempHour = 1;
 }
}
console.log(currentData);

// Loop through array inserting data
// Start with the outer container that matchs the current time
tempHour = currentHour;
for (let i = 0, x = 12; i < x; i++) {
 if (tempHour >= 13) {
  tempHour = tempHour - 12;
 }
 console.log(`Start container is: #tempurature out.${tempHour}`);
 $('#tempurature .out' + tempHour).innerHTML = currentData[i][0];
 tempHour++;
}

    // ********** Hourly Wind Component  **********
// Get the hourly data from storage
let windArray = [];
let windHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (windHour <= 23) {
  windArray[i] = currentData[i][1].split(" ");
  console.log(`windArray[i] is: ${windArray[i]}`);
  windHour++;
 } else {
  windHour = windHour - 12;
  windArray[i] = currentData[i][1].split(" ");
  windHour = 1;
 }
}
console.log(windArray);

// Insert Wind data
// Start with the outer container that matchs the time indicator
windHour = currentHour;
for (let i = 0, x = 12; i < x; i++) {
 if (windHour >= 13) {
  windHour = windHour - 12;
 }
 $('#wind .out' + windHour).innerHTML = windArray[i][0];
 windHour++;
}
    
    // **********  Condition Component Icons  **********
let conditionHour = currentHour;
// Adjust counter based on current time
for (let i = 0, x = 12; i < x; i++) {
 if (conditionHour >= 13) {
  conditionHour = conditionHour - 12;
 }

 $('#conditions .out' + conditionHour).innerHTML = '<img src="' + currentData[i][2] + '" alt="hourly weather condition image">';
 conditionHour++;
}
document.getElementById("conditionsMid").style.background = "url("+ currentData[0][2] +") no-repeat";
document.getElementById("conditionsMid").style.backgroundSize = "cover";
//$('#conditions .midCircle').setAttribute('background-image', 'url("'+ currentData[0][2] +')');
//$('#conditions .midCircle').setAttribute('background-size', 'cover');

    //'<img src="' + currentData[0][2] + '" alt="hourly weather condition image">';

// Change the status of the containers
contentContainer.setAttribute('class', ''); // removes the hide class from main
statusContainer.setAttribute('class', 'hide'); // hides the status container

   }
   
   