const authURI = new URLSearchParams(window.location.href);
const AUTH_CODE = authURI.get("code");
const FORMOTP = document.querySelector("form#otp");

// *********************************** slide swipe event
var myCarousel = document.getElementById('login')
// myCarousel.addEventListener('slid.bs.carousel', function () {//after transition
myCarousel.addEventListener('slide.bs.carousel', function (e) {//before transition
  const slides = document.querySelectorAll(".carousel-item");
  let active;
  slides.forEach(slide=> {if (slide.className.includes("active")) active = slide} );
  
  if (e.direction == "left"){  }
  else{                         }  
  
})

// *********************************** slide2 permission animatons
var p = document.querySelectorAll(".slide2 .list p");
p.forEach((p,i)=>p.style.animationDelay = (0.3*i+1)+"s");

// ______________ app permissions
function grantPermission(name = "geolocation") {
  if ("geolocation" in navigator) {
    console.log("GPS found!")
    new GPS().get().then(x=>console.log(x));
  } else {
    console.log("GPS NOT found!")
  }

};

// *********************************** slide4 login form
FORMOTP.addEventListener("submit",e=>{
  if (document.querySelector(".slide4.active")){
    slide4FormSubmit();
    OTPAuth();
  }  
})
FORMOTP.addEventListener("reset",()=>{
  if (document.querySelector(".slide4.active")) slide4FormReset()
})
// select region | country
document.querySelector(".slide4 select").addEventListener("change",e=>{  
  document.querySelector(".slide4 .label").innerText = e.target.value;
})
document.querySelector(".slide4 button#prev").addEventListener("click",()=>FORMOTP.reset());
function slide4FormSubmit() {
  // to prevent error in form validation because otp is hidden
  document.querySelector(".slide4 input#otp").setAttribute("form","otp");

  // make otp input visible
  let n = document.querySelector(".slide4 .phone-number");  
  let btn = document.querySelector(".slide4 .btn-confirm");
  let otp = document.querySelector(".slide4 .block-otp");
  if (otp.style.visibility != "visible"){
    n.classList.add("slide-up");
    btn.classList.add("slide-down");
    otp.style.visibility="visible";  otp.classList.add("opacity");    
    // start counter for otp 
    clearCounter = setInterval(count,1000)
  }

  // send phone number and ask for otp
}
function slide4FormReset() {
  setTimeout(()=>{
    // to prevent error in form validation because otp is hidden
  document.querySelector(".slide4 input#otp").setAttribute("form","null");
    
    // make otp input invisible
    let n = document.querySelector(".slide4 .phone-number");  
    let btn = document.querySelector(".slide4 .btn-confirm");
    let otp = document.querySelector(".slide4 .block-otp");
    if (otp.style.visibility == "visible"){
      n.classList.remove("slide-up");
      btn.classList.remove("slide-down");
      otp.style.visibility="hidden";  otp.classList.remove("opacity");    
      // clear counter for otp 
      clearInterval(clearCounter);
    }
  },2000)
}
// when resend button is pressed 
const btn_resend = document.querySelector(".slide4 #resend");
const COUNTER = 10;//seconds
let counter = COUNTER;
let clearCounter;
function count() {
   counter--;    
   document.querySelector(".slide4 .resend span").innerText = counter;
   if (counter <= 0) {
     counter=COUNTER; clearInterval(clearCounter);
     btn_resend.disabled=false;
   }
}
btn_resend.addEventListener("click",e=>{  
  toast("OTP sent to Whatsapp!")
  btn_resend.disabled = true;
  clearCounter = setInterval(count,1000);
  FORMOTP.otp.value = ""; 
  // send request to server to resend new OTP
  OTPAuth();
})

// *********************************** 
class GPS {
  constructor() {
    this.longitude = null;
    this.latitude = null;
    this.coords = [this.longitude, this.latitude];
  }

  // current GPS Location once
  //call: .get().then(x=>x)
  async get() {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      return this;
    } catch (err) {
      console.error(err);
      return this;
    }
  }


  tracking(tracking,doThis){
    // START location tracking | on location change
    if (tracking){
      if (this.track_id == null){
       this.track_id = navigator.geolocation.watchPosition(
          doThis,//every time the locations is chagned
          err => {console.error(err)}
        ); 
        console.log("GPS Tracking Started.")
      }else console.info("Already Tracking.")
    // STOP location tracking
    }else {
      if(this.track_id){
        navigator.geolocation.clearWatch(this.track_id);
        this.track_id = null;
        console.log("GPS Tracking Stopped.")  
      }else console.log("No Tracking id")
      
    }
    return this;
  };
  
};//END: class GPS{}


