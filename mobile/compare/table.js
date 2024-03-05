// set table heads
function renderTable() {
  const tbody = document.querySelector("section#table tbody");
  const heads = ["Image",
                 "Brand",
                 "Model",
                 "Colors",
                 "Display Screen",
                 "Screen Glass",
                 "Brightness",
                 "Waterproof",
                 "Operating System (OS)",
                 "Processor (Chipset)",
                 "CPU",
                 "GPU",
                 "Card Slot",
                 "ROM (Storage)",
                 "RAM (Memory)",
                 "Battery",
                 "Charging Port",
                 "Charging Power",
                 "Wireless Charging" ,
                 "Camera Rear (Back)",
                 "Camera Front"      ,
                 "LED Flash Light",
                 "Front Flash",
                 "Wireless Display<br>(Screen Cast)",
                 "SIM",
                 "Internet Network",
                 "Wi-Fi",
                 "Bluetooth",
                 "NFC",
                 "Fingerprint",
                 "Audio Jack",
                 "Speaker Sound",
                 "In-Box Items",
                 "Manufacturer",
                 "Release Date",
                 "Price"]    
  // render table template
  heads.forEach((k,i)=>{
      const tr = document.createElement("tr")
      tr.innerHTML += `<td class="c0">${k}</td>
                       <td id="device1-${k.replaceAll(/[() ]/gm,"")}" class="c1"></td>
                       <td id="device2-${k.replaceAll(/[() ]/gm,"")}" class="c2"></td>
                       <td id="device3-${k.replaceAll(/[() ]/gm,"")}" class="c3"></td>`
      // append data into the body of the table section
      tbody.appendChild(tr);
  })
};//END: renderTable()
renderTable();

