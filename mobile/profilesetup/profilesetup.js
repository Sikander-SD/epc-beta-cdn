// *********************************** slide swipe event
var myCarousel = document.getElementById('carousel-edit-profile');

// myCarousel.addEventListener('slid.bs.carousel', function () {//after transition
myCarousel.addEventListener('slide.bs.carousel', function (e) {//before transition
  const slides = document.querySelectorAll(".carousel-item");
  const active =  slides[e.from];
  const sliding_to = e.relatedTarget.className.match(/slide[0-9]/gm)[0];
  
  if (e.direction == "left"){ movebar(true)  }
  else{                       movebar(false) }

  if(sliding_to == "slide1"){
    document.querySelector(".nav-btns .btn-prev").style.visibility="hidden";
  }
  else{document.querySelector(".nav-btns .btn-prev").style.visibility="visible";}
  
})

// *********************************** Progress bar
const bar = document.querySelector('.pBar');
bar.style.width = "51%";
let counter = 0; 
const gap = 12; // in %
const animationSpeed = 0.3; // Adjust this value to control the animation speed

// *********************************** slide1
document.querySelector(".slide1 button.male").onclick = ()=>{
  document.querySelector(".gender .male").style.background = "var(--color-male-on)";
  document.querySelector(".gender .female").style.background = "var(--color-female-off)";
  document.querySelector(".slide1 button.male").style.background = "var(--color-male-on)";
  document.querySelector(".slide1 button.female").style.background = "none";
}
document.querySelector(".slide1 button.female").onclick = ()=>{
  document.querySelector(".gender .male").style.background = "var(--color-male-off)";
  document.querySelector(".gender .female").style.background = "var(--color-female-on)";
  document.querySelector(".slide1 button.female").style.background = "var(--color-female-on)";
  document.querySelector(".slide1 button.male").style.background = "none";
}

// *********************************** slide3
document.querySelectorAll("button.choice").forEach(c=>{  c.onclick = ()=>{
    if (!c.style.background) c.style.background = "var(--color-on)"
    else c.style.background = "";  
  }
})

// *********************************** slide4
const Birthday = [ [document.querySelector("#date"),0,32],
                  [document.querySelector("#month"),0,13],
                  [document.querySelector("#year"),1900,new Date().getFullYear()]
]
Birthday.forEach(b=>{
  b[0].addEventListener("input", function() {
  if (Number(b[0].value) > b[1] && Number(b[0].value) < b[2]) b[0].style.borderColor = "#0a0"
  else b[0].style.borderColor = "red";
})
})

// **************************  

const setImage = (el,inp)=>{
    const img = inp.files[0];    
    if (img) {
        // Create a FileReader to read the selected image
        const reader = new FileReader();    
        reader.onload = e=>{ el.src = e.target.result };
        
        // Read the selected image as a data URL
        reader.readAsDataURL(img);
    }
};

const page_edit_profile = document.querySelector("page#edit-profile");
const el_bg = page_edit_profile.querySelector("#comp-1 .bg");
const el_profile = page_edit_profile.querySelector("#comp-1 .profile");
const inp_bg = page_edit_profile.querySelector("input#bg");
const inp_img = page_edit_profile.querySelector("input#userimg");

// ask the user to upload the background img
el_bg.addEventListener('click', () => {inp_bg.click();});
inp_bg.addEventListener('change',()=>{setImage(el_bg.querySelector("#bg"),inp_bg)});

// ask the user to upload the user img
el_profile.addEventListener('click', () => {inp_img.click();});
inp_img.addEventListener('change',()=>{setImage(el_profile.querySelector("#userimg"),inp_img)});


// form on submit
page_edit_profile.querySelector("form").addEventListener("submit",e=>{
    const form = e.currentTarget;
    const data = {}
    PROFILE_KEYS.forEach(k=> data[k] = form[k].value);
    console.log(data)
})