// *********************************** User Login - @gmail.com
//send to my server for verification and get the user data
function gmailAuth() {  
  if (AUTH_CODE){
    // loading....
    document.querySelector(".slide0 span[role='status']").innerText = "Authenticating...";
    
     // The URL of your server's endpoint to handle the AUTH_CODE
    const csrf_token = FORMOTP.csrfmiddlewaretoken.value || "";
    // Data to send in the request body
    const data = { code: AUTH_CODE };
    // Make a POST request to your server
    fetch("../gmailAuth/", {
      method: "POST",
      headers: {
        'X-CSRFToken': csrf_token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {//<- {userProfileData:{profile},userSettings,...} from server
      // redirect to authentication consent
      if (response.status == 302) response.text().then(url=>window.open(url,"_self"))
      
      if(!response.ok) throw Error(response.status+" "+response.statusText);
      // Welcome Slide
      document.querySelector(".carousel-item.active").classList.remove("active");
      document.querySelector(".slide5").classList.add("active");
      response.json().then(d=>{
      // proceed if server sent the user's data
      if (d.userProfileData){
        userProfile(d);
        // Welcome Slide
        document.querySelector("button.next").click();
      }
    });
    })
    .catch(error => {
      // Login Slide
      document.querySelector(".carousel-item.active").classList.remove("active");
      document.querySelector(".slide3").classList.add("active");
      setTimeout(alert,2000,error);
    }); 
  }else{
    // Get Started Slide
    document.querySelector(".carousel-item.active").classList.remove("active");
    document.querySelector(".slide1").classList.add("active");
  }
};//END: gmailAuth()

//send form data to my server
function OTPAuth() {
  const csrf_token = FORMOTP.csrfmiddlewaretoken.value || "";
  const region = FORMOTP.region.value.replace("+","") || "";
  const number = FORMOTP.number.value || "";
  const OTP = FORMOTP.otp.value || "";
  const data = { region:region,  phone:number,  otp: OTP  };
  // console.log("OTPAuth()<- ",data);

  // reset phone and otp input.style
  FORMOTP.number.parentNode.classList.remove("failed");
  FORMOTP.number.parentNode.classList.remove("success");
  FORMOTP.otp.parentNode.classList.remove("failed");  
  FORMOTP.otp.parentNode.classList.remove("success");  
  
  // Make a POST request to server
  fetch("../OTPAuth/", {
    method: "POST",
    headers: {
      'X-CSRFToken': csrf_token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {//<- {userProfileData:{profile},userSettings,...} from server
    if(!response.ok) throw Error(response.status+" "+response.statusText);
    response.json().then(d=>{
      // proceed if server sent the user's data
      if (d.userProfileData){
        FORMOTP.otp.parentNode.classList.remove("failed");
        FORMOTP.otp.parentNode.classList.add("success");
        // save to localStorage and set profile
        userProfile(d);
        // Welcome Slide
        document.querySelector("button.next").click();
      }
    });
  })
  .catch(err => {
    if (err.message.includes("Invalid OTP") || err.message.includes("Expired")){
      FORMOTP.otp.parentNode.classList.add("failed");
    }else if (err.message.includes("Invalid Phone")){
      FORMOTP.number.parentNode.classList.add("failed");
    }
    setTimeout(alert,1000,err);
    console.error(err);
  });
};//END: OTPAuth()

// store and set user data
function userProfile(data) {
  // console.log("userProfile",data)//check structure of data
  
  // save data to localStorage
  Object.keys(data).forEach(k=>{ localStorage[k] = JSON.stringify(data[k]); })  
  
  // set profile image and username
  if (data.userProfileData.profile.userimg){
    document.querySelector(".userimg img").setAttribute("src",data.userProfileData.profile.userimg);
  }
  document.querySelector(".username").innerHTML = data.userProfileData.profile.username || data.userProfileData.profile.userid;
};//END: userProfile()

// ************************* set regions and codes in <select>
function populateRegions() {
  fetch('../server/?file=ISD.json')
  .then(response => response.json())
  .then(data => {
    const sel = document.querySelector(".slide4 select");
    data.forEach(x=>{
      var opt = document.createElement("option");
      opt.value = "+"+x.code; opt.innerText = x.country;
      sel.appendChild(opt);
    })
  })
  .catch(error => {
    console.error('Error:', error);
  });

}

// WARNING: do not make any request other than gmailAuth to server if url has AUTH_CODE.
if (!AUTH_CODE){
  // set country names and country codes
  populateRegions();
  // load modal's body content
  window.addEventListener("load",e=>{ modalLoad("policy","html"); modalLoad("terms","html"); })
}