// fetch the specifications of the selected device
function fetchDeviceSpecs(col) {
  // Get the selected col value from the dropdown menu
  name = document.querySelector("th#"+col).querySelector("#mobile-devices").value.trim();
  if (!validatInput(col,name)) return;
	
  name = name.replaceAll(" ","_");
  console.log(col,name)
	
  // Fetch the corresponding device specifications from the server
  const xhr = new XMLHttpRequest();
  xhr.open('GET', "../server/?file=devices/" + name + '.json', true);
  xhr.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
        // Parse the device specifications as a JSON object
        const device_DATA = JSON.parse(this.responseText);
        // Update the table cells with the device specifications
        // document.getElementById(col + "-Image".replaceAll(/[() ]/gm,"")).style.backgroundImage = `url(https://drive.google.com/uc?export=view&id=${device_DATA.img})`;
        document.getElementById(col + "-Image".replaceAll(/[() ]/gm,"")).style.backgroundImage = `url(${DEVICE_IMGS}/${device_DATA.name.replaceAll(" ","_")}/main.png)`;
        document.getElementById(col + "-Brand".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.brand;
        document.getElementById(col + "-Model".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.model;
        document.getElementById(col + "-Colors".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.color;
        document.getElementById(col + "-Display Screen".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.display.replaceAll("|","<br>");
        document.getElementById(col + "-Screen Glass".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.glass?device_DATA.glass:"tempered glass";
        document.getElementById(col + "-Brightness".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.brightness;
        document.getElementById(col + "-Waterproof".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.waterproof;
        document.getElementById(col + "-Operating System (OS)".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.os.replaceAll("|","<br>");
        document.getElementById(col + "-Processor (Chipset)".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.processor;
        document.getElementById(col + "-CPU".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.cpu.replaceAll(" & ","|").replaceAll("|","<br>")
        document.getElementById(col + "-GPU".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.gpu;
        document.getElementById(col + "-Card Slot".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["card slot"].replace("microsd","microSD");
        document.getElementById(col + "-ROM (Storage)".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.storage.replaceAll(",",", ").replaceAll("|","<br>")+" system";
        document.getElementById(col + "-RAM (Memory)".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.ram.replaceAll(",",", ").replaceAll("|","<br>")+" system";
        document.getElementById(col + "-Battery".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.battery;
        document.getElementById(col + "-Charging Port".replaceAll(/[() ]/gm,"")).innerHTML = (device_DATA["charging port"].toLowerCase().includes("otg")? (device_DATA["charging port"]+" supported"):device_DATA["charging port"]).replaceAll("|","<br>");
        document.getElementById(col + "-Charging Power".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["charging power"].replace("@","- full charge @")+"*";
        document.getElementById(col + "-Wireless Charging".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["wireless charging"];
        document.getElementById(col + "-Camera Rear (Back)".replaceAll(/[() ]/gm,"")).innerHTML = getReso(device_DATA["camera rear"],device_DATA["rear image"]).replaceAll("|","<br>");
        document.getElementById(col + "-Camera Front".replaceAll(/[() ]/gm,"")).innerHTML = getReso(device_DATA["camera front"],device_DATA["front image"]).replaceAll("|","<br>");
        document.getElementById(col + "-LED Flash Light".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["led flash"];
        document.getElementById(col + "-Front Flash".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["front flash"];
        document.getElementById(col + "-Wireless Display<br>(Screen Cast)".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["wireless display"];
        document.getElementById(col + "-SIM".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["dual sim"].replaceAll("|","<br>");
        document.getElementById(col + "-Internet Network".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.network;
        document.getElementById(col + "-Wi-Fi".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.wifi;
        document.getElementById(col + "-Bluetooth".replaceAll(/[() ]/gm,"")).innerHTML = "v"+device_DATA.bluetooth;
        document.getElementById(col + "-NFC".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.nfc;
        document.getElementById(col + "-Fingerprint".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.fingerprint;
        document.getElementById(col + "-Audio Jack".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.audio.toLowerCase().match(/type-c|lightning/g)?(device_DATA.audio+" as audio port"):(device_DATA.audio.replaceAll(" ","")+" audio jack");
        document.getElementById(col + "-Speaker Sound".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.speaker.toLowerCase().match(/stereo/m)? "stereo":"mono"
        document.getElementById(col + "-In-Box Items".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["in-box items"];
        document.getElementById(col + "-Manufacturer".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA.manufacturer;
        document.getElementById(col + "-Release Date".replaceAll(/[() ]/gm,"")).innerHTML = device_DATA["release date"];
        document.getElementById(col + "-Price".replaceAll(/[() ]/gm,"")).innerHTML = "₹ "+device_DATA.price[0];
		document.querySelector("tfoot .btn-"+col.match(/[1-3]/gm)[0]).href = device_DATA.link;
		// update price : issue -> need to add links to all device variants to update each device's price
        // updatePrice(device_DATA.url).then(p=>document.getElementById(col + "-Price".replaceAll(/[() ]/gm,"")).innerHTML = "₹ "+p[0].split(".")[0])
		// update log
		inpLog["c"+col.match(/[0-9]/gm)] = name.replaceAll("_"," ");
		
    } else {console.error(this.statusText)};
  };
  xhr.onerror = function () { console.error(xhr.statusText)};
  xhr.send(null);
}//END: fetchDeviceSpecs()

// ******************** Validate > submit > search   <inputs>

document.querySelectorAll("input#mobile-devices").forEach(inp=>{
	// focusout the input element on submit
	inp.parentNode.addEventListener("submit",e=>inp.blur());
	// submit form when clicked outside of the input element
	inp.addEventListener("blur",e=>inp.parentNode.querySelector("button").click());
	// fetch suggestions for the input string
	inp.addEventListener("input",e=>{
	  const v = inp.value.trim();
	  if (!v || v.length%2) return;
	  
	  fetch("../server/?q="+v)
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
})

const inpLog = {"c1":"","c2":"","c3":""};
function validatInput(col,v) {
	col = "c"+col.match(/[0-9]/gm);
	// clear column if input is empty
	if (v == ""){		
		document.querySelector("tbody [id$='-Image']."+col).style.backgroundImage = "";
		document.querySelectorAll("tbody ."+col).forEach(c=>c.innerHTML="");
		document.querySelector("tfoot .btn-"+col.match(/[0-9]/gm)).setAttribute("href","#");
		inpLog[col] = "";
		return false
	}
	// do nothing if input is same and unchanged
	if(v == inpLog[col]) return false 
	// submit form if input has changed
	return true	
}
	
	
	
	
