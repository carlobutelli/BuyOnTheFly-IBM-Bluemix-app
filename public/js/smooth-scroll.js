/**
 * smooth-scroll v5.3.7
 * Animate scrolling to anchor links, by Chris Ferdinandi.
 * http://github.com/cferdinandi/smooth-scroll
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

!function(e,t){"function"==typeof define&&define.amd?define([],t(e)):"object"==typeof exports?module.exports=t(e):e.smoothScroll=t(e)}("undefined"!=typeof global?global:this.window||this.global,function(e){"use strict";var t,n,o,r,a={},u=!!e.document.querySelector&&!!e.addEventListener,c={speed:500,easing:"easeInOutCubic",offset:0,updateURL:!0,callbackBefore:function(){},callbackAfter:function(){}},i=function(e,t,n){if("[object Object]"===Object.prototype.toString.call(e))for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(n,e[o],o,e);else for(var r=0,a=e.length;a>r;r++)t.call(n,e[r],r,e)},l=function(e,t){var n={};return i(e,function(t,o){n[o]=e[o]}),i(t,function(e,o){n[o]=t[o]}),n},s=function(t,n){for(var o=n.charAt(0);t&&t!==e.document;t=t.parentNode)if("."===o){if(t.classList.contains(n.substr(1)))return t}else if("#"===o){if(t.id===n.substr(1))return t}else if("["===o&&t.hasAttribute(n.substr(1,n.length-2)))return t;return!1},f=function(e){return Math.max(e.scrollHeight,e.offsetHeight,e.clientHeight)},d=function(e){for(var t,n=String(e),o=n.length,r=-1,a="",u=n.charCodeAt(0);++r<o;){if(t=n.charCodeAt(r),0===t)throw new InvalidCharacterError("Invalid character: the input contains U+0000.");a+=t>=1&&31>=t||127==t||0===r&&t>=48&&57>=t||1===r&&t>=48&&57>=t&&45===u?"\\"+t.toString(16)+" ":t>=128||45===t||95===t||t>=48&&57>=t||t>=65&&90>=t||t>=97&&122>=t?n.charAt(r):"\\"+n.charAt(r)}return a},h=function(e,t){var n;return"easeInQuad"===e&&(n=t*t),"easeOutQuad"===e&&(n=t*(2-t)),"easeInOutQuad"===e&&(n=.5>t?2*t*t:-1+(4-2*t)*t),"easeInCubic"===e&&(n=t*t*t),"easeOutCubic"===e&&(n=--t*t*t+1),"easeInOutCubic"===e&&(n=.5>t?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1),"easeInQuart"===e&&(n=t*t*t*t),"easeOutQuart"===e&&(n=1- --t*t*t*t),"easeInOutQuart"===e&&(n=.5>t?8*t*t*t*t:1-8*--t*t*t*t),"easeInQuint"===e&&(n=t*t*t*t*t),"easeOutQuint"===e&&(n=1+--t*t*t*t*t),"easeInOutQuint"===e&&(n=.5>t?16*t*t*t*t*t:1+16*--t*t*t*t*t),n||t},m=function(e,t,n){var o=0;if(e.offsetParent)do o+=e.offsetTop,e=e.offsetParent;while(e);return o=o-t-n,o>=0?o:0},p=function(){return Math.max(e.document.body.scrollHeight,e.document.documentElement.scrollHeight,e.document.body.offsetHeight,e.document.documentElement.offsetHeight,e.document.body.clientHeight,e.document.documentElement.clientHeight)},g=function(e){return e&&"object"==typeof JSON&&"function"==typeof JSON.parse?JSON.parse(e):{}},v=function(t,n){e.history.pushState&&(n||"true"===n)&&e.history.pushState(null,null,[e.location.protocol,"//",e.location.host,e.location.pathname,e.location.search,t].join(""))},b=function(e){return null===e?0:f(e)+e.offsetTop};a.animateScroll=function(t,n,a){var u=l(u||c,a||{}),i=g(t?t.getAttribute("data-options"):null);u=l(u,i),n="#"+d(n.substr(1));var s="#"===n?e.document.documentElement:e.document.querySelector(n),f=e.pageYOffset;o||(o=e.document.querySelector("[data-scroll-header]")),r||(r=b(o));var y,O,I,S=m(s,r,parseInt(u.offset,10)),E=S-f,H=p(),A=0;v(n,u.updateURL);var L=function(o,r,a){var c=e.pageYOffset;(o==r||c==r||e.innerHeight+c>=H)&&(clearInterval(a),s.focus(),u.callbackAfter(t,n))},Q=function(){A+=16,O=A/parseInt(u.speed,10),O=O>1?1:O,I=f+E*h(u.easing,O),e.scrollTo(0,Math.floor(I)),L(I,S,y)},C=function(){u.callbackBefore(t,n),y=setInterval(Q,16)};0===e.pageYOffset&&e.scrollTo(0,0),C()};var y=function(e){var n=s(e.target,"[data-scroll]");n&&"a"===n.tagName.toLowerCase()&&(e.preventDefault(),a.animateScroll(n,n.hash,t))},O=function(){n||(n=setTimeout(function(){n=null,r=b(o)},66))};return a.destroy=function(){t&&(e.document.removeEventListener("click",y,!1),e.removeEventListener("resize",O,!1),t=null,n=null,o=null,r=null)},a.init=function(n){u&&(a.destroy(),t=l(c,n||{}),o=e.document.querySelector("[data-scroll-header]"),r=b(o),e.document.addEventListener("click",y,!1),o&&e.addEventListener("resize",O,!1))},a});

function RedirectToSell(){
	window.location="sell";
}

function RedirectToCatalog(){
	window.location="catalog";
}

function RedirectToIndex(){
	window.location="index";
}

function RedirectToSignUp(){
	window.location="registration";
}

function RedirectToLogin(){
	window.location="sell";
}

function RedirectToContact(){
	window.location="index#contact";
}

function RedirectToLogOut(){
	window.location="/logout";
}

function RedirectToProfile(){
	window.location="profile";
}