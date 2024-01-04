const PROFILE_KEYS = ["userimg","background","username","userid","gender","interests","email","phone","dob","country","state","city","pin"];
const MONTHS = {1:"Jan",2:"Fab",3:"Mar",4:"Apr",5:"May",6:"Jun",7:"Jul",8:"Aug",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};

// .active the target-id="" on element click
var a = [
    ["#help button[target-id]","page"],
    ["button#back-page","page"],
    ["page#profile div[target-id]","page"],
    ["page#view-profile [target-id]","page"],
    ["page#edit-profile .gender-btn button","#gender .gender "],
];
a.forEach(x=>activate_target.push(x));

// run these when document is loaded
window.addEventListener('load', e=>{
  setupEditProfile();
  setupSettings();
  
  // load modal's body content
  modalLoad("policy","html"); modalLoad("terms","html"); modalLoad("about","html");

})

// **************************  page#profile
const page_profile = document.querySelector("page#profile");
// setup the values of user profile
const setProfile = (el,keys)=>{
    const data = JSON.parse(localStorage.userProfileData || '{}');
    
    if (data.profile){
        keys.forEach(k=>{
          var x = el.querySelector("#"+k);
          var v = data.profile[k];
          if (v){
            if ("userimg background".includes(k)) x.src=v
            else if (k=="phone") x.innerHTML="+"+data.profile["region"]+" "+v; 
            else x.innerHTML=v
          }
        })
    };    
};

// setup the profile data on page#profile
setProfile( page_profile.querySelector(".top .profile"),
           ["userimg","username","userid","email","phone"] );

// update the profile completions status
const profileStatus = ()=>{
    const progress = page_profile.querySelector(".top .progress");
    
    const bar = progress.querySelector("#bar");
    const pointer = progress.querySelector("#pointer .value");

    // show the current status of profile
    const profile = JSON.parse(localStorage.userProfileData || '{}').profile;

    delete profile["region"]
    
    if (profile){
        val = Object.values(profile)
        // the value is computed by counting the filled specific key-value pairs      
        const x = Math.floor(val.filter(v=>String(v).trim()).length/val.length*100);
        // when profile status 100% then hide the el;
        localStorage.profileStatus = progress.hidden = (x==100)
         
        bar.style.width = x+"%";
        pointer.innerHTML = x+"%";        
    };
    
};

// show the current profile compeletion status
profileStatus();

// **************************  page#view-profile

const page_view_profile = document.querySelector("page#view-profile");

// setup the profile data on page#view-profile
setProfile( page_view_profile, PROFILE_KEYS);

// **************************  page#edit-profile

const page_edit_profile = document.querySelector("page#edit-profile");
const carousel_edit_profile = document.getElementById('carousel-edit-profile');

// carousel_edit_profile.addEventListener('slid.bs.carousel', e=>{//after transition
carousel_edit_profile.addEventListener('slide.bs.carousel', e=>{//before transition
  const slides = carousel_edit_profile.querySelectorAll(".carousel-item");
  const active =  slides[e.from];
  const sliding_to = e.relatedTarget.className.match(/slide[0-9]/gm)[0];
  
  if (e.direction == "left"){ movebar(true)  }
  else{                       movebar(false) }

  if(sliding_to == "slide1"){
    page_edit_profile.querySelector(".nav-btns .btn-prev").style.visibility="hidden";
  }else{page_edit_profile.querySelector(".nav-btns .btn-prev").style.visibility="visible";}
  
})

//  Progress bar
const bar = document.querySelector('.pBar');
const INIT_bar = bar.style.width = "41%";
let counter = 0; 
const gap = 12; // in %  gap between points
const animationSpeed = 0.3; // Adjust this value to control the animation speed

// <- back button
page_edit_profile.querySelector("button#back-page").addEventListener("click",e=>{
  // reset carousel
    const carousel = new bootstrap.Carousel(carousel_edit_profile);
    carousel.to(0);     setTimeout(()=>{bar.style.width = INIT_bar},1000);
  setupEditProfile();
  
})

