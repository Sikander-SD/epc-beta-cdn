/* ROOT */
:roo{
  --innerHeight: 100vh;  
  --innerWidth: 100vw;
}
tab.active + footer.nav{display:block;}
page{
  display:block;
  padding-bottom:15%;
}
.full-screen{
  height:var(--innerHeight);
  width:var(--innerWidth);
  overflow:hidden;
  text-align:center;
}
img{width:100%;height:auto;}
svg{height:auto;}
.icon{width:10%;}
.title{text-align:center;}
.title-font{
  text-align:center;
  margin:2%;
  font-size:7vw;
  font-weight:600;
  font-family:ABeeZee;
}
h5{margin:0;}
p{font-size:5vw;margin:0;word-wrap: break-word;}
p1{font-size:4vw;margin:auto 0;word-wrap: break-word;}
.btn{border:none;}
input[type="submit"],button{
  padding:2% 8%;
  border:solid 1px #00000033;
  border-radius:50vw;
  font-size:5vw;
  font-weight:500;
  font-family:ABeeZee;
  background:white;
  /*   background:#0d6afd;   color:white; */
}
input[type="submit"]:disabled,button:disabled{background:lightgrey;}
button:active{border:solid 1px #000000;}
button[toggle].active,
button[toggle-3].active,
button.active{background:var(--color-accent-a);}
.center{
  display:flex;
  justify-content:center;
  text-align:center;
}
.space-evenly{
  display:flex;
  justify-content:space-evenly;
}
.space-between{
  display:flex;
  justify-content:space-between;
}
#comp-1{
  position:relative;
  overflow:hidden;
}
#comp-1 .bg{
  position:absolute;
  display:flex;
  width:100%;
  left:0;
  top:0;
  z-index:-1;
  filter:blur(5px);
}
#comp-1 .bg img{
/*   width:100%; */
  margin:auto;
  transform:translateY(-40%);
}
#comp-1 .profile{
  width: 30%;
  margin:5% auto;
}
#comp-1 .userimg{
  position:relative;
  width: 30vw;
  height: 30vw;
  display:flex;
}
#comp-1 shade{
  position:absolute;
  border-radius:100%;
/*   border:solid 3px; */
  top:0;
  left:0;
  /* z-index:-1; */
  width:100%;
  height:100%;
  /* background:black; */
  box-shadow: 0px 0px 10px black;
/*   filter: blur(10px); */
}
#comp-1 .userimg img{
  border-radius:100%;
  margin:auto;
}

/* input */

/* input:invalid{border:none;} */
/* input:valid{border:none;border:solid green;} */
input{
  border:solid 1px #0001;
  border-radius:10vw;
  background:#00f2;
  outline:none;
  padding-left:3%;
}

footer alert-dot{
  width:10px;
  height:10px;
  position:absolute;
  top:0;
  right:-25%;
  /* border:white solid 1px; */
  border-radius:100%;
  background:red;
}
.slogan{
  font-size:6vw;
  font-weight:600;
  font-family:AbeeZee;
  text-align:center;
}
button#back-page{
  transform:rotate(180deg);
  border-radius:unset;
  border:none;
  width:8%;
  background:none;
  padding:0;
  position:absolute;
  top:0.1rem;
  left:0;
  z-index:1;
}
button#back-page img{width:50%;}
.trigger{
  text-align:center;
  margin:10%;
}
.trigger span{
  font-weight:bold;
  font-size:6vw;
  color:green;
}
/* custom colors */

