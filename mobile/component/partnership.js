function partnershipHTML(page) {return `
    <header>
        <button id="back-page" target-id=${"#"+page} onclick="activateTarget(this,'page'); document.querySelector('page#partner').innerHTML='';">
            <img src="${ROOT_CDN}/static/images/rightChevorn.svg" alt="back">
        </button>
        <div class="title-font">Partnership Program</div>
    </header>
    <section class="featues">
        <div class="head" style="text-align:center;   margin-bottom:5%;">
            <div class="icon" style="width:15%;   margin:auto;"> <img src="${ROOT_CDN}/static/images/handshake.svg" alt="partner"> </div>
            <p>Features</p>
        </div>
        <ul class="list">
            <li>Sell Products Online</li>
            <li>Increase Sales</li>
            <li>Increase Customers</li>
            <li>Increase Inventory Cycle</li>
            <li>Digital Marketing Support</li>
            <li>Coming More!</li>
        </ul>
    </section>
    <section class="trigger">
        <p>
            <span>93%</span>
            Shop Owners are Interested,<br>ARE YOU?        
        </p>
    </section>
    <section class="btn">
        <button id="yes" onclick="buttonYes('partner');">I'm Interested</button>
    </section>
    
`}