// -> next button
page_edit_profile.querySelector(".nav-btns .btn-next").addEventListener("click",e=>{
  // if last slide
  if(carousel_edit_profile.querySelector(".carousel-item.active").id =="address"){

    // handle special cases
    let gender = document.querySelector(".gender-btn .active") || "";
    if (gender) gender = gender.innerText.trim();
    
    // send and save the profile data
    const data = {
                  userid:document.querySelector("#username input#userid").value,
                  username:document.querySelector("#username input#username").value.toCapitalCase(),
                  email:document.querySelector("#username input#email").value.toLowerCase(),
                  // region:document.querySelector("#username input#region").value,
                  phone:document.querySelector("#username input#phone").value,
                  gender:gender.toCapitalCase(),
                  background:document.querySelector("#upload #bg").src,
                  userimg:document.querySelector("#upload #userimg").src,
                  interests:Array.from(document.querySelectorAll("#interests button.active")).map(x=>x.innerText.trim()).join(", ").toCapitalCase(),
                  dob:Array.from(document.querySelectorAll("#dob input")).map(x=>x.value.trim()).join("-"),
                  country:document.querySelector("#address input#country").value.trim().toCapitalCase(),
                  state:document.querySelector("#address input#state").value.trim().toCapitalCase(),
                  city:document.querySelector("#address input#city").value.trim().toCapitalCase(),
                  pin:document.querySelector("#address input#pin").value.trim(),
                }

    data.dob = (data.dob.replaceAll("-","").length==8)? data.dob:"";
    data.background = data.background.includes("/static/images/")? "" : data.background
    data.userimg = data.userimg.includes("/static/images/")? "" : data.userimg

    const userProfileData = JSON.parse(localStorage.userProfileData);
    const profile = userProfileData.profile || {};
    
    // del the keys with no value | value is changed
    Object.keys(data).forEach(k=>{
      if (!(data[k]+"") || data[k]+"" == profile[k]+"") delete data[k]
    })

    // if changes has made into the profile
    if (Object.keys(data).length) {
    
      // console.log("sending this profile data to the server:",data)
  
      // get the csrf_token
      const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value || "";
      
      // send to server
      fetch("../server/", {
  		  method: "POST",
  		  headers: {
              'X-CSRFToken': csrf_token,
              "Content-Type": "application/json"
            },
  		  body: JSON.stringify({profile:data})
      }).catch(err=>console.error(err,"But you don't worry, It'll be done later."));
      
      // save to localStorage    
      Object.keys(data).forEach(k=>profile[k] = data[k]);
      userProfileData.profile = profile;
      localStorage.userProfileData = JSON.stringify(userProfileData);
	    
      // show | update profile
      setProfile( page_profile.querySelector(".top .profile"),
             ["userimg","username","userid","email","phone"] );
      setProfile( page_view_profile, PROFILE_KEYS);
      profileStatus();
      
    }else console.log("No Change in Profile:",data);
    
    // goto back page
    page_edit_profile.querySelector("button#back-page").click(); 
  }
})

