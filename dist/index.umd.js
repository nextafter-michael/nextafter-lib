!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.NextAfter=e():t.NextAfter=e()}(this,(()=>(()=>{var t={273:()=>{},843:()=>{}},e={};function n(o){var i=e[o];if(void 0!==i)return i.exports;var s=e[o]={exports:{}};return t[o](s,s.exports,n),s.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var o={};return(()=>{"use strict";n.r(o),n.d(o,{ExitIntentPopup:()=>e(),Popup:()=>s(),TypingText:()=>l,asyncWaitForElement:()=>a,default:()=>c,onExitIntent:()=>r});var t=n(843),e=n.n(t),i=n(273),s=n.n(i);const a=function(t,e=1e4){return new Promise(((n,o)=>{if(document.querySelector(t)&&document.querySelector(t).isConnected)return n(document.querySelector(t));let i;const s=new MutationObserver((e=>{for(const o of e)for(const e of o.addedNodes)if(e instanceof HTMLElement&&e.matches(t)&&e.isConnected)return clearInterval(i),s.disconnect(),n(e)}));s.observe(document.documentElement,{childList:!0,subtree:!0}),i=setInterval((t=>{if(document.querySelector(t)&&document.querySelector(t).isConnected)return clearInterval(i),s.disconnect(),n(document.querySelector(t))}),50,t),setTimeout((e=>{e.disconnect(),o(new Error(`Element with selector "${t}" not found within the time limit.`))}),e,s)}))},r=function(t,e=0,...n){const o=e=>{if(!e.toElement&&!e.relatedTarget){document.removeEventListener("mouseout",o),window.onblur=()=>{},t.call(null,...n);const e=t=>{"dialog"==t.target.tagName.toLowerCase()&&(t.target.close(),window.onclick=()=>{})};window.onclick=e}};return setTimeout((()=>{document.addEventListener("mouseout",o),window.onblur=o}),e)};class d extends HTMLElement{static defaultOptions={typingSpeed:16,delayBetween:4,delayInitial:2,iterationCount:1/0};static CSS="\n        typing-text[typing] { position: relative }\n        typing-text[typing]:not(:has(::part(cursor)))::after::after {\n            content: '';\n            display: block;\n            position: absolute; right: -4px; bottom: -3px;\n            width: 2px;\n            height: 1.75em;\n            background-color: white;\n            transform: scaleY(0.65) translateY(1px);\n            animation: 1s ease-in-out 0s infinite running cursor-blink;\n        }\n        typing-text::part(cursor) {\n            display: inline-block;\n            line-height: 1.2;\n            width: 2px;\n            height: 1em;\n            background-color: white;\n            transform: scaleY(110%) translate(1px, 1px);\n        }\n        @keyframes cursor-blink {\n            0% { opacity: 1 }\n            50% { opacity: 0 }\n            100% { opacity: 1 }\n        }\n    ";static delay=t=>new Promise((e=>setTimeout(e,t)));static cursor=()=>{const t=document.createElement("i");return t.classList.add("cursor"),t.setAttribute("part","cursor"),t.animate([{opacity:1},{opacity:0},{opacity:1}],{duration:1e3,easing:"ease-in-out",iterations:1/0}),t};static async writeText(t){const e=t.nodeType===Node.ELEMENT_NODE;if(this.shadowRoot.innerHTML="",e){const e=t.cloneNode(!0),n=d.cursor();e.textContent="",this.shadowRoot.append(e),this.shadowRoot.append(n),e.setAttribute("cursor","typing"),t=t.textContent.trim();for(let n=0;n<t.length;n++)this.animationPaused?(await d.delay(100),n--):(e.textContent=e.textContent+t[n],await d.delay(1e3/this.options.typingSpeed));return e.removeAttribute("cursor"),n.remove(),e}{const e=document.createTextNode("");e.nodeValue="",this.shadowRoot.append(e),t=t.nodeValue.trim();for(let n=0;n<t.length;n++)this.animationPaused?(await d.delay(100),n--):(e.nodeValue=e.nodeValue+t[n],await d.delay(1e3/this.options.typingSpeed));return e}}static async deleteText(){if(this.shadowRoot.firstChild.nodeType===Node.ELEMENT_NODE){const t=this.shadowRoot.firstChild,e=d.cursor();for(this.shadowRoot.append(e),t.setAttribute("cursor","typing");t.textContent.length>0;)this.animationPaused?await d.delay(100):(t.textContent=t.textContent.slice(0,-1),await d.delay(1e3/this.options.typingSpeed));t.removeAttribute("cursor"),e.remove()}else{const t=this.shadowRoot.firstChild;for(;t.nodeValue.length>0;)this.animationPaused?await d.delay(100):(t.nodeValue=t.nodeValue.slice(0,-1),await d.delay(1e3/this.options.typingSpeed))}}constructor(){super(),this.attachShadow({mode:"open"}),this.slots=new Array,this.options={...d.defaultOptions};const t=this.attributes;for(let{name:e,value:n}of t)switch(Number.isNaN(parseFloat(n))||(n=parseFloat(n)%1==0?parseInt(n):parseFloat(n)),e){case"typing-speed":this.options.typingSpeed=n;break;case"delay-between":this.options.delayBetween=n;break;case"delay-initial":this.options.delayInitial=n;break;case"iteration-count":this.options.interationCount=n;break;default:this.options[e]=n}return 0==this.shadowRoot.ownerDocument.querySelectorAll('style[name="TypingText"]').length&&this.ownerDocument.head.insertAdjacentHTML("beforeend",`<style name="TypingText" type="text/css">${d.CSS}</style>`),window.addEventListener("blur",(()=>this.pauseAnimation())),window.addEventListener("focus",(()=>this.resumeAnimation())),this}connectedCallback(){Array.from(this.childNodes).forEach(((t,e)=>{switch(t.nodeType){case Node.TEXT_NODE:t.nodeValue.trim().length>0&&this.addSlot(t);break;case Node.ELEMENT_NODE:if(t.matches("br")||t.matches("hr")||t.matches("input")){console.warn("Element that cannot contain text nodes or other elements will be ignored:",t),t.remove();break}this.addSlot(t)}})),this.startAnimation()}addSlot(t){this.shadowRoot.append(t),this.slots.push(t)}removeSlot(t){(this.slots.includes(t)||-1!==this.slots.indexOf(t))&&(this.slots=this.slots.splice(this.slots.indexOf(t),1)),this.shadowRoot.contains(t)&&t.remove()}addSlots(...t){t.forEach((t=>this.addSlot(t)))}removeSlots(...t){t.forEach((t=>this.removeSlot(t)))}addText(t){const e=document.createTextNode(t);this.addSlot(e)}removeText(t){const e=this.slots.find((e=>e.nodeValue=t||e.match(t)));e&&this.removeSlot(e)}async startAnimation(){this.animationIndex=0;let t=0;const e=this.slots[this.animationIndex++].cloneNode(!0);if(this.shadowRoot.innerHTML="",this.shadowRoot.append(e),0===this.options.iterationCount)return this.pauseAnimation();for(await d.delay(1e3*this.options.delayInitial);this.options.iterationCount===1/0||t<this.options.iterationCount;){if(this.animationPaused){await d.delay(100);continue}if(0===this.slots.length){console.warn("<typing-text>","No text to animate.\n",this);break}const e=this.slots[this.animationIndex];this.setAttribute("typing",""),await d.deleteText.call(this),await d.writeText.call(this,e),this.removeAttribute("typing"),this.animationIndex=(this.animationIndex+1)%this.slots.length,0===this.animationIndex&&t++,await d.delay(1e3*this.options.delayBetween)}}pauseAnimation(){this.animationPaused=!0}resumeAnimation(){this.animationPaused=!1,this.startAnimation()}}const l=d,c={Popup:s(),ExitIntentPopup:e(),asyncWaitForElement:a,onExitIntent:r,TypingText:l}})(),o})()));