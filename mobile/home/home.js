
// toggle active elements for views list,item and grid
var views = document.querySelectorAll("page#home header .left .icon");
views.forEach((btn,i)=>{   btn.addEventListener("click",e=>{
  // remove .active
  btn.classList.remove("active");
  document.querySelectorAll("page#home section.active").forEach(x=>x.classList.remove("active"));

  // to change the style and position of lcs only in item view
  if (btn.className.includes("list")) document.querySelectorAll(".lcs").forEach(x=>x.classList.add("lcs-item"))
  else if (btn.className.includes("item")) document.querySelectorAll(".lcs").forEach(x=>x.classList.remove("lcs-item"));
    
  // to gird view to display products [p1,p2] parallel
  if (btn.className.includes("item")) document.querySelectorAll(".product-list > div").forEach(x=>x.classList.add("active"))
  else document.querySelectorAll(".product-list > div").forEach(x=>x.classList.remove("active"));
  
  if(i == 2)i=-1;

  // add .active
  views[i+1].classList.add("active");
  document.querySelectorAll("page#home .product").forEach(p=>{
    p.querySelectorAll("page#home section")[i+1].classList.add("active")
  });  
})});

// toggle the clicked button in a group of buttons
var a = [
  "#sortModal .top button[toggle]",
  "#sortModal .bottom div[toggle]",
];
a.forEach(x=>toggle_2.push(x));
// .active and toggle the clicked element or button
var a = [
  "#filterModal .right #usage button[toggle-3]",
];
a.forEach(x=>toggle_3.push(x));
// .active or toggle between pages
var a = [
  ["header .mid .premium","page"],
];
a.forEach(x=>activate_target.push(x));

// .active the clicked button in filter left buttons
var filter_left_btns = document.querySelectorAll("#filterModal .left button");
filter_left_btns.forEach(btn=>{   btn.addEventListener("click",e=>{
  document.querySelector("#filterModal .left button.active").classList.remove("active");
  document.querySelector("#filterModal .right div.active").classList.remove("active");
  btn.classList.add("active");
  document.querySelector("#filterModal .right div#"+btn.id).classList.add("active");
})})

// update the number in filter left  to the number of .active buttons in the filter right
var filter_right_btns = document.querySelectorAll("#filterModal .right button:not([type='submit'])");
filter_right_btns.forEach(btn=>{
  btn.addEventListener("click",e=>{
    const p = e.currentTarget.parentNode;
    const c = e.currentTarget.className.includes("active")? -1 : 1;
    const el = document.querySelector("#filterModal .left #"+p.getAttribute("id")+" p");
    
    if (p.getAttribute("id") == "usage") el.innerHTML = (c==1)? 1 : ""
    else el.innerHTML = (Number(el.innerHTML) + c) || "";
  })  
})

// scroll events, show and hide the page and bottom navigation menu on scroll
window.addEventListener('scroll', e=> {
  const tm = document.querySelector("page#home header");
  const thresh = 50;//px
  
  if(SCROLL.y > thresh){
    if (SCROLL.top){
      tm.classList.remove("slide-in-from-top");
      tm.classList.add("slide-out-to-top");
    }else{
      tm.classList.remove("slide-out-to-top");
      tm.classList.add("slide-in-from-top");
    }
  }else{
    tm.classList.remove("slide-out-to-top");
    tm.classList.add("slide-in-from-top");
  }

  //load more products  
  if (isScrolledToBottom() && waiting_flag) {
    if (!page_end){
      let caller="",data="";
      const v = document.querySelector("#search-query p").innerText;    
      
      if      (sortmodal.sort_by){ caller = "sort"; data = sortmodal.data; }
      else if (filtermodal.active){ caller = "filter"; data = filtermodal.data; }
      else if (v){ caller = "query"; data = {q:v}  }
    
      // request server to load next page for the caller
      populateProductList(caller,{...data ,page:product_page })
      .then(e=>{
          waiting_flag = true;
          product_page++;
        });
    
      // prevent it from running rappidly
      waiting_flag = false;
      toast("loading...");
    }else toast("End!");
  }
})

// Like - Comment - Share functionality
class LCS{
  constructor(){
    this.prev = null;
    
    let userProfileData = JSON.parse(localStorage.userProfileData || '{}');
    const lcs = {like:[],comment:[],share:[]};
    
    if (!userProfileData) userProfileData = {lcs:lcs}
    else if (!userProfileData.lcs) userProfileData.lcs = lcs;

    LCS.update(userProfileData);
  }
  
