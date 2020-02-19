document.addEventListener("DOMContentLoaded", function(){

if(screen.width < 681){

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
}
else {
    var imagesToLoad = document.querySelectorAll('img[srcset]');
    var loadImages = function(image){
        image.setAttribute('srcset', image.getAttribute('data-src'));
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
}
});