:root{
  --color-male-off:#87e8fd3f;
  --color-female-off:#f087fd3f;
  --color-male-on:#46deff;
  --color-female-on:#f087fd;
/*   app colors  */
  --color-primary-a:none;
  --color-primary-b:none;
  --color-primary-c:none;
  --color-secondary-a:none;
  --color-secondary-b:none;
  --color-secondary-c:none;
  --color-accent-a:lime;
  --color-accent-b:red;
  --color-accent-c:#0075FF;
/* Viberant */
  --color-v-yellow:#f1c50e;
  --color-v-red:#db545a;
  --color-v-lightblue:#2cccc4;
  --color-v-green:#11db0d;
/* light   */
  --color-l-red:#eebaaf;
  --color-l-green:#adff2fc7;

/*  colors  */
color: maroon;
color: darkred;
color: brown;
color: firebrick;
color: red;
color: darkorange;
color: saddlebrown;
color: sandybrown;
color: peru;
color: chocolate;
color: orange;
color: coral;
color: tomato;
color: salmon;
color: sienna;
color: lightsalmon;
color: indianred;
color: rosybrown;
color: lightcoral;
color: darksalmon;
color: mistyrose;
color: salmon;
color: lightpink;
color: pink;
color: hotpink;
color: deepskyblue;
color: dodgerblue;
color: cornflowerblue;
color: steelblue;
color: royalblue;
color: blue;
color: mediumblue;
color: midnightblue;
color: navy;
color: darkblue;
color: blue;
color: slateblue;
color: mediumslateblue;
color: lightskyblue;
color: skyblue;
color: deepskyblue;
color: powderblue;
color: paleturquoise;
color: lightsteelblue;
color: lightblue;
color: aliceblue;
color: aqua;
color: cyan;
color: lightcyan;
color: aquamarine;
color: turquoise;
color: mediumturquoise;
color: darkturquoise;
color: teal;
color: darkcyan;
color: cyan;
color: springgreen;
color: mediumspringgreen;
color: lime;
color: limegreen;
color: yellowgreen;
color: mediumseagreen;
color: seagreen;
color: forestgreen;
color: green;
color: darkgreen;
color: green;
color: lawngreen;
color: chartreuse;
color: lightgreen;
color: palegreen;
color: mediumaquamarine;
color: darkolivegreen;
color: darkseagreen;
color: olive;
color: olivedrab;
color: olive;
color: darkolivegreen;
color: darkkhaki;
color: olive;
color: yellow;
color: gold;
color: goldenrod;
color: darkgoldenrod;
color: peru;
color: chocolate;
color: orange;
color: darkorange;
color: goldenrod;
color: gold;
color: darkkhaki;
color: khaki;
color: khaki;
color: palegoldenrod;
color: wheat;
color: moccasin;
color: papayawhip;
color: blanchedalmond;
color: navajowhite;
color: peachpuff;
color: seashell;
color: beige;
color: oldlace;
color: floralwhite;
color: ivory;
color: mintcream;
color: honeydew;
color: aliceblue;
color: snow;
color: linen;
color: white;
color: whitesmoke;
}



/* slide navigation button */
.nav-btns button{
  border:none; 
  background:none;
  width:35%;
}

button.btn-next img{width:70%;}
button.btn-prev img{width:50%;}

.nav-btns{
  width:100vw;
  position:fixed;
  left:0;
  bottom:4%;
  display:inline-flex;
  justify-content:space-between;
}

/* progress bar */

.progress-bar{
  position:fixed;
  bottom:4%;
  transform: translateX(30%);
  width:60vw;
  background:none !important;
  overflow:hidden;
}
.pBar{
  position:absolute; 
  background:black;
  height:2px;
}
.progress-bar .points *{  
  margin-left:10%;
  background:black;
  width:2%;
  height:2px;
}
.progress-bar .points{
  display:flex;
  justify-content:end;
}


/* footer NAVIGATION */