  static update(userProfileData){ localStorage.userProfileData = JSON.stringify(userProfileData) }
  
  // register the id of the liked product in userProfileData
  like(el){
    // get
    const id = el.parentNode.parentNode.getAttribute("id");
    const userProfileData = JSON.parse(localStorage.userProfileData);
    const like = userProfileData.lcs.like;
    const svg = el.querySelector('svg');
    const heart = el.querySelector('path');
    
    // set
    if (like.includes(id)){
      svg.setAttribute('fill', 'none');
      heart.setAttribute('stroke', 'black');
      like.splice(like.indexOf(id), 1);
    }else{
      svg.setAttribute('fill', 'red');
      heart.setAttribute('stroke', 'red');
      like.push(id);
    }
    userProfileData.lcs.like = like;
    
    // update
    LCS.update(userProfileData);
  }

  // share the product in social media apps | copy the link  etc..
  share(el){
    // get
    const product = el.parentNode.parentNode;
    const id = product.getAttribute("id");
    const userProfileData = JSON.parse(localStorage.userProfileData);
    const share = userProfileData.lcs.share;
    
    if (!share.includes(id)){
      // set
      share.push(id);
      userProfileData.lcs.share = share;      
      // update
      LCS.update(userProfileData);
    }

    // share product to social media apps
    const title = product.querySelector(".product-name").textContent;
    const desc = product.querySelector(".product-desc").textContent;
    const url = product.querySelector(".product-name a").href;
    share2Media( { title:title, text:desc, url:url } );
  }

  // comment on the product in the chat-window specific to that product
  comment(el){
    console.error("product chats are not defined yet!")
  }

  // Open | Close the LCS Menu
  call(el) {
  const state = el.parentNode.className.includes("show-lcs");  
    
  // hide prev el
  if (this.prev && this.prev != el) this.close(this.prev)
    
  //show | hide current el
  if (state){ this.close(el);   this.prev = null;}
  else{       this.open(el);    this.prev = el  ;}
}

  // Close the LCS Menu
  close(el){
    const p = el.parentNode;
    const lcs = p.parentNode.querySelector(".lcs");
    
    p.classList.remove("show-lcs");
    p.classList.add("hide-lcs");
    setTimeout(()=>{
      p.classList.remove("hide-lcs");      
    },500)
  }
  
  // Open the LCS Menu
  open(el){
    const p = el.parentNode;
    const lcs = p.parentNode.querySelector(".lcs");
    p.classList.add("show-lcs");
  }

};//END: class LCS{}
const lcs = new LCS();

// close the opened .lcs when switching views
document.querySelector("header .left").addEventListener("click",e=>{
  if (!lcs.prev) return;
  lcs.prev = null;
  document.querySelector(".show-lcs").classList.remove("show-lcs");  
})

// sortModal functionality
class SortModal{
  constructor(){
    this.sort_by=null;
    this.sort_order=null;
    this.data = {by:this.sort_by, order:this.sort_order}    
    this.reset = false;
  };

  clear(){
    let sby = document.querySelector("#sort-by .active");
    let sordr = document.querySelector("#sort-order .active");
    if (sby) sby.classList.remove("active");
    if (sordr) sordr.classList.remove("active");    
    this.sort_by=null; this.sort_order=null;
    this.data = {by:this.sort_by, order:this.sort_order}    
    this.reset = true;
  };

  apply(){
    let sby = document.querySelector("#sort-by .active");
    let sordr = document.querySelector("#sort-order .active");

    if (sby && sordr){
      
      sby = sby.id;   sordr = sordr.id;
      if (sby == this.sort_by && sordr == this.sort_order) return;// dont do the same thing
      
      this.sort_by = sby;      this.sort_order = sordr;
      
      this.data = {by:this.sort_by, order:this.sort_order}
      populateProductList("sort",{...this.data, page:0});
      
    }else if (this.reset) {
      
      populateProductList("",{page:0});
      this.reset=false;
      
    }else toast("Selection Incomplete!");
    
    // reset the page number
    product_page = 1;
    page_end = false;
  };
  
};//END: class SortModal{}
const sortmodal = new SortModal();

// filterModal functionality
class FilterModal{
  constructor(){
    this.data = null;
    this.reset = false;
    this.active = false;
  }