// set values of #edit-profile from localStorage
function setupEditProfile() {
  const profile = JSON.parse(localStorage.userProfileData || '{}').profile;
  
  if (profile.dob) document.querySelectorAll("#dob input").forEach((x,i)=>x.value = profile.dob.split("-")[i]);
  if (profile.gender) document.querySelector(".gender-btn #"+profile.gender.toLowerCase()).click()
  if (profile.interests){
    document.querySelectorAll("#interests button").forEach(x=>{
      if (profile.interests.toLowerCase().includes(x.innerText.toLowerCase()) 
          && !x.className.includes("active")){
        x.click();
      }
    })
  }
  
  document.querySelector("#username input#username").value = profile.username ||"";
  document.querySelector("#username input#userid").value = profile.userid ||"";
  document.querySelector("#username input#email").value = profile.email ||"";
  document.querySelector("#username input#phone").value = profile.phone ||"";
  document.querySelector("#upload #bg").src = profile.background ||ROOT+"/static/images/bg.svg";
  document.querySelector("#upload #userimg").src = profile.userimg ||ROOT+"/static/images/user2.svg";
  document.querySelector("#address input#country").value = profile.country ||"";
  document.querySelector("#address input#state").value = profile.state ||"";
  document.querySelector("#address input#city").value = profile.city ||"";
  document.querySelector("#address input#pin").value = profile.pin ||"";

  // clear the clutter from edit-profile page
  // slide #username
  const el_inp = document.querySelectorAll("#username input")
  const el_p = document.querySelectorAll("#username p1")
  el_p[0].innerHTML = el_p[1].innerHTML = ""
  for(el of el_inp){ el.classList.remove("valid"); el.classList.remove("invalid")}
  el_p[0].style.color = el_p[1].style.color = "";
  // slide #dob
  document.querySelectorAll(".birth .bday input").forEach(x=>x.style.borderColor="")
};

//  slide - #username

// validate username
function usernameValidate(e) {
  const inp = e.currentTarget;
  inp.value = inp.value.toCapitalCase();
  const val = inp.value.trim();

  if (val == JSON.parse(localStorage.userProfileData).profile.username ){
    inp.classList.remove("valid")
    inp.classList.remove("invalid")
  }else  if (!val){
    inp.value = ""
    inp.classList.remove("valid")
    inp.classList.add("invalid")
  }else{
    inp.classList.remove("invalid")
    inp.classList.add("valid")
  }
  // hide-show next button
  if(document.querySelectorAll("#username input.invalid").length){
    page_edit_profile.querySelector(".nav-btns .btn-next").hidden = true;
  }else page_edit_profile.querySelector(".nav-btns .btn-next").hidden = false;
}
document.querySelector("#username input#username").addEventListener("input",usernameValidate)
document.querySelector("#username input#username").addEventListener("blur",usernameValidate)
// validate userid, email, phone
function uepValidate(e) {
  const inp = e.currentTarget;
  const patt = RegExp(inp.getAttribute("pattren")); // check valid input
  const not_patt = inp.getAttribute("not_pattren"); // check invalid characters  
  
  var ab = inp.id.includes("user")? "a":"b"
  const p = document.querySelector("#username p1."+ab)
  const val = inp.value.trim().toLowerCase();
  // Lower Case
  inp.value = val

  function classX(x){
    if (x=="valid"){
      inp.classList.remove("invalid");
      p.classList.remove("invalid");
      inp.classList.add("valid");
      p.classList.add("valid");      
    }else if (x=="invalid"){
      inp.classList.remove("valid");
      p.classList.remove("valid");
      inp.classList.add("invalid");
      p.classList.add("invalid");
    }else{
      inp.classList.remove("invalid");
      p.classList.remove("invalid");
      inp.classList.remove("valid");
      p.classList.remove("valid");
    }
    
  } 

  if (val == JSON.parse(localStorage.userProfileData).profile[inp.id].toLowerCase() ){    
    classX()
    p.innerHTML = "";
    // hide-show next button
    if(document.querySelectorAll("#username input.invalid").length){
      page_edit_profile.querySelector(".nav-btns .btn-next").hidden = true;
    }else page_edit_profile.querySelector(".nav-btns .btn-next").hidden = false;
    return
  }
  
  if (!val){
    inp.value = "";
    classX("invalid")
    p.innerHTML = "Required!";
    // hide-show next button
    if(document.querySelectorAll("#username input.invalid").length){
      page_edit_profile.querySelector(".nav-btns .btn-next").hidden = true;
    }
    return
  }

  // if invalid characters
  const chars = [...new Set(val.match(RegExp(not_patt,"g")))].join(" ");
  if (chars){
    p.innerHTML = `Characters '${chars}' not allowed!`
    classX("invalid")
    // hide-show next button
    if(document.querySelectorAll("#username input.invalid").length){
      page_edit_profile.querySelector(".nav-btns .btn-next").hidden = true;
    }
    return
  }

  // if invalid input
  if (!patt.test(val)){
    p.innerHTML = `Invalid ${inp.id}!`;
    classX("invalid")
    // hide-show next button
    if(document.querySelectorAll("#username input.invalid").length){
      page_edit_profile.querySelector(".nav-btns .btn-next").hidden = true;
    }
    return
  }

  if (e.type == "blur" && p.classList.contains("valid")) return  

  // get the csrf_token
  const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value || "";
    
  // send to server
  fetch("../server/", {
        method: "POST",
        headers: {
          'X-CSRFToken': csrf_token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_available:{ [inp.id]:val } })
  })
  .then(res=>{
    
    if (!res.ok) throw Error(res.status)
    res.text().then(flag=>{
      if (flag=='False'){
        p.innerHTML = `${inp.id} Available!`
        classX("valid")
      }else{
        p.innerHTML = `${inp.id} Not available!`
        classX("invalid")        
      }
      // hide-show next button
    if(document.querySelectorAll("#username input.invalid").length){
        page_edit_profile.querySelector(".nav-btns .btn-next").hidden = true;
      }else page_edit_profile.querySelector(".nav-btns .btn-next").hidden = false;
    })    
  })
    // save to localStorage
  .catch(err=>{
    console.error(err,"handle this with localStorage")
  })
  
};//END: uepValidate()
// validate userid
document.querySelector("#username input#userid").addEventListener("blur",uepValidate)
document.querySelector("#username input#userid").addEventListener("input",uepValidate)
// 
if (JSON.parse(localStorage.userProfileData).profile.email){
  document.querySelector("#username div.email").style.opacity = "0.6"
}else document.querySelector("#username div.phone").style.opacity = "0.6"
// validate email
document.querySelector("#username input#email").addEventListener("blur",uepValidate)
document.querySelector("#username input#email").addEventListener("input",uepValidate)
// validate phone
document.querySelector("#username input#phone").addEventListener("blur",uepValidate)
document.querySelector("#username input#phone").addEventListener("input",uepValidate)
  
