/*      NOTE
This modul includes only those definitions and statements which are dependent to other moduls | statements | definitions.
*/
/*   SECURITY 
  downlaod the premium | partnership featrues if user is a member and delete the features if user is no longer the memeber.
*/
class Page{
  constructor(page){this.page = page;  }  
  
  // render function  
  render(fun,id,args={}){ document.querySelector("page#"+id).innerHTML = fun(args.backTo||this.page,args);  } 

}//END: class Page{}

const page = new Page(THIS_PAGE);

if ("home compare devicespecs profile".includes(THIS_PAGE)){
  
// ************************ scroll events
  
window.addEventListener('scroll', e=> {
  // not allowed in profile page
  if(THIS_PAGE=="profile") return;
  
  const nav = document.querySelector("footer.nav");
  const thresh = 50;//px 
  
  // show and hide the footer navigation menu on scroll
  if(SCROLL.y > thresh){
    if (SCROLL.top){
      nav.classList.remove("slide-out-to-bottom");
      nav.classList.add("slide-in-from-bottom");
    }else{
      nav.classList.remove("slide-in-from-bottom");
      nav.classList.add("slide-out-to-bottom");
    }
  }else{
    nav.classList.remove("slide-out-to-bottom");
    nav.classList.add("slide-in-from-bottom");
  }
})

// *************** Modal- #search-deviceModal
  
document.querySelector("page #modals").appendChild(searchTabHTML());

const search_modal = document.querySelector("#search-deviceModal");
const search_form = search_modal.querySelector("form");
const input_query = search_form.elements.query;
search_modal.addEventListener('shown.bs.modal', e=> {
  if (document.querySelector("#search-query")) input_query.value = document.querySelector("#search-query p").innerText;
  input_query.focus(); 
});
search_modal.addEventListener('hide.bs.modal', e=> {  
  if (THIS_PAGE == "devicespecs") document.querySelector("footer.nav .search").classList.remove("active")
  else if (document.querySelector("#search-query") && !document.querySelector("#search-query").hidden){//do nothing
  }else     document.querySelector('footer.nav .'+THIS_PAGE).click();
  search_modal.querySelector("p").hidden = true;
  search_form.reset();
});
  
search_form.addEventListener("submit",e=>{
  const v = input_query.value.trim();
  let v1 = "";
  if (THIS_PAGE == "home")  v1 = document.querySelector("#search-query p").innerHTML.trim();
  if (!v || v == v1) return;
  
  const data = {q:v,page:0};
  populateProductList("query",data);
  // reset the page number
  product_page = 1;
  page_end = false;
})
  
search_form.elements.query.addEventListener("input",e=>{
  const p = search_modal.querySelector("p");
  const v = input_query.value.trim();
  if (!v || v.length%2) return;
  
  fetch("../server/?q="+v)
    .then(response=>{// "Apple iPhone 14,Samsung S20,OnePlus 10R 5G"
      if (!response.ok) throw Error(response.status +" "+ response.statusText)
      p.hidden = true;
      const list = document.querySelector("datalist#names");
      list.innerHTML = "";
      
      response.text().then(suggestions=>{
        suggestions.split(",").forEach(name=>{
          var op = document.createElement("option");
          op.value = name;
          list.appendChild(op);
        })
      })        
    }).catch(err=>{ p.hidden = false; })
})

// ************************* populate <footer>
  
document.querySelector("footer.nav").innerHTML = footerHTML(THIS_PAGE);

// toggle or switch footer navigation buttons
var a = ["footer.nav .icon"];
a.forEach(x=>toggle_2.push(x));
  
};//END: if ("home compare devicespecs profile".includes(THIS_PAGE)){}



// button toggle for all buttons in HTML
document.querySelectorAll("button[toggle]").forEach(btn=>{
  btn.addEventListener("click", ()=>btn.classList.toggle("active"));
})

// .active the clicked element or button and deactivate its siblings
toggle_2.forEach(group=>{
  document.querySelectorAll(group).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      try{document.querySelectorAll(group+".active").forEach(x=>x.classList.remove("active"))}catch{};
      btn.classList.add("active");
    })
  })
})

