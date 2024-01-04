// *********************************** Progress bar

const bar = document.querySelector('.pBar');
bar.style.width = "51%";
let counter = 0; 
const gap = 12; // in %
const animationSpeed = 0.3; // Adjust this value to control the animation speed

// *********************************** navigation button
// hide navigation Btns while slide-1 is active
function navBtnsTransitions(t){
  let btns = document.querySelector(".nav-btns");
  let trans = ["in-from-right","out-to-right","in-from-left","out-to-left"]
  trans.forEach(n=>btns.classList.remove("slide-"+n))
  btns.classList.add(t)  
}
function hideNavBtns(flag,slide) {
  if      (slide.includes("slide1") && flag==true ) navBtnsTransitions("slide-in-from-right")
  else if (slide.includes("slide2") && flag==false) navBtnsTransitions("slide-out-to-right")
  else if (slide.includes("slide4") && flag==true ) navBtnsTransitions("slide-out-to-left")
  else if (slide.includes("slide5") && flag==false) navBtnsTransitions("slide-in-from-left")
};
// *********************************** slide swipe event
var myCarousel = document.getElementById('carousel-intro')

// myCarousel.addEventListener('slid.bs.carousel', function () {//after transition
myCarousel.addEventListener('slide.bs.carousel', function (e) {//before transition
  const slides = document.querySelectorAll(".carousel-item");
  let active;
  slides.forEach(slide=> {if (slide.className.includes("active")) active = slide} );
  
  if (e.direction == "left"){    movebar(true);    hideNavBtns(true,active.className);  }
  else{                          movebar(false);   hideNavBtns(false,active.className); }  
  
})

// *********************************** slide3 list-view grid-view item-view
let s3TimeId; 
function s3Time(){
  if (s3TimeId) clearTimeout(s3TimeId)//reset
  return setTimeout(()=>{
      document.querySelectorAll('.slide3 .views div').forEach(x=>x.classList.add("active"));
      document.querySelectorAll('.slide3 button').forEach(x=>x.classList.remove("active"));
    },5000)
}

var views = ["list","item","grid"];
views.forEach(v=>{
  var btn = document.querySelector('button.'+v);
  btn.onclick = ()=>{
    // clear previous
    document.querySelectorAll('.slide3 .views div').forEach(x=>x.classList.add("active"));
    document.querySelectorAll('.slide3 button').forEach(x=>x.classList.remove("active"));
    // active current
    btn.classList.add("active");
    document.querySelectorAll(".slide3 .views div:not(."+v+"-view)").forEach(x=>x.classList.remove("active"));    
    s3TimeId = s3Time();
  }
})


// *********************************** slide5 premium
var cls = ["yes","skip"];
cls.forEach(c=>{
  document.querySelector("button."+c).addEventListener("click",()=>{
    // flag this webpage to be done
    localStorage.introDone = true    
    if (c=="yes") localStorage.prime = 1;
  })
})