//  slide - #gender
var a = [".gender-btn button"];
a.forEach(x=>toggle_2.push(x));

// slide - #upload image
// set uploaded image as the src of profile image | background image
const setImage = (el,inp,) => {
  return new Promise((resolve) => {
    const img = inp.files[0];
    if (img) {
      // Create a FileReader to read the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        // Compress image
        if (el) compressImage(e.target.result, blob=>el.src = blob);
        resolve(e.target.result);
      };
      // Read the selected image as a data URL
      reader.readAsDataURL(img);
    } else {
      resolve("");
    }
  });
};

const inp_bg = page_edit_profile.querySelector("input#bg");
const inp_img = page_edit_profile.querySelector("input#userimg");
const el_bg = page_edit_profile.querySelector("#comp-1 #bg");
const el_profile = page_edit_profile.querySelector("#comp-1 #userimg");

// ask the user to upload the background img
inp_bg.addEventListener('change',()=>{setImage(el_bg,inp_bg)});

// ask the user to upload the user img
inp_img.addEventListener('change',()=>{setImage(el_profile,inp_img)});

// slide - #interests
const max_intrst = 5,count_intrst = [];
page_edit_profile.querySelectorAll("#interests button").forEach(btn=>{
  btn.addEventListener("click",e=>{
    if (count_intrst.includes(btn)) count_intrst.splice(count_intrst.indexOf(btn),1)
    else count_intrst.push(btn)
    
    const a = page_edit_profile.querySelectorAll("#interests button");
    
    if (count_intrst.length >= max_intrst){
      a.forEach(x=>{
        if (!count_intrst.includes(x)) x.disabled = true;
      })
    }else{
      a.forEach(x=>{
        if (!count_intrst.includes(x)) x.disabled = false;
      })
    }    
  })
})

