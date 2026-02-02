"use_strict";

var Homepage = (function () {

  homeInit = function() {
   
   
    var navbar = document.getElementById("topbar-header");
    var stickyBtn = document.querySelector(".ecom-dropdownmenu-fixed");
    let adminWrapLayout = document.querySelector(".app-adminwrap-layout");
    let salePage = document.querySelector(".sale-page");
    let homePageFour = document.querySelector(".homePageFour");
    let boxBtnToggle = document.querySelector(".box-toggle");
    let salePageTopID = document.getElementById("sale-page-top-one");
    let salePageTopIDTwo = document.getElementById("sale-page-top-two");
    let slider1 = document.querySelector('.slider-sec-1');
    let slider2 = document.querySelector('.slider-sec-2');
    let slider3_1 = document.querySelector('.slider-sec-3-1');
    let slider3_2 = document.querySelector('.slider-sec-3-2');
    let slider3 = document.querySelector('.slider-sec-3');
    let slider4 = document.querySelector('.slider-sec-4');
    let slider5 = document.querySelector('.slider-sec-5');
    let slider6 = document.querySelector('.slider-sec-6');
    let slider7 = document.querySelector('.slider-sec-7');
    let slider8 = document.querySelector('.slider-sec-8');
    let slider9 = document.querySelector('.slider-sec-9');
    let slider10 = document.querySelector('.slider-sec-10');
    let slider11 = document.querySelector('.slider-sec-11');
    let slider12 = document.querySelector('#customize');
    let treeView = document.getElementById('tree');
    let perfectScrollbar = document.querySelector('.perfect-scrollbar');
    

      // custom slider js 
      let boxClick = document.querySelectorAll(".box");


      let thumbs = document.querySelector(".thumb-img");
      
      if(thumbs){
        let thumbsChild = thumbs.children;
        boxClick.forEach((item) => {
            
            item.addEventListener('click', (x) => {
              document.querySelector(".pro-img").src = item.children[0].src;
              for(let i=0; i< thumbsChild.length; i++){
                    thumbsChild[i].classList.remove('active')
                  }
                  item.classList.add('active');
              })
          })
      }
     
  
    
   
    // var sticky = navbar.offsetTop;
    var body = document.body;

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
  
    
   

    if(perfectScrollbar) {
      const ps = new PerfectScrollbar('.perfect-scrollbar');
    }
    
    
    
    function stickyBar() {
      if(!salePage){
        if (window.pageYOffset >= 150) {
          body.classList.add("sticky-header");
          
        } else {
          body.classList.remove("sticky-header");
        }
      }
      
    }


    
    // sticky sale page one 
    function stickySalePage() {
      if(salePageTopID){
        if (window.pageYOffset >= 300) {
          body.classList.add("sticky-sale-page")
          
        } else {
          body.classList.remove("sticky-sale-page")
        }
        
      }
    }

    // sticky sale page two 
    function stickySalePageTwo() {
      if(salePageTopIDTwo){
        if (window.pageYOffset >= 170) {
          body.classList.add("sticky-sale-page-two")
        } else {
          body.classList.remove("sticky-sale-page-two")
        }
        
      }
    }
    

    window.onscroll = function() {
      stickySalePage(); 
      stickySalePageTwo();
      stickyBar();
    }
    
    

    
    
    if(slider1){
      var tinySLider = tns({
        container: '.slider-sec-1',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: false,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 4
          },
          "1024": {
            "items": 4
          },
          "768": {
            "items": 3
          },
          "600": {
            "items": 2
          },
          "375": {
            "items": 2
          },
        },
      });
    }
    if(slider2){
      var tinySLider = tns({
        container: '.slider-sec-2',
        loop: false,
        gutter: 30,
        slideBy: 'page',
        autoplay: false,
        nav: false,
        arrowKeys: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 3
          },
          "949": {
            "items": 2
          },
          
        },
      });
    }
    if(slider3){
      var tinySLider = tns({
        container: '.slider-sec-3',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: false,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 6
          },
          "1024": {
            "items": 6
          },
          "800": {
            "items": 4
          },
          "799": {
            "items": 3
          },
          "650": {
            "items": 3
          },
          "649": {
            "items": 2
          },
          "320": {
            "items": 2
          },
        },
      });
    }
    if(slider3_1){
      var tinySLider = tns({
        container: '.slider-sec-3-1',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 1
          },
          "1024": {
            "items": 1
          },
          "768": {
            "items": 1
          }
        },
      });
    }
    if(slider3_2){
      var tinySLider = tns({
        container: '.slider-sec-3-2',
        gutter: 20,
        loop: false,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controls: false,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 1
          },
          "1024": {
            "items": 1
          },
          "768": {
            "items": 1
          }
        },
      });
    }
    if(slider4){
      var tinySLider = tns({
        container: '.slider-sec-4',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: false,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 4
          },
          "1024": {
            "items": 3
          },
          "768": {
            "items": 2
          }
        },
      });
    }
    if(slider5){
      var tinySLider = tns({
        container: '.slider-sec-5',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: false,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 4
          },
          "1024": {
            "items": 4
          },
          "768": {
            "items": 3
          },
          "600": {
            "items": 2
          },
          "375": {
            "items": 2
          },
        },
      });
    }
    if(slider6){
      var tinySLider = tns({
        container: '.slider-sec-6',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 3
          },
          "1024": {
            "items": 3
          },
          "992": {
            "items": 3
          },
          "700": {
            "items": 3
          },
          "699": {
            "items": 2
          },
          "500": {
            "items": 2
          },
        },
      });
    }
    if(slider7){
      var tinySLider = tns({
        container: '.slider-sec-7',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 3
          },
          "1024": {
            "items": 3
          },
          "992": {
            "items": 3
          },
          "700": {
            "items": 3
          },
          "699": {
            "items": 2
            
          },
          "500": {
            "items": 2
            
          },
        },
      });
    }
    if(slider8){
      var tinySLider = tns({
        container: '.slider-sec-8',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 1
          },
          "1024": {
            "items": 1
          },
          "768": {
            "items": 1
          }
        },
      });
    }
    if(slider9){
      var tinySLider = tns({
        container: '.slider-sec-9',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 3
          },
          "1024": {
            "items": 3
          },
          "992": {
            "items": 3
          },
          "700": {
            "items": 3
          },
          "699": {
            "items": 2
            
          },
          "500": {
            "items": 2
            
          },
        },
      });
    }
    if(slider10){
      var tinySLider = tns({
        container: '.slider-sec-10',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 3
          },
          "1024": {
            "items": 3
          },
          "992": {
            "items": 3
          },
          "700": {
            "items": 3
          },
          "699": {
            "items": 2
            
          },
          "500": {
            "items": 2
            
          },
        },
      });
    }
    if(slider11){
      var tinySLider = tns({
        container: '.slider-sec-11',
        loop: false,
        gutter: 20,
        slideBy: 'page',
        autoplay: false,
        nav: true,
        controlsText: [' ',''],
        responsive: {
          "1400": {
            "items": 1
          },
          "1024": {
            "items": 1
          },
          "768": {
            "items": 1
          }
        },
      });
    }
    // customize
    if(slider12){
      var tinySLider = tns({
        container: '#customize',
        controlsContainer: '#customize-controls',
        navContainer: '#customize-thumbnails', 
        autoplayButton: '#customize-toggle',
        navAsThumbnails: true,
        autoplay: false,
        nav: true,
        items: 3,
        controlsText: [' ',''],
        
      });
    }
    
     // js-treeview 
     if(treeView){
      var tree = new TreeView([
          { name: 'Fragrance', children: [] },
          { name: 'Bath Preparations', expanded: true, children: [
                  { name: 'Bubble Bath', children: [] },
                  { name: 'Bath Capsules', children: [] },
                  { name: 'Others', children: [
                    {name: 'Bubble Bath'}
                  ] }
              ]
          },
          { name: 'Eye Makeup Preparations', children: [] },
      ], 'tree');
     }

    
    

    //  rangeable 
    if(document.querySelector(".double-range")){
      const slider = new Rangeable(".double-range", {
        type: "double",
        tooltips: 'always',
        min: 0,
        max: 100,
        value: [22, 74]
      });
    }
    
    // pooper.js 
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    
  }

  // charts --> vendors
  let apexChart = document.querySelector("#chart");
  if(apexChart) {
    var options = {
      colors: ["#D23F57"],
      series: [{
      name: 'series1',
      data: [70, 60, 80, 51, 42, 109, 100, 50, 80]
    }],
    chart: {
      height: 265,
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      show: false,
    },
    xaxis: {
      type: 'datetime',
      categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z", "2018-09-19T07:30:00.000Z", "2018-09-19T08:30:00.000Z"],
      labels: {
        show: false
      }
    },
    yaxis: {
      show: false
    },
    markers: {
      size: 4
    },
    stroke: {
      width: 1
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };
    
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }

  // homepage4 
  let homepageFourButton = document.querySelector(".homepage-four-button-toggle");
  function homepagefourButtonToggle() {
    var element = document.querySelector(".homepage-four-sidebar");
    var classes = element.className.split(" ");
    var i = classes.indexOf("open");

    if (i >= 0) 
      classes.splice(i, 1);
    else 
      classes.push("open");
      element.className = classes.join(" "); 
  }
  if(homepageFourButton){
    homepageFourButton.addEventListener('click', homepagefourButtonToggle);
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






