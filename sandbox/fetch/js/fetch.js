var url= "../fetch/js/idahoweather.json";
var hour;
var sessStore = window.sessionStorage;

function getweatherData(url){
fetch(url)
 .then(function(response) {
   if(response.ok){
     return response.json();
   }
   throw new ERROR('Network response was not OK.');
 })
 .then(function(data){
     console.log(data);
 let cityName = data.Preston.properties.relativeLocation.properties.city;
 console.log(cityName);
 
 sessStore.setItem("cityName", cityName);
 document.querySelector("#head1").innerHTML=cityName;

let hourURL= data.Preston.properties.forecastHourly;
getHourly(hourURL);

 })
 .catch(function(error){
console.log('There was a fetch problem: ', error.message);
 })
}

getweatherData(url);



function getHourly(URL){
  fetch(URL).then(function(response) {
    if(response.ok){
      return response.json();
    }
    throw new ERROR('Network response was not OK.');
  })
  .then(function(data){
    console.log(data);
  })
}