footer.nav{/* border:solid 1px; */width:100%;display:flex;justify-content:space-evenly;position:fixed;bottom:0;background: linear-gradient(180deg, #fff0 0%, #fff 100%);border-radius:10vw 10vw 0 0;z-index:111;}
footer.nav .icon{width:11%; position:relative;}
footer.nav svg{height:100%;width:100%;fill:none;}
footer.nav .profile{transform:translateY(-9%);}
footer.nav .profile svg{width:120%;}
footer.nav .active:not(.compare) svg{fill:black;}
footer.nav .compare.active svg #ab{stroke:white;}
footer.nav .compare.active svg #change{fill:black;}
g#Crown:not(.active){display:none};

/* grid view */
{}
section.grid .menu {top:1%;}
section.grid .menu img{width:70%;}
section.grid .product-img a{/* display:flex; */}
section.grid .product-colors{left:2%;right:unset; }
section.grid .product-colors div{width:2.5vw;height:8vw;}
section.grid .product-desc{font-size:4vw;}
section.grid .btn-buy{padding:0 10%;}
section.grid.active{
  position: relative;
/*   display:grid;
  grid-template-rows:3fr 1fr; */
}
/* products */
.product{overflow:hidden}
.product-list{margin-top:5%}
.product-list > div{display:block;}
.product-list > div.active{display: grid;grid-template-columns: 1fr 1fr;}
.product-list a{color:inherit;text-decoration:none;}
.product-img{
  padding:2%;
  margin:auto;
	position: relative;
}
/* .product-img .loading-prinner{position: absolute;} */
/* .product-img .loading-prinner div { width: unset;  height: unset;} */
.product-colors{
  position:absolute;
  right:5%;
  top:0;
}
.product-colors div{
  width:6vw;
  height:6vw;
  margin:90% auto;
}
.product-name{
  text-align:center;
  font-family:Abeezee;
  font-weight:600;
  font-size:4.5vw;
  padding-right: 6%;
}
.product .menu{
  position:absolute;
  top:0; right:1%;
  width:8%;
  text-align:center;
}
.product .menu img{ width:25%;}
.product section{background: white;}

/* lcs */

@keyframes show-lcs  {  0% {transform: translateX(  0vw);} 100% {transform: translateX(-17vw);} }
@keyframes hide-lcs {   0% {transform: translateX(  -17vw);}  100% {transform: translateX(0vw);} }
.show-lcs {animation: show-lcs  0.5s ease-in-out forwards;}
.hide-lcs {animation: hide-lcs  0.5s ease-in-out;}

.product .lcs{
  display:grid;
  position:absolute;
  right:0;
  top:6%;
}
.product .lcs-item{
  left:0;
  right:auto; 
}
.product .lcs button{
  border-radius:unset;
  border:none;
  background:none;
  margin:4% 0;
}
.product .lcs-item button{margin:20% 0;}
.product .lcs img, .product .lcs svg{width:50%; margin:auto}
.product .lcs-item img, .product .lcs-item svg{width:60%;}

.product-price{font-weight:500;font-size:4vw;}
.product-price:before{content:"\20b9 "}
page#home section:not(.active),
page:not(.active){
  display:none;
}

.btn-buy{width:100%;}
.btn-buy .buy{
  width:90%;
  font-size:4.5vw;
  background:var(--color-l-red);
}
.product{
  border:solid 1px #0004;
  padding:0 1%;
  position:relative;
  margin:6% 2%;
  border-radius:3vw;
  text-align:center;
}

/******************* Modals *********************/

.modal:not(#logout) .modal-dialog{
  width:100%;
  height:100%;
  margin:0;
}
.modal-header{
  padding:2%;
  font-size:6vw;
  font-weight:500;
}

/* toast */
.toast:not(.slide-in-from-right){
  position: fixed;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  border:none;
  width:auto;
  text-align:center;
  padding:2% 4%;
  border-radius:5vw;
  font-size:x-small;
  font-weight:500;
  z-index:1056;/*1055 is for modals*/
}

/* Modal- #search-deviceModal */

#search-deviceModal .modal-content{
  height: auto;
  border:none;
  background:none;
}
#search-deviceModal .modal-dialog{top:0;}
#search-deviceModal .modal-body{
  background:none;
  display:block;
  padding:5% 10%;
}
#search-deviceModal input{
  animation: scale-width 0.5s cubic-bezier(0.5, 0.35, 0.15, 1) forwards;
  padding:1% 5%;
  background:white;
}
#search-deviceModal p{
  background:white;
  margin-top:5%;
  text-align:center;
  padding:2%;
  font-weight:500;
}
  
/* Notifications */

.toast-header img{width:8%;}
.toast-header small{font-size:10px;}
.toast-container .toast > div{padding:1% 2% 1% 2%}
.toast-container{
  overflow:hidden;
  position:fixed;
}

/* Loading Spinner */

.loading-bar {
  width: 100%;
  height: 3px;
  position: fixed;
	top:0;
  overflow: hidden;
  z-index:1056;
}

.loading-progress {
  height: 100%;
  width: 200%;
  background: linear-gradient(to right,red,blue,green,yellow,red,blue,green,yellow,red);
  animation: loading-bar 1.5s infinite cubic-bezier(1, 1, 0, 0);
}

@keyframes loading-bar {
  0% {transform: translateX(-50%);}
  100% {transform: translateX(0%);}
}
