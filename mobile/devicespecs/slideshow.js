// get color from the image and set that color as backgroundColor of the element
function setBgColor(image) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  var pixelData = context.getImageData(0, 0, image.width, image.height).data;

  var colorSum = [0, 0, 0];
  var pixelCount = 0;

  for (var i = 0; i < pixelData.length; i += 4) {
    colorSum[0] += pixelData[i];
    colorSum[1] += pixelData[i + 1];
    colorSum[2] += pixelData[i + 2];
    pixelCount++;
  }

  var color = [
    Math.floor(colorSum[0] / pixelCount),
    Math.floor(colorSum[1] / pixelCount),
    Math.floor(colorSum[2] / pixelCount)
  ];
  console.log(color.join(','))

  const clr = color.indexOf(Math.max(...color));
  let rm,gm,bm,rx,gx,bx;
  // red
  if (clr==0){
    [rm,gm,bm] = [215,60,60];
    [rx,gx,bx] = [255,180,254];
  // green
  }else if (clr==1){
    [rm,gm,bm] = [60,215,60];
    [rx,gx,bx] = [180,255,254];
  // blue
  }else{
    [rm,gm,bm] = [60,60,215];
    [rx,gx,bx] = [180,254,255];
  }
  //min
  if (color[0] < rm) color[0] = rm;
  if (color[1] < gm) color[1] = gm;
  if (color[2] < bm) color[2] = bm;
  //max
  if (color[0] > rx) color[0] = rx;
  if (color[1] > gx) color[1] = gx;
  if (color[2] > bx) color[2] = bx;

  console.log("slide bg color: ",color.join(','))
  document.querySelectorAll(".slide1to2").forEach(slide=>slide.style.backgroundColor = `rgb(${color.join(',')})`);
  const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
  if (brightness <= 127){
    var r = document.querySelector(':root');
    r.style.setProperty('--info-color', 'white');
    // r.style.setProperty('--icon-background-color', `rgb(${color.join(',')})` );
    document.querySelectorAll(".label-block .icon").forEach(icon=>icon.style.backgroundImage = icon.style.backgroundImage.replace("black","white"));    
  }
};//END:setBgColor()
// set info text in 1st and 2nd slide images
function setInfo(l) {
  const data = {"camera-back":getReso(device_DATA["camera rear"],device_DATA["rear image"]).replaceAll("|","<br>").replaceAll(/:|([uU]ltra)?[- ]?[wW]ide|[dD]epth|[Mm]icro|[mM]acro|[Vv]ideo|[0-9]{2,4}[/]/gm,"").replaceAll(" MP","MP")
                ,"camera-front":getReso(device_DATA["camera front"],device_DATA["front image"]).replaceAll("|","<br>").replaceAll(/:|([uU]ltra)?[- ]?[wW]ide|[dD]epth|[Mm]icro|[mM]acro|[Vv]ideo|[0-9]{2,4}[/]/gm,"").replaceAll(" MP","MP")
                ,"wifi":device_DATA.wifi.match(/v(.*)/gm)
                ,"bluetooth":"v"+device_DATA.bluetooth
                ,"nfc":""
                // ,"ir"
                ,"flash-light":device_DATA["led flash"]+(device_DATA["front flash"].toLowerCase().includes("no")?"":"<br>screen flash")
                ,"cpu":((x=device_DATA.processor+"<br>"+device_DATA.cpu.replaceAll(" & ","|").replaceAll("|","<br>").replaceAll(/[[pP]rime|[gG]old|[sS]ilver/gm,""))=>x.includes("Cort")?x.replaceAll(/Kryo [0-9]{2,4}/gm,""):x)()
                ,"gpu":device_DATA.gpu.replaceAll("|","<br>")
                ,"storage":(device_DATA.storage.replaceAll("|","<br>")+" system").replaceAll(",",", ")
                ,"ram":(device_DATA.ram.replaceAll("|","<br>")+" system").replaceAll(",",", ")
                ,"charging-port":(((port=device_DATA["charging port"])=>{return port.toLowerCase().includes("otg")? (port+" supported"):port})()+"<br>"+(device_DATA["charging power"].replace("@","- full charge @")+"*")).replaceAll("|","<br>")
                ,"audio-jack":((a=device_DATA.audio)=>{return a.toLowerCase().match(/type-c|lightning/g)?(a+" as audio port"):(a.replaceAll(" ","")+" audio jack")})()
                // ,"speaker":device_DATA.speaker.toLowerCase().match(/stereo/m)? "stereo":"mono"
                ,"battery":((b=device_DATA.battery.split(" "))=>b[0]+" capacity<br>"+b[1]+" battery")()
                ,"os":device_DATA.os.replaceAll("|","<br>")
                ,"display":((device_DATA.display.replaceAll("|","<br>").replace(" + ","<br>").replace(device_DATA.display.match(/HDR10[+]?/),device_DATA.display.match(/HDR10[+]?/)+" support")+"<br>glass: ")+(device_DATA.glass?device_DATA.glass:"tempered glass")+"<br>brightness: "+device_DATA.brightness).replaceAll(/[rR]esolution/g,"reso").replace(" x ","x")
                ,"network":(device_DATA.network+" Internet Speed|"+device_DATA["dual sim"]).replaceAll("|","<br>")
               }
    return data[l]  
}
// append info images to the slideshow container 
function slideImage1() {
  // container
  const slide = document.createElement("div")
  slide.setAttribute("class","slide1to2 slide-1");

  // device trasparent image
  var div = document.createElement("div")
  var h = document.createElement("div")
  const img = document.createElement("img")

  div.classList.add("device-image-container");
  h.setAttribute("class","device-name")
  h.innerText = device_NAME.replaceAll("_"," ")
  
  // img.setAttribute("src","https://drive.google.com/uc?export=view&id="+device_DATA.Timg)
  img.setAttribute("src",path_IMAGES+device_NAME+"/main.png")
  img.classList.add("device-image");
  img.setAttribute("alt",device_NAME)
  img.onload = ()=>setBgColor(img); //ERROR: cross-origin
  
  // append device image and device name into the slide
  div.appendChild(img)
  slide.appendChild(div)
  slide.appendChild(h)

  // label elements
  var div = document.createElement("div")
  const icon = document.createElement("div")
  var span = document.createElement("span")
  var p = document.createElement("p")
  const labels = ["camera-back",
                  "camera-front",
                  "wifi",
                  "bluetooth",
                  "nfc",
                  // "ir",
                  "flash-light",
                  "cpu",
                  "gpu",
                  "storage",
                  "ram",
                  "special-features",
                  "charging-port",
                  "audio-jack",
                  // "speaker",
                  "battery",
                  "os",
                  "display",
                  "network"
                   ]

  // build label elements  
  labels.forEach((l,i)=>{
    if (l=="nfc" && device_DATA.nfc.toLowerCase() != "yes"){
      return
    }      
    var block = div.cloneNode();
    var head  = div.cloneNode();
    var icon_ = icon.cloneNode();
    var label = span.cloneNode();
    var info = p.cloneNode();

    block.setAttribute("class",l+" label-block label-"+(i+1));    
    head.classList.add("head");
    icon_.classList.add("icon");
    label.classList.add("label");
    
    if (l=="wifi") label.innerHTML = 'Wi-Fi'
    else l.split("-").forEach(t=>{label.innerHTML += t})

    if (l=="special-features"){
      label.innerHTML +="<br>"
      block.appendChild(label)
      
      if (device_DATA.fingerprint.toLowerCase() == "yes"){
        var fingerprint_icon = icon_.cloneNode()
        var fingerprint_info = document.createElement("span");  
        
        fingerprint_icon.style.backgroundImage = `url(${ROOT}/static/images/icons/black/fingerprint.png)`
        fingerprint_info.setAttribute("class","info")
        fingerprint_info.innerHTML = "fingerprint sensor";        
        
        var feat = div.cloneNode();
        feat.appendChild(fingerprint_icon);
        feat.appendChild(fingerprint_info);
        block.appendChild(feat);
      }
      
      var x = device_DATA.waterproof.toLowerCase()
      if (x && x!="no"){
        var water_proof_icon = icon_.cloneNode()
        var water_proof_info = document.createElement("span")
        
        water_proof_icon.style.backgroundImage = `url(${ROOT}/static/images/icons/black/water-proof.png)`;
        water_proof_info.setAttribute("class","info")      
        water_proof_info.innerHTML = (x.includes("splash")?"splash proof": (x.includes("resistant")?"water resistant": "water proof"));  
        
        var feat = div.cloneNode();
        feat.appendChild(water_proof_icon);
        feat.appendChild(water_proof_info);
        block.appendChild(feat);
      }
    }
    else{
      info.classList.add("info");
      info.innerHTML = setInfo(l)
      if (l=="os") icon_.style.backgroundImage = `url(${ROOT}/static/images/icons/black/`+device_DATA.os.toLowerCase().match(/android|ios/g)+".png)"
      else icon_.style.backgroundImage = `url(${ROOT}/static/images/icons/black/`+l.replace(/-back|-front/g,"")+".png)"
      
      // append sub-elements to block
      head.appendChild(icon_)
      head.appendChild(label)
      block.appendChild(head)
      block.appendChild(info)
    }
    
    // append block to container img-1
    if (!block.querySelectorAll(".icon").length) block.style.display = "none";
    slide.appendChild(block)
  })
  // promo text on bottom-right side of the slide
  const promo = document.createElement("div");
  promo.setAttribute("class","promo");
  promo.innerText = device_NAME.replaceAll("_"," ")+" Promoted By @elite.phones.club"
  slide.appendChild(promo)
  
  return slide
};//END: slideImage1()
function slideImage2() {
  // container
  const slide = document.createElement("div");
  const left = document.createElement("div");
  const right = document.createElement("div");
  const top_bottom = document.createElement("div");
  const block_top = document.createElement("div");
  const block_bottom = document.createElement("div");
  
  slide.setAttribute("class","slide1to2 slide-2");
  left.setAttribute("class","left");
  right.setAttribute("class","right");
  top_bottom.setAttribute("class","top-bottom");  
  block_top.setAttribute("class","block-top");
  block_bottom.setAttribute("class","block-bottom");

  // device trasparent images of sides: top bottom left right
  Object.keys(device_DATA.Tsides).forEach(name=>{
    const path = device_DATA.Tsides[name];    
    const tag = document.createElement("p");
    tag.setAttribute("class","img-tag "+name)
    tag.innerText = name;
    
    const img = new Image();
    // img.setAttribute("src","https://drive.google.com/uc?export=view&id="+path)
    // img.src = DEVICE_IMGS+"/"+device_NAME.replaceAll("_"," ")+"/"+path
    img.src = DEVICE_IMGS+"/"+device_NAME+"/"+path
    img.setAttribute("class","img-side img-"+name)
    img.alt = "img_"+name
    // AI : detect speaker | chariging port | buttons etc.
    // img.onload = ()=>imageProcessing(img)

    // top
    if (name=="top"){
        block_top.appendChild(tag);
        block_top.appendChild(img);
      
    // bottom
    }else if (name=="bottom"){
      if (device_DATA.Tsides.top) block_bottom.style.bottom = "0";
      else block_bottom.style.marginTop = "50%";
      block_bottom.appendChild(img);
      block_bottom.appendChild(tag); 
      
    // left
    }else if(name=="left"){
      left.appendChild(img);
      left.appendChild(tag);
    // right
    }else{
      right.appendChild(img);
      right.appendChild(tag);
    }
  })
  // append (block_top + block_bottom) in> top-bottom in> slide
  top_bottom.appendChild(block_top);
  top_bottom.appendChild(block_bottom);
  slide.appendChild(left);
  slide.appendChild(top_bottom);
  slide.appendChild(right);
  // promo text on bottom-right side of the slide
  const promo = document.createElement("div");
  promo.setAttribute("class","promo");
  promo.innerText = device_NAME.replaceAll("_"," ")+" Promoted By @elite.phones.club"
  slide.appendChild(promo)
  return slide
};//END: slideImage2()

// Dynamically create slides and add them to the slideshow container
function showSlides(container) {
    // set slides    
    slidelist.forEach((sld,i)=>{i+=1
        const slide = document.createElement('div');        
        const attrs = {"class":`carousel-item`
                       // "style":`background-image: url("${path_SLIDES}slide${i}.png");`
        }
        Object.keys(attrs).forEach(key => slide.setAttribute(key, attrs[key]));
                                
        if (i==1) slide.appendChild(slideImage1())
        // else if (i==2) slide.appendChild(slideImage2()) //Enable This only when you have side images of every single product
        else{
          if (sld.startsWith("http")) slide.setAttribute("style", `background-image: url(${sld});`)
          else slide.setAttribute("style", `background-image: url("https://drive.google.com/uc?export=view&id=${sld}");`) 
          slide.innerHTML = `<div class="------------"></div>`;
        }

        if (i==1) slide.classList.add('active');
        container.appendChild(slide);
    })  
};//END: renderSlides()

// Dynamically create slide dots and add them to the slideshow
function showSlideDots(container) {
    // set slide dots
    slidelist.forEach((_,i)=>{i+=1
        const dot = document.createElement('button');
        const attrs = {"type":"button",
                       "data-bs-target":"#device-imgs",
                       "data-bs-slide-to":i-1,
                       "aria-label":"Slide "+i,
                       // "style":"width: 12px; height: 12px;",
        }
        Object.keys(attrs).forEach(key => dot.setAttribute(key, attrs[key]));

        if (i==1) {dot.classList.add('active'); dot.setAttribute("aria-current","true")};
        container.appendChild(dot);
    })
};//END: renderSlideDots
