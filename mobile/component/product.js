function productHTML(view,data,lr,minimum=false) {
    const veiws = {"list":"","item":"","grid":""}
    veiws[view] = "active";
    const link = `<a href="../devicespecs/?file=${data.name}.json">`;
    const buy = `onclick="window.open('${data.buy}','_blank');"`;
    const lcs_item = (view=="item")? "lcs-item" : "";
    // const img_src = "https://drive.google.com/uc?export=view&id="+data.img;
    const img_src = `${ROOT+DEVICE_IMGS}/${data.name.replaceAll(" ","_")}/main.png`;
    data.color = data.color.split(",");

    const desc1 = `
    <b>${data.network}</b> Internet
    | <b>${data["camera front"].split("|")[0].match(/[0-9]{1,3}/gm)[0]}MP</b>+<b>${data["camera rear"].split("|")[0].match(/[0-9]{1,3}/gm)[0]}MP</b> Camera
    | <b>${data.display.split("|").filter(x=>x.includes("Size")?x:"")[0].match(/[0-9]([.][0-9])?/gm)[0]}</b> inches
    | <b>${data.ram.split("|")[0].match(/[0-9]{1,3}/gm)[0]}GB</b> RAM + <b>${data.storage.split("|")[0].match(/[0-9]{1,3}/gm)[0]}GB</b> Storage
    | <b>${data.battery.match(/[0-9]{4,5}/gm)[0]}mAh</b> Battery
    `.trim();

    const desc2 = `${data.ram.split("|")[0].match(/[0-9]{1,3}/gm)[0]}GB | ${data.storage.split("|")[0].match(/[0-9]{1,3}/gm)[0]}GB    `;
    
    
    const div_lcs = `
    <div class="lcs ${lcs_item}">
        <button id="like" onclick="lcs.like(this);">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path id="heart" d="M23.9242 7.15236L24.9993 8.25757L26.0745 7.15236C32.2066 0.848895 43.1443 3.13492 47.0689 10.7991C48.9816 14.5343 49.271 19.7029 46.0911 25.9766C42.9664 32.1414 36.4949 39.3427 24.9993 47.0725C13.5037 39.3435 7.03225 32.1426 3.90758 25.9779C0.727658 19.7044 1.01708 14.5356 2.92978 10.8002C6.85443 3.13556 17.7921 0.84901 23.9242 7.15236Z" stroke="black" stroke-width="3"></path>
            </svg>
        </button>
        <button id="share" onclick="lcs.share(this);"><img src="${ROOT}/static/images/share.svg" alt="share"></button>
        <button hidden id="comment" onclick="lcs.comment(this);"><img src="${ROOT}/static/images/comment.svg" alt="comment"></button>
    </div>
    `;
    const section_list = `
    <section class="list ${veiws.list}">
        <div class="left product-img">${link}<img src=${img_src} alt="product" onerror="this.src = ROOT+'/static/images/phone.svg'"></a></div>
        <div class="right">
            <div class="top"><div class="product-name">${link}${data.name}</a></div></div>
            <div class="mid"><div class="product-desc">${link}${desc1}</a></div></div>
            <div class="bottom">
                <div class="left">
                    <div class="product-colors">
                        <div style="background:${data.color[0]};"></div>
                        <div style="background:${data.color[1]};"></div>
                        <div style="background:${data.color[2]};"></div>
                    </div>
                    <div class="product-price"> ${data.price[0]}</div>
                </div>
                <div class="right"><div class="btn-buy"><button class="buy" ${buy}>BUY</button></div></div>
            </div>
        </div>            
        <div class="menu" onclick="lcs.call(this);"><img src="${ROOT}/static/images/menu.svg" alt="menu"></div>
    </section>
    `;
    const section_item = `
    <section class="item ${veiws.item}">
        <div class="r1">
            <div class="product-img">${link}<img src=${img_src} alt="product" onerror="this.src = ROOT+'/static/images/phone.svg'"></a></div>
            <div class="product-colors">
                <div style="background:${data.color[0]};"></div>
                <div style="background:${data.color[1]};"></div>
                <div style="background:${data.color[2]};"></div>
            </div>
        </div>
        <div class="r2"><div class="product-name">${link}${data.name}</a></div></div>
        <div class="r3"><div class="product-desc">${link}${desc1}</a></div></div>
        <div class="r4">
            <div class="left"><div class="product-price"> ${data.price[0]}</div></div>
            <div class="right"><div class="btn-buy"><button class="buy" ${buy}>BUY</button></div></div>
        </div>
    </section>
    `;
    
    
    // return the data as element
    return `
    <div class="product ${lr}" id=${data.id}>
    ${minimum? "" : div_lcs}
    ${minimum? "" : section_list}
    ${minimum? "" : section_item}    
    <section class="grid ${veiws.grid}">
        <div class="r1">
            <div class="product-img">${link}<img src=${img_src} alt="product" onerror="this.src = ROOT+'/static/images/phone.svg'"></a></div>
            ${minimum? "" : `<div class="product-colors">
                <div style="background:${data.color[0]};"></div>
                <div style="background:${data.color[1]};"></div>
                <div style="background:${data.color[2]};"></div>
            </div>`}
        </div>
        <div class="r2"><div class="product-name">${link}${data.name}</a></div></div>
        <div class="r3"><div class="product-desc">${link}${desc2}</a></div></div>
        <div class="r4"><div class="product-price"> ${data.price[0]}</div></div>
        ${minimum? "" : `<div class="r5"><div class="btn-buy"><button class="buy" ${buy}>BUY</button></div></div>
        <div class="menu" onclick="lcs.call(this);"><img src="${ROOT}/static/images/menu.svg" alt="menu"></div>`}
    </section>
    
    </div>
    
`}