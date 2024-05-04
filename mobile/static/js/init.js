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
// sync data with server for every SYNC_CYCLE duration
const SYNC_DURATION = 10*60*1000// 10mins
// set prime member status
const isPrime = JSON.parse(localStorage.userProfileData || '{}').isPrime;
// dispaly screen orientation
const ORIENTATION = (innerWidth < innerHeight)? "portrait" : "landscape";
// load more products
let product_page = 1, waiting_flag = true, page_end = false;

// enable - disable features in production
if (!window.location.host.startsWith("beta")){
  // Debugging or console.log
  console.log = function() {};
};

// set browser screen resolutions in css variables
document.documentElement.style.setProperty('--innerHeight', innerHeight + 'px');
document.documentElement.style.setProperty('--innerWidth', innerWidth + 'px');

// set timestamp in localStorage to SYNC() data every SYNC_DURATION period
if (!localStorage._sync_timestamp) localStorage._sync_timestamp = new Date().getTime();

// loading bar function
function showLoadingBar(hide) {
	if (hide){document.querySelectorAll(".loading-bar").forEach(x=>x.remove());return}
	if (document.querySelector(".loading-bar")) return
	const bar = document.createElement("div");
	bar.className="loading-bar";
	bar.innerHTML = `<div class="loading-progress"</div>`
	document.body.insertBefore(bar, document.body.firstChild)
	setTimeout(e=>bar.remove(),2*60*1000)
}
window.addEventListener('beforeunload',e=>showLoadingBar())
window.addEventListener('DOMContentLoaded',e=>showLoadingBar(true))

// modify requets
var originalFetch = window.fetch;
window.fetch = function (...args) {
	// showLoadingBar whenever a fetch() is called or request is made to the server.
	// but only apply this to specific requests.
	// console.log(args)
	let valid = true
	if (args.length == 2){
		if (args[1].body.match(/["]type["][:]["]client["]|["]sync["][:]/gm))
		{valid = false}			
	}
	
  if (valid) showLoadingBar();

  // Return the original fetch promise
  return originalFetch.apply(this, Array.from(args))
    .then(function (response) {
      if (valid) showLoadingBar(true);
      return response;
    })
    .catch(function (error) {
      if (valid) showLoadingBar(true);
      throw error;
    });
};

// ************************ set cookie

function setCookie(name, value, seconds=null) {
	if (seconds){
	    const d = new Date(new Date().getTime()+seconds*1000);
	    const expires = "expires=" + d.toUTCString();
	    document.cookie = name + "=" + value + ";" + expires + ";path=/";
	}else document.cookie = name + "=" + value + ";path=/";
}

// ************************ WebSocket SSE
const WS_SSE = [];// list of message event functions
// WebSocket Connection
function wsConnect(token,i=0){
	var host = window.location.host;
	host = host=="beta"? "localhost" : host.startsWith("beta.")? host.replace("beta.","beta.socket.") : "socket."+host;
	var port = host=="localhost"? ":8888" : "";
	var protocol = host=='localhost'? "ws":"wss";
	const WS_URL = `${protocol}://${host+port}/`;
	
	WS_Obj = new WebSocket(WS_URL);
	WS_Obj.addEventListener("open",e=>WS_Obj.send(token));
	WS_Obj.addEventListener("close", e=>{
		i++
		if (i>3) e.target.close()
		else if(e.target.readyState === WebSocket.CLOSED){
			setTimeout(()=>{
				cookieStore.get("ws_token").then(e => wsConnect(e.value,i))
			},2000)
		}
    });
	WS_Obj.addEventListener("error",e=>{console.error(e)});
	// WS_Obj.addEventListener("error",e=>{alert(e.target.readyState+" "+e.target.url)});
	WS_Obj.addEventListener("message", e=>{WS_SSE.forEach(func=>func(e))});
	// WS_Obj.close();
};
// SSE: Server-Sent-Event
function sseConnect(token,i=0) {
    // SSE : server-side-events
	var host = window.location.host;
	host = host=="beta"? "socket" : host.startsWith("beta.")? host.replace("beta.","beta.socket.") : "socket."+host;
    SSE_Event = new EventSource(`https://${host}/?token=` + token);
    // SSE_Event.addEventListener("open", e => {});
    SSE_Event.addEventListener("error", e=>{
		i++
		if (i>3) e.target.close()
		else if(e.target.readyState === EventSource.CLOSED){
			cookieStore.get("sse_token").then(e => sseConnect(e.value,i))
		}
    });
    SSE_Event.addEventListener("message", e=>{WS_SSE.forEach(func=>func(e))});
    // SSE_Event.close();
};

