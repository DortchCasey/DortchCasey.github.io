/*Simple js to dynamicaly get the copyright year 
and the time the document was last modified. */
var lastModif = new Date(document.lastModified);
var curDate= new Date();
var days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var months=['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September',
'October', 'November', 'December']
window.onload = function(){
    loadYear();
    function loadYear(){
    document.getElementById('copyRightYear').innerHTML=curYear.getFullYear();
    document.getElementById('lastModYear').innerHTML=days[lastModif.getDay()]+", "+lastModif.getDate()+
        " "+months[lastModif.getMonth()]+" "+lastModif.getFullYear(); //Wednesday, 24 July 2020
    }
    /*for the responsive hamburger menu*/

    document.querySelector(".menu").addEventListener("click",showMenu);

    
};
function showMenu(){
    document.querySelector(".navigation").classList.toggle("responsive");
};
/*end*/