// slide - #dob Birthday
const Birthday = [ [document.querySelector("input#date"),0,32],
                  [document.querySelector("input#month"),0,13],
                  [document.querySelector("input#year"),1900,new Date().getFullYear()]
]
Birthday.forEach(b=>{
  b[0].addEventListener("input", e=>{
  if (Number(b[0].value) > b[1] && Number(b[0].value) < b[2]) b[0].style.borderColor = "#0a0"
  else b[0].style.borderColor = "red";
  })
  
  b[0].addEventListener("blur", e=>{
    if (b[0].style.borderColor == "red") b[0].value = ""
    else if(b[0].value.length == 1) b[0].value = 0+b[0].value;
  })
})

// slide - #address


// **************************  page#settings

const page_settings = document.querySelector("page#settings");
const settings_opt = page_settings.querySelectorAll(".opt");

// when clicked on any option | setting
settings_opt.forEach(opt=>{
  // only for input switches not for buttons
  const inp = opt.querySelector("input");
  if (inp){
    inp.addEventListener("click",e=>{
      // save setting to device      
      // get
      let settings =  JSON.parse(localStorage.userSettings || '{}');
      // set
      settings[opt.id] = inp.checked;
      // update
      localStorage.userSettings = JSON.stringify(settings);
    })
  }
})

// restore settings' states
function setupSettings() {
  let settings = localStorage.userSettings;
  if (settings) settings = JSON.parse(settings)
  else return;  
  
  settings_opt.forEach(opt=>{
    const inp = opt.querySelector("input");
    if (inp) inp.checked = settings[opt.id];
  })
};

//    Notifications __

// Send message to the service worker when notification settings changed | clicked
document.querySelectorAll("#notifications input").forEach(inp=>{
  inp.addEventListener("click",e=>{//send
    try{navigator.serviceWorker.controller.postMessage({ type:'settings', id:inp.id, value:inp.checked  });
       }catch(err){console.error("maybe there's no serviceWorker:",err)}
  })
})


// **************************  page#Notifications

// load notifications to the notification page from the localStorage
const noti_btn = document.querySelector("page#profile div.notifications")
noti_btn.addEventListener("click",e=>{
  JSON.parse(localStorage.noti||'[]').forEach(n=>{
    const T = new Date(n.id)
    const tstamp = T.getFullYear() +"-"+ (T.getMonth()+1) +"-"+ T.getDate() +" "+ T.toLocaleTimeString()
    _newNotification(n.title.toCapitalCase(),n.body, tstamp, n.id)
  })
})

const page_noti = document.querySelector("page#notifications");
const _newNotification = (title,body,tlog,tid)=>{
  const acc = page_noti.querySelector(".accordion");
  const noti = document.createElement("div");
  
  noti.className="accordion-item";
  noti.id = tid+"_";
  
  // create notification with notification template | component
  noti.innerHTML = notiHTML(title, body, tlog, tid, acc.id);
  
  // delete the notification and from localStorage when clicked on x
  noti.querySelector("button.btn-close").addEventListener("click",e=>{
    // remove from .html
    noti.remove();
    // remove notification from localStorage
    localStorage.noti = JSON.stringify(JSON.parse(localStorage.noti||'[]').filter(x=>x.id!=tid))
  })
  
  // show
  acc.insertBefore(noti, acc.firstChild);
}

// on notification back-button click
page_noti.querySelector("button#back-page").addEventListener("click",e=>{
  // hide all the opened notifications when going back to the home
  // page_noti.querySelectorAll(".accordion-button:not(.collapsed)").forEach(btn=>btn.click())
  // clear all the notifications from notification page only
  page_noti.querySelector("#accordion-noti").innerHTML = ""
})