// init websocket and SSE
window.addEventListener("DOMContentLoaded", () => {
	if ("intro login".includes(THIS_PAGE)) return;
	cookieStore.get("ws_token").then(e=>wsConnect(e.value));// WebSocket
	// cookieStore.get("sse_token").then(e=>sseConnect(e.value));// SSE Event
// 	setInterval(()=>{  WS_SSE.forEach(func => func(
// {data: JSON.stringify({
//         noti: [{
//           title: "Testing",
//           body: "Test good",
//           id: new Date().getTime()
//         }]
//         })}    
//   ))
//                 },10000)
})

// handle data recieved from server
WS_SSE.push(e=>{	
	const data = JSON.parse(e.data);
	console.log(data)
	// set cookies
	//toast("1<br>","","background:none;color:black")
	if (data.hasOwnProperty("ws_token")) setCookie("ws_token", data.ws_token, 1*365*24*60*60)// 1 year
	else if (data.hasOwnProperty("sse_token")) setCookie("sse_token", data.sse_token, 1*365*24*60*60)// 1 year
	// {noti: [ {title,body,id}, ...]  }
	else if (data.hasOwnProperty("noti") && THIS_PAGE!="profile"){
	//toast("2"+("<br>".repeat(2)),"","background:none;color:black")
		// save to localStorage
	    localStorage.noti = JSON.stringify([...JSON.parse(localStorage.noti||'[]'),...data.noti])
	// toast("3"+("<br>".repeat(3)),"","background:none;color:black")
	    data.noti.forEach(n=>{
			// toast("4"+("<br>".repeat(4)),"","background:none;color:black")
		    n.id = Number(n.id);
			// toast("5"+("<br>".repeat(5)),"","background:none;color:black")
			newNotification(n.title,n.body,null,n.id)
			// toast("6"+("<br>".repeat(6)),"","background:none;color:black")
	    })
	}else if (data.hasOwnProperty("reply") && THIS_PAGE!="profile"){
		var body = data.reply[0].text || "-- Media File --";
        reply = {title:"Customer-Care", id:data.reply[0].id, body:body}
		// save to localStorage
	    localStorage.noti = JSON.stringify([...JSON.parse(localStorage.noti||'[]'),reply])
		newNotification(reply.title,reply.body,"customerCare.svg",reply.id)
	// when logged in to another device or cookies has been cleared
	}else if (data.hasOwnProperty("logout")) window.location.reload()
	
});//END: WS_SSE()

// ************************  newNotification()

function newNotification(title,body,icon,tstamp,duration=8000,autohide=true){
	if (!icon) icon="notificationBell.svg";
	icon = ROOT_CDN+"/static/images/"+icon;
	
	// ----------------- push-notification
	toast("1"+("<br>".repeat(1)),"","background:none;color:black")	
  if ("Notification" in window && JSON.parse(localStorage.userSettings).noti1){
	toast("2"+("<br>".repeat(2)),"","background:none;color:black")
	    if (Notification.permission !== "granted") Notification.requestPermission();
	toast("3"+("<br>".repeat(3)),"","background:none;color:black")
		try{navigator.serviceWorker.controller.postMessage({ type:'push-noti',
															title:title,
															options:{
																body:body,
																icon:icon
															}
														   })
	toast("4"+("<br>".repeat(4)),"","background:none;color:black")
		 }catch(err){
	toast("5"+("<br>".repeat(5)),"","background:none;color:black")
			try{navigator.serviceWorker.ready.then(r=> r.showNotification({ type:'push-noti',
															title:title,
															options:{
																body:body,
																icon:icon
															}
														   })
												   )
	toast("6"+("<br>".repeat(6)),"","background:none;color:black")
			   }catch(err){toast("maybe there's no serviceWorker:"+err)}
		 }
  };//END: if
	toast("7"+("<br>".repeat(7)),"","background:none;color:black")
	
	  // ----------------- in-app notification
	  
	// apply user settings
	if (!JSON.parse(localStorage.userSettings).noti5) return;
	
	// show notification
	if (tstamp && String(tstamp).match("[0-9]{5}")){
		const T = new Date(tstamp)
	    tstamp = T.getFullYear() +"-"+ (T.getMonth()+1) +"-"+ T.getDate() +" "+ T.toLocaleTimeString()
	}
	const div = document.createElement("div")
	div.className = "toast slide-in-from-right";
	div.role="alert";
	div.setAttribute("aria-live","assertive");
	div.setAttribute("aria-atomic","true");
	div.innerHTML =   `<div class="toast-header">
		<img src=${icon} class="rounded me-2">
		<strong class="me-auto">${title}</strong>
		<!--<small class="text-body-secondary">now</small>-->
		<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
	  </div>
	  <div class="toast-body">${body}</div>
	`
	document.querySelector(".toast-container").appendChild(div)
	new bootstrap.Toast(div,{"delay":duration,"autohide":autohide}).show()
	div.addEventListener('hidden.bs.toast', () => {div.remove()})	
}

