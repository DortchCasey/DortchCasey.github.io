document.addEventListener("DOMContentLoaded", function(){

var imagesToLoad = document.querySelectorAll('img[data-src]');
var loadImages = function(image){
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = function(){
        image.removeAttribute('data-src');
    };

};
if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(images, observer){
        images.forEach(function(image){
            if(image.isIntersecting){
                loadImages(image.target);
                observer.unobserve(image.target);
            }
        });
    });
    imagesToLoad.forEach(function(img){
        observer.observe(img);
    });
}
else {
    imagesToLoad.forEach(function(img){
        loadImages(img);
    });
}

});