// Server-Sent Events (SSE) or websocket 
// notify on any notifications recieved from server
SSE_Event.addEventListener("message",e=>{
  const data = JSON.parse(event.data.replaceAll("'",'"'));
  // console.log(data)
  // {noti: [ {title,body,id}, ...]  }
  if (data.hasOwnProperty("noti")){
    // save to localStorage
    localStorage.noti = JSON.stringify([...JSON.parse(localStorage.noti||'[]'),...data.noti])
    
    // show notifications
    data.noti.forEach(n=>{
      // if ("Notification" in window && !page_noti.classList.contains("active")){
      //   if (Notification.permission !== "granted") Notification.requestPermission()
      //   if (Notification.permission === "granted") new Notification(n.title,{body:n.body})          
      // }
      // when default notifications are not working
      if (!page_noti.classList.contains("active")) newNotification(n.title,n.body,null,n.id)
    })
  }
});

// recieve message from serviceWorker
// serviceWorker.message{
//  newNotification(e.title,e.body,e.tlog,t.tid);
// }

// **************************  .mid .logout

const LOGOUT = ()=>{
  fetch('../logout/')
  .then(response=>{
    if (!response.ok) throw Error(response.status)      
    // clear userdata and session
    localStorage.clear();
    sessionStorage.clear();
    window.open("../login/","_self");
    
  }).catch(e=>{toast("Logout Failed!")})
    
}

// **************************  Modal- #feedback
const modal_feedback = document.querySelector(".modal#feedback");
const feedback_form = modal_feedback.querySelector("form#feedback");

// indicate the textarea character limit
modal_feedback.querySelector("textarea").addEventListener("input",e=>{
  const el = e.currentTarget; x = el.maxLength - el.value.length;
  el.nextElementSibling.innerHTML = x;
  el.nextElementSibling.style.color = x? "":"red";
})

// upload screenshots
const feedback_btns = modal_feedback.querySelector(".btns");
const feedback_img = feedback_btns.querySelector("img");
const feedback_img_file = feedback_btns.querySelector("input#img");
const feedback_img_label = feedback_btns.querySelector("label");
const max_image = 5 * 1024 * 1024; // 5MB in bytes

// clear file
feedback_img.addEventListener("click",()=>{
  if (feedback_img_file.value) feedback_img_label.innerHTML = feedback_img_file.value = ""
  else feedback_img_file.click() 
})
// filter file and show details
feedback_img_file.addEventListener('change',e=>{
  if (feedback_img_file.files[0]){
    let fname = feedback_img_file.files[0].name;
    // trim the long name string
    const L = 20;
    if (fname.length > L){
      var halfLength = (fname.length - L) / 2;
      fname = fname.slice(0, Math.ceil(halfLength)) + '...' + fname.slice(-Math.floor(halfLength));
    } 
    // size error
    if (feedback_img_file.files[0].size > max_image) {
      feedback_img_label.innerHTML = `Error: Image size[${feedback_img_file.files[0].size}] is more than size[${max_image}]!`;
      feedback_img_file.value = "";
    // type error
    }else if (!feedback_img_file.files[0].type.includes("image")) {
      feedback_img_label.innerHTML = `Error: ${fname} is not an image!`;
      feedback_img_file.value = "";
    // show file
    }else  feedback_img_label.innerHTML = fname;
  }
});

// reset feedback form
const feedback_form_reset = (sec=0)=>{
  setTimeout(e=>{
      feedback_form.reset();
      feedback_img_label.innerHTML = "";
      const textarea = modal_feedback.querySelector("textarea");
      textarea.nextElementSibling.innerHTML = textarea.maxLength;
      textarea.nextElementSibling.style.color = "";
    },sec);
}

// reset feedback form on model close
modal_feedback.querySelector("button.btn-close").addEventListener("click",feedback_form_reset)