  getData(clear=false){
    let data = {brand,ram,storage,rear,front,display,usage,color,battery};
    
    Object.keys(data).forEach(k=>{
      data[k] = []
      document.querySelectorAll("#filterModal .right #"+k+" .active").forEach(el=>{
        if (clear) el.classList.remove("active")
        else data[k].push(el.getAttribute("id"));
      });
    })
    
    data.price = [];
    document.querySelectorAll("#filterModal .right #price input").forEach(el=>{
        if (clear) el.value = ""
        else data.price.push(el.value);
    });
    if (Number(data.price[0]) > Number(data.price[1])) data.price[1] = ""

    return data;
  }

  clear(){
    // clear the right panel
    this.getData(true);
    // clear the left panel
    document.querySelectorAll("#filterModal .left button p").forEach(p=>p.innerHTML="");
    this.reset = true;
    this.data = null;
  }

  apply(){
    const data = this.getData();
    const has_filters = Object.values(data).flat().join().replaceAll(",","");
    
    if (has_filters) this.reset = false
    else this.clear()
    
    // if data != this.data then change = ture
    if (this.data && data){
      let change;
      Object.keys(data).forEach(k=>{
        //         match keys                      match values
        if (!this.data[k] || data[k].join() != this.data[k].join() ) change = true;
      });
  
      if (!change) return;
    }
    
    // save data
    this.data = data;

    this.active = true;

    // send to server
    if (this.reset){
      populateProductList("",{page:0});
      this.active = this.reset = false;
      this.data = null;
      
    }else populateProductList("filter",{...data, page:0});
    
    // reset the page number
    product_page = 1;
    page_end = false;

    // update number of filters applied
    let x = 0;
    if (data.price.join().replace(",","")) document.querySelector("#filterModal .left button#price p").innerHTML = 1;    
    document.querySelectorAll("#filterModal .left button p").forEach(p=>{p.innerHTML? x++:""});
    document.querySelector("button.icon.filter p").innerHTML = x || "" ;
  }
  
};//END: class FilterModal{}
const filtermodal = new FilterModal();

// intially populate the page with products.
window.addEventListener("load",e=>{
  populateProductList("",{page:0});
  // reset the page
  document.querySelector('footer.nav .icon.home').addEventListener("click",()=>{searchOff()})
});

// ad-slides populate
fetch("../server/?file=adImages/namelist.json")//[{link,src},...]
.then(response=>{
  if (!response.ok) throw ERROR(response.status+" "+response.statusText);
  
  const inner = document.querySelector("#carousel-ads .carousel-inner");
  const btns = document.querySelector("#carousel-ads .carousel-indicators");
  const btn = document.createElement("button");
  btn.setAttribute("type","button"); btn.setAttribute("data-bs-target","#carousel-ads");
  
  response.json().then(d=>d.forEach((ad,i)=>{
    // get
    var div = document.createElement("div");
    var b = btn.cloneNode();

    // set
    if (i==0){
	    div.className = "carousel-item active";
		b.className = "active";		
	    b.setAttribute("aria-current","true");
	}else div.className = "carousel-item";
	  
    b.setAttribute("data-bs-slide-to",i);
    b.setAttribute("aria-label","Slide "+(i+1));
    
    div.onclick = ()=>{window.open(ad.link)};
    div.style.backgroundImage = "url("+ROOT+AD_IMGS+ ((ORIENTATION=="portrait")? "/slides/phone/":"/slides/pc/") +ad.src +")";
    
    // append    
    inner.appendChild(div);
    btns.appendChild(b);
  })
   )
}).catch(err=>{
  console.error(err)
})

// put search query value into the input
document.querySelector("#search-query p").addEventListener("click",e=>{
  document.querySelector('footer.nav .icon.search').click();
  document.querySelector("input#search-device").value = e.currentTarget.innerText;
})

// activate home page and deactivate search page
function searchOff() {
  if (THIS_PAGE == "home" && !document.querySelector("#search-query").hidden){
    // reset products list
    populateProductList("",{page:0});
    
    // reset elements in home view
    document.querySelector("footer.nav .icon.search").classList.remove("active");
    document.querySelector("footer.nav .icon.home").classList.add("active");
    document.querySelector("#carousel-ads").hidden = false;
    document.querySelector("#search-query").hidden = true;
    document.querySelector("#search-query p").innerHTML = "";  
  }  
};//END: searchOff()