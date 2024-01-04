function partnershipHTML(page) {return `
    <header>
        <button id="back-page" target-id=${"#"+page} onclick="activateTarget(this,'page'); document.querySelector('page#partner').innerHTML='';">
            <img src="${ROOT}/static/images/rightChevorn.svg" alt="back">
        </button>
        <div class="title">
            <h5>Partnership Program</h5>
        </div>
    </header>
    <section class="featues">
        <div class="title">
            <h2>Features</h2>
        </div>
        <ul class="list">
            <li>Sell Products Online</li>
            <li>Increase Sales</li>
            <li>Increase Customers</li>
            <li>Digital Marketing Support</li>
            <li>Reduce Dead Inventory</li>
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