// save form data to localStorage and keep it there untill the data is successfully sent to the server.
feedback_form.addEventListener("submit",async e=>{
  const subject = modal_feedback.querySelector("input#subject").value.trim();
  const text = modal_feedback.querySelector("textarea").value.trim();
  if (!subject){
    alert("Invalid Subject!")
    return
  }
  if (!text){
    alert("Invalid feedback text!")
    return
  }

  const data = {subject: subject,
                text: text
               };  
  if (feedback_img_file.files[0]){
    data.file = {blob:await setImage(null,feedback_img_file),
                   ext:feedback_img_file.files[0].type.split("/")[1]
                   }
  }
  console.log(data)
  // get the csrf_token
  const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value || "";
    
  // send to server
  fetch("../server/", {
        method: "POST",
        headers: {
          'X-CSRFToken': csrf_token,
          "Content-Type": "application/json"
        },
        body:JSON.stringify({feedback:data})
  })
  .then(e=>{
    if (!e.ok) throw Error(e.status)
    //show toast
    toast("Feedback Sent!")
  })
    // save to localStorage
  .catch(err=>{
    console.error(err,"handle this with localStorage")
  })
  
  // reset feedback form in 3secs
  feedback_form_reset(sec=3000)
  //show toast
  toast("Sending...");
  
});

// **************************  page#chats

const page_chats = document.querySelector("page#chats");
const chat_window = page_chats.querySelector(".chat-window .chats");
const chats_form = page_chats.querySelector("form");

// select image and show the selected image
chats_form.upload.addEventListener('click', e=>{
  // remove the selected image
  if (chats_form.img.value){
    chats_form.img.value = "";
    chats_form.upload.src = ROOT+"/static/images/img.svg";
  }else chats_form.img.click();
});
chats_form.img.addEventListener('change',e=>{ 
  // validate size
  if (chats_form.img.files[0].size > max_image){
    toast(`Please Select small Image!`);
    chats_form.img.value = "";
    return
  }// validate type
  else if (!chats_form.img.files[0].type.includes("image/")){
    toast(`Please Select an Image!`);
    chats_form.img.value = "";
    return
  }
    
  // set img src to the img element
  setImage(chats_form.upload, chats_form.img);
});

// save form data to localStorage and keep it there untill the data is successfully sent to the server.
chats_form.addEventListener("submit",async e=>{
  const text = page_chats.querySelector("input#reply").value.trim();
  const img = chats_form.upload.src.includes("/img.svg")? "" : chats_form.upload.src;

  if (!text && !img) return;
  
  const T = new Date();
  const temp = JSON.parse(localStorage.Temp || "{}");
  const title = document.querySelector("page#chats.active header .title").innerText.split(" ")[0].toLowerCase();

  if (!title) throw EvalError("page#chats title not found!");  

  //chats: {file,text,id,title}
  const data = {type:"client", text: text, file:img, id:T.getTime(), title:title};
  if (img) data.ext = chats_form.img.files[0].type.split("/")[1]
  
  console.log(data)
  
  // save to localStorage for temporary
  if (temp.chats){
    if (temp.chats[data.title]) temp.chats[data.title][data.id] = data
    else temp.chats[data.title] = {[data.id]:data};
  }else temp.chats = {[data.title]: {[data.id]:data}};
  
  localStorage.Temp = JSON.stringify(temp);
  
  // add chat into the chat-window with other chats
  const chat = newChat("client",data);
  chat_window.appendChild(chat);
  chat.scrollIntoView();

  // send chat to the server
  sendChat(chat,data)
  
  // reset chats form
  chats_form.reset();
  chats_form.upload.src = ROOT+"/static/images/img.svg";
  
});

// create new chat element
const newChat = (type,data)=>{
  const T = new Date(data.id);
  const div = document.createElement("div");
  div.className = type+" chat";
  div.id = data.id;
  tstamp = T.getFullYear() +" "+ MONTHS[T.getMonth()+1] +" "+ T.getDate() +" "+ T.toLocaleTimeString()
  
  const media = `
        <div class="media">
          <div id="img-1"><img src=${data.file}></div>
        </div>
  `;

  div.innerHTML =  `
  <div class="body">
        <div class="block">
            <p class="text">${data.text}</p>
            ${data.file? media : ""}
        </div>
    </div>
    <div class="timestamp">${tstamp}</div>
    `;
  return div;
};

