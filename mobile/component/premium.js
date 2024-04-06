function premiumHTML(page,args) {    
    return `

    <header style="position:unset;">
                    <button id="back-page" target-id=${"#"+page} onclick="activateTarget(this,'page'); document.querySelector('page#premium').innerHTML='';">
                        <img src="${ROOT_CDN}/static/images/rightChevorn.svg" alt="back">
                    </button>
                    <div class="title-font">Premium</div>                    
    </header>
    <section class="features">
                    <div class="head" style="text-align:center;   margin-bottom:5%;">
                                    <div class="icon" style="width:15%;   transform:rotate(31deg);   margin:auto;"> <img src="${ROOT_CDN}/static/images/crown.svg" alt="crown"> </div>
                                    <p>Features</p>
                    </div>
                    <ul class="list">
                        <li>Get Alerts On Price Drops</li>
                        <li>Get Alerts On Released Devices</li>
                        <!--<li>Availability of Released Devices</li>-->
                        <li>Pre-Applied Discounts</li>
                        <!--<li>Amazon Prime ~30% OFF</li>-->
                        <!--<li>Best Service Centers near to You</li>-->
                        <li>Coming More!</li>
                    </ul>
    </section>
    <section class="bottom" style="text-align:center;">
                    <div class="trigger"> <p><span>86%</span> Users are Interested,<br>ARE YOU?</p>  </div>
                    <div class="slogan">Buy Prime And Be Prime</div>
                    <div class="btn" style="width:100%;"> <button id="yes" onclick="buttonYes('prime');">I'm Interested</button> </div>
    </section>

    <style>
      #premium  .list{
          background:#0002;
          display:grid;
          justify-content:center;
          margin:auto 10%;
          font-weight:500;
          font-family:ABeeZee;
          padding:7% 0;
        }
    </style>
`}

