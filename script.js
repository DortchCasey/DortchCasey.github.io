/*Simple js to dynamicaly get the copyright year 
and the time the document was last modified. */
let lastModif = new Date(document.lastModified);
let curYear= new Date();
document.getElementById('copyYear').innerHTML=curYear.getFullYear();
document.getElementById('lastModYear').innerHTML=lastModif;
/*end*/
