/*Simple js to dynamicaly get the copyright year 
and the time the document was last modified. */
var lastModif = new Date(document.lastModified);
var curYear= new Date();
window.onload = function(){
    loadYear();
    function loadYear(){
    document.getElementById('copyRightYear').innerHTML=curYear.getFullYear();
    document.getElementById('lastModYear').innerHTML=lastModif;
    }
    /*for the responsive hamburger menu*/

    document.querySelector(".menu").addEventListener("click",showMenu);

    
};
function showMenu(){
    document.querySelector(".navigation").classList.toggle("responsive");
};
/*end*/


