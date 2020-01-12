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
};
/*end*/
