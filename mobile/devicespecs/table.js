// set table with device data info
function renderTable() {
  const table = document.querySelector("section#table");  
  const ram = device_DATA.ram.split("|");
  const storage = device_DATA.storage.split("|");
  const price = device_DATA.price;
  const C = price.length;//count number of varients based on different prices
  const heads = {"Compare Variants":(()=>(C>1)? [ram[0].split(","), storage[0].split(",")] : [[ram[0]],[storage[0]]] )(),
                 "Brand":device_DATA.brand,
                 "Model":device_DATA.model,
                 "Colors":device_DATA.color,
                 "Display Screen":device_DATA.display.replaceAll("|","<br>"),
                 "Screen Glass":device_DATA.glass?device_DATA.glass:"tempered glass",
                 "Brightness":device_DATA.brightness,
                 "Waterproof":device_DATA.waterproof,
                 "Operating System (OS)":device_DATA.os.replaceAll("|","<br>"),
                 "Processor (Chipset)":device_DATA.processor,
                 "CPU":device_DATA.cpu.replaceAll(" & ","|").replaceAll("|","<br>"),
                 "GPU":device_DATA.gpu.replaceAll("|","<br>"),
                 "Card Slot":device_DATA["card slot"].replace("microsd","microSD"),
                 "ROM (Storage)":storage[0].split(",").map(s=>s+"<br>"+storage[1]+" system"),
                 "RAM (Memory)":ram[0].split(",").map(r=>r+"<br>"+ram[1]+" system"),
                 "Battery":device_DATA.battery,
                 "Charging Port":(device_DATA["charging port"].toLowerCase().includes("otg")? (device_DATA["charging port"]+" supported"):device_DATA["charging port"]).replaceAll("|","<br>"),
                 "Charging Power":device_DATA["charging power"].replace("@","- full charge @")+"*",
                 "Wireless Charging" :device_DATA["wireless charging"],
                 "Camera Rear (Back)":getReso(device_DATA["camera rear"],device_DATA["rear image"]).replaceAll("|","<br>"),
                 "Camera Front"      :getReso(device_DATA["camera front"],device_DATA["front image"]).replaceAll("|","<br>"),
                 "LED Flash Light":device_DATA["led flash"],
                 "Front Flash":device_DATA["front flash"],
                 "Wireless Display<br>(Screen Cast)":device_DATA["wireless display"],
                 "SIM":device_DATA["dual sim"].replaceAll("|","<br>"),
                 "Internet Network":device_DATA.network,
                 "Wi-Fi":device_DATA.wifi,
                 "Bluetooth":"v"+device_DATA.bluetooth,
                 "NFC":device_DATA.nfc,
                 "Fingerprint":device_DATA.fingerprint,
                 "Audio Jack":device_DATA.audio.toLowerCase().match(/type-c|lightning/g)?(device_DATA.audio+" as audio port"):(device_DATA.audio.replaceAll(" ","")+" audio jack"),
                 "Speaker Sound":device_DATA.speaker.toLowerCase().match(/stereo/m)? "stereo":"mono",
                 "In-Box Items":device_DATA["in-box items"],
                 "Manufacturer":device_DATA.manufacturer,
                 "Release Date":device_DATA["release date"],
                 "Price":device_DATA.price,
                 "link":device_DATA.link
                }
  console.log(heads);
  // set table
  Object.keys(heads).forEach((k,i)=>{
    const tr = document.createElement("tr");
    
    // set table header
    if (k == "Compare Variants"){
      tr.innerHTML += `<th class="c0 r${i}">${k}</th>`
      for (let ii = 0; ii < C; ii++) {
        tr.innerHTML += `<th id="device-${ii+1}" class="c${ii+1} r${i}"><b>${heads[k][0][ii]+" + "+heads[k][1][ii]}</b></th>`;
      }
      // append data into the head of the table section
      table.querySelector("thead").appendChild(tr);
      
    // set table rows
    }else if (k != "link"){
      tr.innerHTML += `<td class="c0 r${i}">${k}</td>`
      if ("ROM (Storage)RAM (Memory)".includes(k)) price.forEach((_,ii)=>{tr.innerHTML += `<td id="${heads[k][ii].slice(0,3)}" class="c${ii+1} r${i}">${heads[k][ii]}</td>`})
      else if (k == "Price") price.forEach((_,ii)=>{tr.innerHTML += `<td id="price" class="c${ii+1} r${i}">₹ ${heads[k][ii]}</td>`})
      else {for (let ii = 0; ii < C; ii++) {
        tr.innerHTML += `<td id="" class="c${ii+1} r${i}">${heads[k]}</td>`;
       }}
      // append data into the body of the table section
      table.querySelector("tbody").appendChild(tr);
      
    // set table footer
    }else{
      tr.innerHTML += `<td class="c0 r${i}"></td>`
      for (let ii = 0; ii < C; ii++) {
        tr.innerHTML += `
          <td class="c${ii+1} r${i}">
            <a href="${heads[k]}" target="_blank" class="btn-${ii+1}">buy now</a>
          </td>`
      // append data into the footer of the table section
      table.querySelector("tfoot").appendChild(tr);      
      }
    }
  })
};//END: renderTable()

const FORM_ = document.querySelector("form#title");
const input_ = FORM_.children["mobile-devices"];

FORM_.addEventListener("submit",e=>{
  let name = input_.value.trim();
  const this_name = urlParams.get("file").split(".")[0];
  
  // reset the name in input
  if (!name){
    // set table title
    input_.value = this_name;
    return
  }
  // do nothing if no changes
  if (name.toLowerCase() === this_name.toLowerCase()) return

  // get searched device from server
  window.open(`../devicespecs/?file=${name}.json`,"_self");
});
// submit form when clicked outside of the input element
input_.addEventListener("blur",e=>FORM_.querySelector("button").click());
// fetch suggestions for the input string
input_.addEventListener("input",e=>{
  const v = input_.value.trim();
  if (!v || v.length%2) return;
  
  fetch("../server?q="+v)
    .then(response=>{// "Apple iPhone 14,Samsung S20,OnePlus 10R 5G"
      if (!response.ok) throw Error(response.status +" "+ response.statusText)
      const list = document.querySelector("datalist#names");
      list.innerHTML = "";
      
      response.text().then(suggestions=>{
        suggestions.split(",").forEach(name=>{
          var op = document.createElement("option");
          op.value = name;
          list.appendChild(op);
        })
      })        
    })
})
