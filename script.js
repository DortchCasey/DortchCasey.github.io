/*Simple js to dynamicaly get the copyright year 
and the time the document was last modified. */
let lastModif = new Date(document.lastModified);
let curYear= new Date();
window.onload = function(){
    function loadYear(){
    document.getElementById('copyRightYear').innerHTML=curYear.getFullYear();
    document.getElementById('lastModYear').innerHTML=lastModif;
    }
}
/*end*/