// send chat to the sever
const sendChat = (chat,data)=>{
  const status = chat.querySelector(".block");
  status.classList.add("sending");
  
  // get the csrf_token
  const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value || "";
    
  // send to server
  fetch("../server/", {
        method: "POST",
        headers: {
          'X-CSRFToken': csrf_token,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({chats:data})
  })
  .then(e=>{
    if (!e.ok) throw Error(e.status);
    status.classList.remove("sending");
    status.classList.remove("failed");
    chat.onclick = null;
    
    // append server's chat-reply into chats window
    e.json().then(data=>{//{reply: [ {type,file,text,id,title}, ...]  }
      if (data.hasOwnProperty("reply")){
        data.reply.forEach(reply=>{
          console.log(reply)
          const chat = newChat(reply.type,reply);
          chat_window.appendChild(chat);
          chat.scrollIntoView();  
        })        
      }
    })
    
    // remove from localStorage
    const temp = JSON.parse(localStorage.Temp || '{}');
    if (temp.chats && temp.chats[data.title]){
      delete temp.chats[data.title][chat.id];
      localStorage.Temp = JSON.stringify(temp);	    
    }
  })
  // save to localStorage and retry on click
  .catch(err=>{
    toast(err);
    status.classList.remove("sending");
    status.classList.add("failed");
    chat.onclick = e=>{sendChat(chat,data);};
  })
};//END: sendChat()

// open the specified chat window
document.querySelectorAll("#help button[target-id]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      // set the page title  
      var target_id = btn.getAttribute("target-id");
      document.querySelector("page"+target_id+" div.title h5").innerText = btn.innerText+" Issue";
      // load the chats for specified title
      loadChats(btn.id.toLowerCase());
    })
})

// load the chats if any for the specified chat window
function loadChats(title) {
  // get the csrf_token
  const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value || "";

  const data = {title:title}
    
  // send to server
  fetch("../server/", {
        method: "POST",
        headers: {
          'X-CSRFToken': csrf_token,
          "Content-Type": "application/json"
        },
      body: JSON.stringify({chats:data})
  })
  .then(response=>{//{chats: [ {type,file,text,id,title}, ...] }
    if(!response.ok) throw Error(response.status);
    response.json().then(response=>{
      response.chats.forEach(c=>{
        var chat = newChat(c.type,c)
        chat_window.appendChild(chat);
        chat.scrollIntoView();
      })
    })
  }).catch(err=>{toast(err)})
  
};//END: loadChats()

// Server-Sent Events (SSE) or websocket 
// handle server's chat-replies
SSE_Event.addEventListener("message",e=>{
  const data = JSON.parse(event.data.replaceAll("'",'"'));
  // console.log("SSE data",data)
  // {reply: [ {type,file,text,id,title}, ...]  }
    if (data.hasOwnProperty("reply")){      
      if (!page_chats.classList.contains("active")){
        reply = {title:"Customer-Support Replied to your message!", id:data.reply[0].id, body:"click to open message!"}
        // save to localStorage
        localStorage.noti = JSON.stringify([...JSON.parse(localStorage.noti||'[]'),reply])
	// // show popup notification  
	// if ("Notification" in window){
	// 	if (Notification.permission !== "granted") Notification.requestPermission()
	// 	if (Notification.permission === "granted") new Notification(reply.title,{body:reply.body})
	// }
        // when default notifications are not working
        newNotification(reply.title,reply.body,"customerCare.svg",reply.id)
        return
      }//show in chats
      data.reply.forEach(reply=>{
        console.log(reply)
        const chat = newChat(reply.type,reply);
        chat_window.appendChild(chat);
        chat.scrollIntoView();  
      })        
    }
});


// clear the chat window on exit
page_chats.querySelector("button#back-page").addEventListener("click",e=>chat_window.innerHTML="");

