/*      NOTE
This modul includes only those definitions and statements which are independent to other moduls | statements | definitions.
*/

// .active the target element triggered by source element.clicked
const activate_target = [];
// .active the clicked element or button
const toggle_2 = [];
// .active and toggle the clicked element or button
const toggle_3 = [];
// init parameters
const screenPHONE = 800;//px
// name of the current webpage
const THIS_PAGE = window.location.pathname.split("/")[1] || null;
// set prime member status
const isPrime = JSON.parse(localStorage.userProfileData || '{}').isPrime;
// dispaly screen orientation
const ORIENTATION = (innerWidth < innerHeight)? "portrait" : "landscape";
// load more products
let product_page = 1, waiting_flag = true, page_end = false;
// SSE : server-side-evetns
const SSE_Event = new EventSource('../sse/');

// notify on any notifications recieved from server
SSE_Event.addEventListener("message",e=>{
	const data = JSON.parse(event.data.replaceAll("'",'"'));
	// console.log(data)
	// {noti: [ {title,body,id}, ...]  }
	if (data.hasOwnProperty("noti") && THIS_PAGE!="profile"){
		// save to localStorage
	    localStorage.noti = JSON.stringify([...JSON.parse(localStorage.noti||'[]'),...data.noti])
	    data.noti.forEach(n=>{
			// show popup notification
			// if ("Notification" in window){
			// 	if (Notification.permission !== "granted") Notification.requestPermission()
			// 	if (Notification.permission === "granted") new Notification(n.title,{body:n.body})
			// }
			// when default notifications are not working
			newNotification(n.title,n.body,null,n.id)
	    })
	}else if (data.hasOwnProperty("reply") && THIS_PAGE!="profile"){
		reply = {title:"Customer-Support Replied to your message!", id:data.reply[0].id, body:"click to open message!"}
		// save to localStorage
	    localStorage.noti = JSON.stringify([...JSON.parse(localStorage.noti||'[]'),reply])
	    
		// show popup notification  
		// if ("Notification" in window){
		// 	if (Notification.permission !== "granted") Notification.requestPermission()
		// 	if (Notification.permission === "granted") new Notification(reply.title,{body:reply.body})
		// }
		// when default notifications are not working
		newNotification(reply.title,reply.body,"customerCare.svg",n.id)
	}
});

// scroll events
const SCROLL = {"x":0,"y":0,"left":false,"top":false};
window.addEventListener('scroll', e=>{
  const scrollX  = Number(window.pageXOffset.toFixed());
  const scrollY  = Number(window.pageYOffset.toFixed());
  
  if (scrollX > SCROLL.x) SCROLL.left = true
  else SCROLL.left = false
  if (scrollY > SCROLL.y) SCROLL.top = true
  else SCROLL.top = false

  // console.log(SCROLL)
// toast([SCROLL.x,SCROLL.y,SCROLL.left,SCROLL.top,(window.scrollY || window.pageYOffset ) + window.innerHeight, document.body.clientHeight].join(" "))
  SCROLL.x = scrollX; SCROLL.y = scrollY;  
});

// progress bar left and right
const movebar = (next = false)=> {
  const clearit = setInterval(() => {
    if (next) {
      // Next slide
      counter += animationSpeed;
      bar.style.width = Number(bar.style.width.replace("%","")) + animationSpeed + '%';
    } else {
      // Prev slide
      counter -= animationSpeed;
      bar.style.width = Number(bar.style.width.replace("%","")) - animationSpeed + '%';
    }
    if (-gap >= counter || counter >= gap) {clearInterval(clearit);counter=0;}    
  }, 10);
}

// set image resolutions for cameras based on MP
const Reso ={"5":"~2592 x 1944p",
		"8":"~3264 x 2448p",
		"13":"~4160 x 3120p",
		"16":"~4920 x 3684p",
		"20":"~5472 x 4104p",
		"24":"~6000 x 4500p",
		"32":"~6720 x 5040p",
		"48":"~8000 x 6000p",
		"50":"~8192 x 6144p",
		"64":"~9216 x 6912p"
	};
const getReso = (cam,img)=>{
    if (!img) img = Reso[cam.split(" MP")[0]]
    else if (!img.endsWith("p")) img+="p"	  
    return cam+"|Image: "+img
  }