// .active and toggle the clicked element or button and deactivate its siblings
toggle_3.forEach(group=>{
  document.querySelectorAll(group).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if (btn.className.includes("active")){
        document.querySelectorAll(group+".active").forEach(x=>x.classList.remove("active"));
      }else{
        document.querySelectorAll(group+".active").forEach(x=>x.classList.remove("active"));
        btn.classList.add("active");
      }
    })
  })
})

// .active the target element triggered by source element with attribute target-id=""
// [["[target-id]", "target_prefix",optional_func]]

activate_target.forEach(group=>{
    document.querySelectorAll(group[0]).forEach(btn=>{
        btn.addEventListener("click",()=>{
          // console.log(btn,group);
          activateTarget(btn,group[1]);
          if (group.length == 3) group[2](group);
        })
    })
})


// do some premium things like activating the premium features etc.
if (isPrime){
  // show-hide crown in navigation menu  
  document.querySelector("g#Crown").classList.add("active");
}

// set the alert-dot
if (localStorage.alert_dot){
  var alert_dot = JSON.parse(localStorage.alert_dot);// = {nav:[home,profile]}
  document.querySelectorAll("footer.nav .icon").forEach(tab=>{
    if (alert_dot.nav.includes(tab.id)) tab.appendChild(document.createElement("alert-dot"));
  });
  
}

// add notification container into the page body
const NotiContainer = document.createElement("div")
NotiContainer.setAttribute("aria-live","polite")
NotiContainer.setAttribute("aria-atomic","true")
NotiContainer.className="position-relative"
NotiContainer.innerHTML = '<div class="toast-container bottom-0 end-0 p-3"></div>'
document.body.appendChild(NotiContainer)

// sync localStorage to the server every 10 minutes
function SYNC(){
  // get localStorage data to sync with server
  const data = {};
  Object.keys(localStorage).forEach(k=>{
    if ("introDone dataChanged".includes(k)) return
    data[k] = JSON.parse(localStorage[k])
  })

  // remove specific data
  delete data.userProfileData.session

  // get changes only
  const changes = localStorage.dataChanged? dictChanged(JSON.parse(localStorage.dataChanged),data) : data  
  if (Object.keys(changes).length==0) return
  
  // get the csrf_token
  const csrf_token = document.querySelector("input[name='csrfmiddlewaretoken']").value;
  
  // send to server
  fetch("../server/", {
    method: "POST",
    headers: {
      'X-CSRFToken': csrf_token,
      "Content-Type": "application/json"
    },
    body:JSON.stringify({sync:changes})
  })
  .then(e=>{
    // if (!e.ok) throw Error(e.status)
    // update localStorage
    if (e.ok){
      localStorage.dataChanged = JSON.stringify(data);
    }
  })  
}//END: SYNC()
setInterval(SYNC,10*60*1000)

// *********************************** phone's Back button

// it stores the elements as sequential history of opened
// popups | pages | modals etc to close them in same order.
const clickedHistory = [];

// do this on back button clicked
window.onpopstate = e=>{
	toast("back button pressed")
	const el = clickedHistory.reverse()[0];
	// Perform the default back button behavior
	if (!el) {history.back(); return}
	// close page
	else if (el.nodeName === "PAGE") el.querySelector("#back-page").click()
	// close modal
	else if (el.nodeName === "DIV" && el.classList.contains("modal")) el.querySelector("button.btn-close").click()
	// Prevent the default back button behavior
	history.pushState(null, null, window.location.pathname);
};

// add popups | pages | modals etc to the clickedHistory[]
document.querySelectorAll("[back-button-key]").forEach(el=>{
	const observer = new MutationObserver(function(mutationsList, observer) {	
		for (let mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class'){
				// add element
				if (el.classList.contains('modal') && el.classList.contains('show') ||
						el.nodeName === "PAGE" && el.classList.contains('active')
					 ){clickedHistory.push(el)}
				// remove element
				else clickedHistory.pop()
			}
		}
	});
	
	observer.observe(el, { attributes: true, attributeFilter: ['class'] });
	// To disconnect the observer later (when no longer needed):
	// observer.disconnect();
});
