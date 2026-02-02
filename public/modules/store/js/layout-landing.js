"use_strict";

var LayoutLanding = (function () {

  layoutLandingInit = function() {

    let headerTwo = document.querySelector('.nav-layout-landing');
    let body = document.body;

    function stickyBarTwo() {
      
        if (window.pageYOffset > headerTwo.offsetHeight) {
          body.classList.add("sticky-header-3")
        } else {
          body.classList.remove("sticky-header-3")
        }
     
    }
    

    window.onscroll = function() {
      stickyBarTwo();
      
    }
    
    

    
    
    
    
  }

 


    


  
  return {
    init: function () {
      layoutLandingInit();
    }
  }

})();


if (document.readyState !== 'loading') {
  LayoutLanding.init();
} else {
 document.addEventListener('DOMContentLoaded', LayoutLanding.init);
}