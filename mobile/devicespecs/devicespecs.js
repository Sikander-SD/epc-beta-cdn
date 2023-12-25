// parameters
const path_IMAGES = ROOT+DEVICE_IMGS+"/";
const urlParams = new URLSearchParams(window.location.search);
let device_NAME = urlParams.get("file").replaceAll(" ","_").split(".")[0]
let device_DATA=null,    slidelist=[];

// ----------------------------------------------- load slides and table
function renderSlides_and_Table(name) {
  device_NAME = name;
  name = name.replaceAll("_"," ")
  
  // set page title
  document.querySelector("title").innerText = name;
  // set table title
  document.querySelector("input#mobile-devices").value = name;
  
  // get device from namelist of devices
  fetch("../server/?file=devices/" + device_NAME + ".json")
  .then(response=>{
    if(!response.ok) return;
    
    response.json().then(data=>{
      device_DATA = data;
      //add 2 more slides to make space for first 2 images
      // slidelist = ["slide1","slide2"].concat(device_DATA.slides2);           
      slidelist = ["slide1"].concat(device_DATA.slides2);           
      console.log(slidelist)
      
      // render slides of device images      
      showSlides(document.querySelector("div.carousel-inner"));
      showSlideDots(document.querySelector(".carousel-indicators"));
      
      // render table of device specifications           
      renderTable()
  })
  })
};
           

renderSlides_and_Table(device_NAME);

populateCarousel("#products-ads-bottom");
