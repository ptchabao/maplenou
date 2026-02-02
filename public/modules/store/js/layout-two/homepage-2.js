"use_strict";

var Homepage = (function () {

  homeInit = function() {
   
    
    let headerTwo = document.querySelector('.header-2');
    

    // var sticky = navbar.offsetTop;
    var body = document.body;
    let boxBtnToggle = document.querySelector(".box-toggle");
    // box-wrapper 
    function boxToggle() {
      var element = document.querySelector(".box-sidebar");
      var classes = element.className.split(" ");
      var i = classes.indexOf("open");
  
      if (i >= 0) 
        classes.splice(i, 1);
      else 
        classes.push("open");
        element.className = classes.join(" "); 
      
    }
    if(boxBtnToggle){
      boxBtnToggle.addEventListener('click', boxToggle);
    
    }

    // end::box-wrapper 
    function stickyBar() {
      
        if (window.pageYOffset > headerTwo.offsetHeight) {
          body.classList.add("sticky-header-2")
        } else {
          body.classList.remove("sticky-header-2")
        }
     
    }


    
    
    //  rangeable 
    if(document.querySelector(".double-range-resturant")){
      const slider = new Rangeable(".double-range-resturant", {
        type: "double",
        tooltips: 'always',
        min: 0,
        max: 100,
        value: [22, 74]
      });
    }
  
    

    window.onscroll = function() {
      stickyBar();
    }
    
    

    
    
    
    
  }

 


    


  
  return {
    init: function () {
      homeInit();
    }
  }

})();


if (document.readyState !== 'loading') {
  Homepage.init();
} else {
 document.addEventListener('DOMContentLoaded', Homepage.init);
}