// fetch product price
const updatePrice = url=>{
  const xhr = new XMLHttpRequest();
  const parser = new DOMParser();
  url = url.startsWith("https:")?url:("https:"+url)
  
  return new Promise((price,err)=>{      
    xhr.open("GET",url);
    xhr.onreadystatechange = function() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) {
          const htmlDoc = parser.parseFromString(this.responseText, "text/html");
          const p = htmlDoc.querySelector(".price").innerText.match(/[0-9](.*)[0-9]/gm)
          //resolve
          if (p) price(p)
          else console.log(url,htmlDoc);err("")
          
        } else { console.log("Error: " + this.status);}
      }
    };
    xhr.send();    
  })
};//END: updatePrice()

// collect device and browser data for error resolving
const collectLogs = ()=>{
	const fullDeviceInfo = {
		// Device Information
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		language: navigator.language,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		screenResolution: `${window.screen.width}x${window.screen.height}`,
		screenOrientation: ORIENTATION,
		
		// Browser Information
		appName: navigator.appName,
		appVersion: navigator.appVersion,
		vendor: navigator.vendor,
		product: navigator.product,
		productSub: navigator.productSub,
		userAgent: navigator.userAgent,
		cookieEnabled: navigator.cookieEnabled,
		online: navigator.onLine,
		doNotTrack: navigator.doNotTrack,
		hardwareConcurrency: navigator.hardwareConcurrency,
		
		// Browser Features
		webglAvailable: !!window.WebGLRenderingContext,
		webglVersion: (function() {
			var canvas = document.createElement("canvas");
			var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			return gl ? gl.getParameter(gl.VERSION) : null;
			})(),
		cookiesEnabled: navigator.cookieEnabled,
		javaEnabled: navigator.javaEnabled(),
		
		// Viewport and Window
		viewportWidth: window.innerWidth,
		viewportHeight: window.innerHeight,
		colorDepth: window.screen.colorDepth,
		pixelDepth: window.screen.pixelDepth,
		
		// Location
		locationHref: window.location.href,
		locationHostname: window.location.hostname,
		locationPathname: window.location.pathname,
		locationProtocol: window.location.protocol,
		
		// Timezone
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
	};		
	
	return fullDeviceInfo;
};//END: collectLogs()

// .active the target-id and deactivate its colegues with prefix
const activateTarget = (el,prefix)=> {
	var target_id = el.getAttribute("target-id");
	// console.log(target_id,prefix+target_id,document.querySelector(prefix+target_id),document.querySelector(prefix+".active"))
	try{document.querySelector(prefix+".active").classList.remove("active")}
	catch(err){ (prefix=="#gender .gender ")?"":console.error(err) };
	document.querySelector(prefix+target_id).classList.add("active");
}

// premium button .yes
const  buttonYes = k=>{
	if (!localStorage[k]){
		localStorage[k] = 1;
		// send to server
		// fetch(`../server/${k}?=1`)
	}
	toast("Comming Soon!");	
}

// toast message
const toast = (body="Hello! i'm a toast message.",ms=5000)=> {
	const p = document.createElement("p");
	p.innerHTML = body;
	var attrs = {"class":"toast show text-bg-primary",
				 "style":`animation: transparency 3s ${ms/1000-3}s cubic-bezier(0.5, 0.35, 0.15, 1) both;`
				};
	Object.keys(attrs).forEach(k=>p.setAttribute(k,attrs[k]));
	
	// show
	document.body.appendChild(p);
	// remove
	setTimeout(()=>{document.body.removeChild(p)}, ms);    
}

// Share must be triggered by "user activation"
// const data = {title: "Google",text: "you can search anything on this site",url: "https://www.google.com"}
// const data = {files:[]}// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share#shareable_file_types
const share2Media = data=> {
	if (data.url){
		const tempInput = document.createElement('input');
        tempInput.value = data.url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast("Link Copied!");
	}
		
	if (!navigator.canShare) console.error("navigator.canShare() not supported.")
	else if (navigator.canShare(data) && navigator.share) {
		navigator.share(data)
			.then(()=>{console.log("MDN shared successfully");})
			.catch(err=>{console.error("Error: ",err);})
	} else console.error("This data is not sharable or some data property not supported! data:",data);
	
};//END: share2Media()

// init all likes on page load
// run only after all the products has been loaded
function loadLikes(like=[]) {
	console.log(like)
  document.querySelectorAll(".lcs").forEach(lcs=>{
    const id = lcs.parentNode.getAttribute("id");
    const likes = new Set([...like, ...JSON.parse(localStorage.lcs).like]);
    const svg = lcs.querySelector('#like svg');
    const heart = lcs.querySelector('#like path');
    if (likes.has(id)){
      svg.setAttribute('fill', 'red');
      heart.setAttribute('stroke', 'red');
    }
  })
}

