'use strict';

/* *************************************
*  Wind and Shine JavaScript Functions
************************************* */

// Listen for the DOM to finish building
document.addEventListener("DOMContentLoaded", function(){
    loadYear();
    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener('click', showMenu);
    let temp=31;
    let speed=5;
    buildWC(speed,temp);
    let hour = 7;
    timeBall(hour);
    let condition="snow";
    condition= condition.toLowerCase();
    changeBackground(condition);
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
    wc = wc + '&deg;F';
    feelTemp.innerHTML = wc;
    console.log(wc);
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

function changeBackground(condition){
    let background= document.querySelector(".background");
    background.classList.add(condition);
}