// ************************ scroll events

const SCROLL = {"x":0,"y":0,"left":false,"top":false};
window.addEventListener('scroll', e=>{
  const scrollX  = Number(window.pageXOffset.toFixed());
  const scrollY  = Number(window.pageYOffset.toFixed());
  
  if (scrollX > SCROLL.x) SCROLL.left = true
	else if (scrollX < SCROLL.x) SCROLL.left = false
  if (scrollY > SCROLL.y) SCROLL.top = true
  else if (scrollY < SCROLL.y) SCROLL.top = false

  // console.log(SCROLL)
	// toast(JSON.stringify(SCROLL))
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
		
		// URL info
		locationHref: window.location.href,
		locationHostname: window.location.hostname,
		locationPathname: window.location.pathname,
		locationProtocol: window.location.protocol,
		
		// Timezone
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
	};		
	
	return {"fullDeviceInfo":fullDeviceInfo}
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
const toast = (body="Hello! i'm a toast message.",ms=5000,style="")=> {
	ms = ms || 5000;
	const p = document.createElement("p");
	p.innerHTML = body;
	style = `color:#fff;background-color:RGBA(var(--bs-primary-rgb),var(--bs-bg-opacity,1));`+style
	var attrs = {"class":"toast show",
				 "style":`animation: transparency 3s ${ms/1000-3}s cubic-bezier(0.5, 0.35, 0.15, 1) both;`+style
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
	// copy url
	if (data.url){
		const tempInput = document.createElement('input');
        tempInput.value = data.url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        toast("Link Copied!");
	}

	// share to media
	if (!navigator.canShare) console.error("navigator.canShare() not supported.")
	else if (navigator.canShare(data) && navigator.share) {
		navigator.share(data)
			.then(()=>{console.log("Shared Successfully!");})
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

// *************************  gesture sliding for lcs

// initial gesture value holder
let lcs_swipeX; const swipe_thresh = innerWidth*0.2;
function addLcsGesture(el) {
el.querySelectorAll('section:not(.item)').forEach(el=>{ 
  el.addEventListener('touchstart', e=>{  lcs_swipeX = e.touches[0].clientX;});
  el.addEventListener('touchmove', e=>{  
    if (!lcs_swipeX) return;
    var currentX = e.touches[0].clientX;
    var deltaX = currentX - lcs_swipeX;
	if (Math.abs(deltaX) < swipe_thresh) return 
    if (deltaX > 0) el.querySelector(".menu").click()
    else if (deltaX < 0) el.querySelector(".menu").click()
  
    // Reset lcs_swipeX for the next touchmove event
    lcs_swipeX = null;
  });
})
};
// request server to get products and set products
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

			// add gesture for lcs
			addLcsGesture(div)
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
  if (!type) throw ValueError("Please provide the file type or content type one of html | txt | json")
	
  url = ROOT_CDN+"/static/data/legal/"
	
  fetch(url+id+"."+type)
  .then(response=>{
    if(!response.ok) return;
    response.text().then(d=>{
      // console.log(d)
      if (d) document.querySelector(".modal#"+id.replaceAll(" ","-")+" .modal-body").innerHTML = d;
    })
  })
};

// Capital Case custome function
String.prototype.toCapitalCase = function(){return this.replace(/\b\w/g, c=>c.toUpperCase())}

// return changes made in dict{} object
function dictChanged(dictOld, dictNew) {
	const diff = {};
	if (JSON.stringify(dictOld) === JSON.stringify(dictNew)) return diff
	for (const key in dictNew) {
		if (!dictOld.hasOwnProperty(key)) diff[key] = dictNew[key]
		else if (typeof dictNew[key] === 'object' && dictNew[key] !== null && !Array.isArray(dictNew[key])) {
			const innerDiff = dictChanged(dictOld[key], dictNew[key]);
			if (Object.keys(innerDiff).length > 0) diff[key] = innerDiff;
		} else if (dictOld[key] !== dictNew[key]) diff[key] = dictNew[key];
	}
return diff;
};//END: dictChanged()

// downlaod image
function saveImg(img) {
    // Create a canvas element
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    // Set the canvas dimensions to the image dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0);
    
    // Get the image type from the src attribute
    var imgType = img.src.substring(img.src.lastIndexOf('.') + 1);
    
    // Create a link element
    var link = document.createElement('a');
    
    // Set the link's href attribute to the canvas data URL with appropriate image type
    link.href = canvas.toDataURL('image/' + imgType);
    
    // Set the download attribute to the image file name
    var imgFileName = img.src.substring(img.src.lastIndexOf('/') + 1);
    link.download = imgFileName;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Remove the link from the body
    document.body.removeChild(link);
}