// server request by filter and sort;
function populateProductList(caller,data) { return new Promise((resolve,reject)=>{
	console.log(data)
	const page = data.page;
	const setData = response=>{// {data: [ [{p1},{p2}], [{p3},{p4}], [{p5},{p6}], ... ], q:"Apple iphone"}
		const p_list = document.querySelector(".product-list");
		const view = document.querySelector("header .left .active").className.match(/list|item|grid/gm)[0];
		// clear the old data
		if (!page) p_list.innerHTML = "";

		if (!response.data.length) page_end = true;
		
		// iterate each set of  2 products
		response.data.forEach(p=>{ //[ {p1}, {p2} ]
		
			// create div to hold the set of 2 products
			var div = document.createElement("div");
			if (view == "grid") div.classList.add("active");
			
			// when there's only 1 product in the set
			let p2 = (p.length == 2)? productHTML(view,p[1],"right") : "";
			
			// put the products into the div
			div.innerHTML = productHTML(view,p[0],"left") + p2;
			
			// put div into the webpage's .product-list
			p_list.appendChild(div);
		})
		
		// load like: the saved | liked products
		loadLikes(response.like);
		
		// free-up storage
		delete sessionStorage.products;
		
	};//END: setData()
	const modifyPage = v=>{
		// modify elements in home view
		document.querySelector("footer.nav .icon.search").classList.add("active");
		document.querySelector("footer.nav .icon.home").classList.remove("active");
		document.querySelector("#carousel-ads").hidden = true;
		document.querySelector("#search-query").hidden = false;
		document.querySelector("#search-query p").innerHTML = v;
	}
	
	// check and load data from session storage
	// this sessionStorage is only set by either of comapre or profile tabs
	if(sessionStorage.products){
		response = JSON.parse(sessionStorage.products);
		setData(response);
		modifyPage(response.q);
		resolve(true);
		
	// request data from server
	}else{
	  data = (data)? JSON.stringify(data) : "";

	  fetch(`../server/?caller=${caller}&data=${data}`)
		.then(response=>{
			if(!response.ok) throw Error(response.status);
			// response {data: [ [{p1},{p2}], [{p3},{p4}], [{p5},{p6}], ... ], q:"Apple iphone"}
			response.json().then(response=>{
				// console.log(response)
		
				// save to session storage
				sessionStorage.products = JSON.stringify(response);
				
				// navigate to home page
				if(THIS_PAGE!="home") document.querySelector("footer.nav .icon.home").onclick();
	
				// else
				setData(response);
				if(response.q) modifyPage(response.q);
				// close the search tab
				document.querySelector("#search-deviceModal .btn-close").click();
				resolve(true);	
			})
	    })
		.catch(err=>{
			console.error(err)
		});		
	};
	
});//Promise()
};//END: populateProductList(caller,data)


// Define a function to compress an image
function compressImage(inputImage, callback,quality=0.7, maxWidth=100, maxHeight=100) {
  const img = new Image();
  img.src = inputImage;

  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate the new dimensions to fit within maxWidth and maxHeight
    let newWidth = img.width;
    let newHeight = img.height;

    if (newWidth > maxWidth) {
      newWidth = maxWidth;
      newHeight = (img.height * maxWidth) / img.width;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = (img.width * maxHeight) / img.height;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw the image on the canvas with the new dimensions
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // Get the compressed image as a Base64 encoded string
    const compressedImageDataUrl = canvas.toDataURL('image/jpeg', quality);

    callback(compressedImageDataUrl);
  };
}


// Function to check if the user has scrolled to the bottom of the page
function isScrolledToBottom() {
  const windowHeight = Number(window.innerHeight.toFixed());
  const documentHeight = Number(document.body.clientHeight.toFixed())-2;//2 is for safety margin
  const scrollTop = Number((window.scrollY || window.pageYOffset).toFixed());

  // Check if the user has scrolled to the bottom (with a small buffer)
  // toast([scrollTop + windowHeight, documentHeight].join(" "))
  return scrollTop + windowHeight >= documentHeight;
}

