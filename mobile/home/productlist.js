// load list of devices on webpage
const path_NAMELIST = "Devices/namelist.txt";
const path_DEVICES = "Devices/";
const path_DEVICESPEC = "DeviceSpec/";

//step:1 get namelist of devices
function renderProducts() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", path_NAMELIST);
  xhr.onreadystatechange = function() {
      if (this.readyState === 4){
          if (this.status === 200) {
              namelist = this.responseText.replaceAll(" ","_").replaceAll(/(_[\r]?)$/gm,"").split("\n").filter(x=>{if (x!="") return x});              
              // console.log(namelist)
              namelist.forEach(loadProduct)
          } else {console.error(this.statusText)}
      }
      this.onerror = function () {console.error(this.statusText)}
  };//END: xhr()
  xhr.send(null);
};//END renderProducts()

// step:2 load each device onto the webpage
function loadProduct(product_file,i) {
  const section = document.querySelector("section.u-section-3 .u-sheet-1");
  const rupee_icon = `<span class="u-file-icon u-icon u-text-custom-color-4 u-icon-2"><img src="data:image/png;base64,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" alt=""></span>`
    
// Fetch the corresponding device info from the file on the server
  const xhr = new XMLHttpRequest();
  xhr.open('GET', path_DEVICES + product_file + ".json", true);
  xhr.onload = function () {
    if (this.readyState === 4){
        if (this.status === 200) {
            const deviceSpecs = JSON.parse(this.responseText);
            // create a device node and fill it with info
            const device = document.createElement("div");
          device.setAttribute("class","product product-"+i)
            device.innerHTML = `<!-- product-${i}	   -->
          <div class="u-layout">
           <div class="u-layout-left">
<!-- 		product image -->
              <div class="u-container-layout u-container-layout-1 u-image u-image-contain u-image-1">
              </div>
            </div>
            <div class="u-layout-right">
<!-- 		product name -->
              <div class="u-container-layout u-container-layout-2">
                <h3 class="u-align-center u-text u-text-default u-text-1">${deviceSpecs.name}</h3>
              </div>
<!-- 		product description  -->
              <div class="u-container-layout u-container-layout-3">
                <h6 class="u-text u-text-default u-text-2">${productInfo(deviceSpecs)}</h6>
              </div>
<!-- 	   product BUY button-->
              <div class="u-container-layout u-container-layout-4">
                <a href="${deviceSpecs.link}" class="u-align-left u-border-none u-btn u-btn-round u-button-style u-custom-font u-font-montserrat u-gradient u-hover-palette-1-dark-1 u-none u-radius-50 u-text-active-black u-text-hover-white u-btn-1" target="_blank" data-animation-name="" data-animation-duration="0" data-animation-direction=""><span class="u-file-icon u-icon u-text-white u-icon-1"><img src="data:image/png;base64,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" alt=""></span>
                 &nbsp;BUY NOW<br>
                </a>
<!--         product price  -->
                <p class="u-align-right u-custom-font u-font-roboto-slab u-hover-feature u-text u-text-default u-text-custom-color-4 u-text-3">${rupee_icon+deviceSpecs.price[0]}
                </p>
              </div>
<!-- 		product orders placed -->
              <div class="u-container-layout u-container-layout-5">
                <!--<p class="u-align-left u-text u-text-default u-text-4">orders placed<br>-->
                <p class="u-align-left u-text u-text-default u-text-4">Views: ${deviceSpecs.views}<br>
                </p>
                <!--<p class="u-align-right u-text u-text-default u-text-5">${deviceSpecs.orders}</p>-->
                <p class="u-align-right u-text u-text-default u-text-5">User Ratings: ${deviceSpecs.ratings}</p>
              </div>
            </div>              
          </div>`
          // set values
            // device image
            // device.querySelector(".u-image-1").style.backgroundImage = `url(https://drive.google.com/uc?export=view&id=${deviceSpecs.img})`;
            device.querySelector(".u-image-1").style.backgroundImage = `url(${path_DEVICES+"Images/"+deviceSpecs.name.replaceAll(" ","_")}/main.png)`;
            // open device on onclick event
            let x = ["u-image-1","u-text-1","u-text-2"];
            x.forEach((a)=>{
                device.querySelector("."+a).onclick = ()=>{open(path_DEVICESPEC+"devicespec.html?device="+deviceSpecs.name,"_blank")};
            })
            
          // append devie into the section
            section.appendChild(device);
            // device price
            updatePrice(deviceSpecs.url).then(p=>document.querySelector(`.u-section-3 .product-${i} .u-text-3`).innerHTML = rupee_icon+p[0].split(".")[0])
        } else {console.error(this.statusText)}
    }
    this.onerror = function () {console.error(this.statusText)}
  };//END: xhr()
  xhr.send(null);
};//END: loadProduct()

// set device info for different screens
function productInfo(deviceSpecs){
    return `<div id="device-info-1">
    ${deviceSpecs.brand} <b2>${deviceSpecs.network}</b2> Internet.  
    Camera <b2>${deviceSpecs["camera rear"].split("|")[0].replace(/MP(.*)/,"MP</b2>")} 
    ${deviceSpecs.display.split("|").filter(x=>x.includes("Size")?x:"")[0].split(":")[1]} ${deviceSpecs.display.split("|")[0]} 
    with ${deviceSpecs.cpu.split("|")[0]} CPU + 
    <b2>${deviceSpecs.ram.split("|")[0]} RAM</b2> and <b2>${deviceSpecs.storage.split("|")[0]} Storage</b2>.
    Battery <b2>${deviceSpecs.battery.split(" ")[0]}</b2>.  Colors ${deviceSpecs.color} 
    ${deviceSpecs.fingerprint.includes("Yes")?" and <b2>Fingerprint</b2> Senesor":""}
    </div>
    <div id="device-info-2">
    ${deviceSpecs.brand} device at <b2>${deviceSpecs.network}</b2> Internet speed with 
    Back Camera <b2>${deviceSpecs["camera rear"].split("|")[0].replace("MP","MP</b2>")} and 
    Selfie Camera <b2>${deviceSpecs["camera front"].split("|")[0].replace("MP","MP</b2>")}. 
    Display ${deviceSpecs.display.split("|").filter(x=>x.includes("Size")?x:"")} ${deviceSpecs.display.split("|")[0]} 
    Powered with ${deviceSpecs.processor +" "+deviceSpecs.cpu.split("|")[0]} Processor with 
    <b2>${deviceSpecs.ram.split("|")[0]} RAM</b2> and <b2>${deviceSpecs.storage.split("|")[0]} Storage</b2>.
    Battery <b2>${deviceSpecs.battery.replace(" ","</b2> ")}.  Colors ${deviceSpecs.color} 
    ${deviceSpecs.fingerprint.includes("Yes")?" and also with <b2>Fingerprint</b2> Senesor":""}
    </div>`.replaceAll("\n","")
}