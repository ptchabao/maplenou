"use_strict";

var Theme = (function () {

  themeInit = function() {
     // Elements to inject
    var mySVGsToInject = document.querySelectorAll('img.svg-icon');
   
    // Do the injection
    SVGInjector(mySVGsToInject);
    var starRatingControl = new StarRating('.star-rating', {
      showText: true
    });
  


    
  }

  
    



    


  
  return {
    init: function () {
      themeInit();
    }
  }

})();


if (document.readyState !== 'loading') {
 Theme.init();
} else {
 document.addEventListener('DOMContentLoaded', Theme.init);
}