//****** ad-device-slides populate
function populateCarousel(id) {
	// get
	const btns = document.querySelector(id+" .carousel-indicators");
	const btn = document.createElement("button");
	const inner = document.querySelector(id+" .carousel-inner");
	const view = "grid";
	
	// set
	btn.setAttribute("type","button"); btn.setAttribute("data-bs-target",id);
	
	fetch("../server/?adDevices="+id.replace("#",""))
	.then(response=>{// response [ [{p1},{p2}], [{p3},{p4}], [{p5},{p6}], ... ]	  
	  response.json().then(res=>{
		  res.data.forEach((products,i)=>{ //[ {p1}, {p2} ]
		    // get
		    var div = document.createElement("div");
		    var b = btn.cloneNode();
			  
		    // set
			div.innerHTML = `
			 <div class="product-list">                    
				<div class="active">
					  ${ productHTML(view,products[0],"left",true) +
						 productHTML(view,products[1],"right",true) 
					  }
				</div>
			</div>
			 `;
			  
		    if (i==0){
			    div.className = "carousel-item active";
				b.className = "active";		
			    b.setAttribute("aria-current","true");
			}else div.className = "carousel-item";
			  
		    b.setAttribute("data-bs-slide-to",i);
		    b.setAttribute("aria-label","Slide "+(i+1));
		
		    // append    
		    inner.appendChild(div);
		    btns.appendChild(b);
		  })
	  })
	}).catch(err=>{
		console.error(err)
	})
};//END: populateCarousel()

// load modal's body content
function modalLoad(id,type) {
  if (!type) throw ValueError("Please provide the filetype or content type one of html | txt | json")
	
  // if ("about terms policy".includes(id)) url = ROOT+"/files/"
  // else url = "../server/?file="
  url = "../server/?file="
	
  fetch(url+id+"."+type)
  .then(response=>{
    if(!response.ok) return;
    response.text().then(d=>{
      // console.log(d)
      if (d) document.querySelector(".modal#"+id+" .modal-body").innerHTML = d;
    })
  })
};

// Capital Case custome function
String.prototype.toCapitalCase = function(){return this.replace(/\b\w/g, c=>c.toUpperCase())}

// notification function
function newNotification(title,body,img,tstamp,duration=8000,autohide=true){
	if (tstamp && tstamp.match("[0-9]{5}")){
		const T = new Date(tstamp)
	    tstamp = T.getFullYear() +"-"+ (T.getMonth()+1) +"-"+ T.getDate() +" "+ T.toLocaleTimeString()
	}
	const div = document.createElement("div")
	div.className = "toast slide-in-from-right";
	div.role="alert";
	div.setAttribute("aria-live","assertive");
	div.setAttribute("aria-atomic","true");
	div.innerHTML =   `<div class="toast-header">
		<img src=${ROOT+"/static/images/"+ (img||"notificationBell.svg")} class="rounded me-2">
		<strong class="me-auto">${title}</strong>
		<small class="text-body-secondary">${tstamp}</small>
		<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
	  </div>
	  <div class="toast-body">${body}</div>
	`
	document.querySelector(".toast-container").appendChild(div)
	new bootstrap.Toast(div,{"delay":duration,"autohide":autohide}).show()
	div.addEventListener('hidden.bs.toast', () => {div.remove()})
}

// return changes made in dict{} object
function dictChanged(dictOld, dictNew) {
	const diff = {};
	if (JSON.stringify(dictOld) === JSON.stringify(dictNew)) return diff
	for (const key in dictNew) {
		if (typeof dictNew[key] === 'object' && dictNew[key] !== null && !Array.isArray(dictNew[key])) {
			const innerDiff = dictChanged(dictOld[key], dictNew[key]);
			if (Object.keys(innerDiff).length > 0) diff[key] = innerDiff;
		} else if (dictOld[key] !== dictNew[key]) diff[key] = dictNew[key];
	}
return diff;
};//END: dictChanged()

// *********************************** phone's Back button
// it stores the elements as sequential history of 
// popup | page | modal etc opened to close them in same order.
const clickedHistory = [];

window.onpopstate = e=>{
	const el = clickedHistory.pop();
	// Perform the default back button behavior
	if (!el) {history.back(); return}
	// close page
	else if (el.nodeName === "PAGE") el.querySelector("#back-page").click()
	// close modal
	else if (el.nodeName === "DIV" && el.classList.contains("modal")) el.querySelector("button.btn-close").click()
	// Prevent the default back button behavior
	history.pushState(null, null, window.location.pathname);
};
