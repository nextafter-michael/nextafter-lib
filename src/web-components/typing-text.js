class TypingText extends HTMLElement {
  
    static defaultOptions = {
        typingSpeed: 16, // characters per second
        delayBetween: 4, // seconds
        delayInitial: 2, // seconds
        iterationCount: Infinity, // no limit; loop infinitely; a loop is a full cycle of all the texts
    };
    
    static CSS = `
        typing-text[typing] { position: relative }
        typing-text[typing]:not(:has(::part(cursor)))::after::after {
            content: '';
            display: block;
            position: absolute; right: -4px; bottom: -3px;
            width: 2px;
            height: 1.75em;
            background-color: white;
            transform: scaleY(0.65) translateY(1px);
            animation: 1s ease-in-out 0s infinite running cursor-blink;
        }
        typing-text::part(cursor) {
            display: inline-block;
            line-height: 1.2;
            width: 2px;
            height: 1em;
            background-color: white;
            transform: scaleY(110%) translate(1px, 1px);
        }
        @keyframes cursor-blink {
            0% { opacity: 1 }
            50% { opacity: 0 }
            100% { opacity: 1 }
        }
    `;
    
    static delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    static cursor = () => {
        const el = document.createElement('i');
        el.classList.add("cursor");
        el.setAttribute("part", "cursor");
        el.animate([ { opacity: 1 }, { opacity: 0 }, { opacity: 1 } ], { duration: 1000, easing: 'ease-in-out', iterations: Infinity });
        return el;
    };
    
    static async writeText (newText) {
        const isElement = newText.nodeType === Node.ELEMENT_NODE;
        this.shadowRoot.innerHTML = ''; // Clear existing text
        if (isElement) {
            const element = newText.cloneNode(true);
            const cursor = TypingText.cursor();
            element.textContent = '';
            this.shadowRoot.append(element);
            this.shadowRoot.append(cursor);
            element.setAttribute("cursor", "typing");
            newText = newText.textContent.trim();
            for (let i = 0; i < newText.length; i++) {
                if (this.animationPaused) {
                    await TypingText.delay(100); i--; continue;
                }
                element.textContent = element.textContent + newText[i];
                await TypingText.delay(1000 / this.options.typingSpeed);
            }
            element.removeAttribute("cursor");
            cursor.remove();
            return element;
        } else {
            const textNode = document.createTextNode('');
            textNode.nodeValue = '';
            this.shadowRoot.append(textNode);
            newText = newText.nodeValue.trim();
            for (let i = 0; i < newText.length; i++) {
                if (this.animationPaused) {
                    await TypingText.delay(100); i--; continue;
                }
                textNode.nodeValue = textNode.nodeValue + newText[i];
                await TypingText.delay(1000 / this.options.typingSpeed);
            }
            return textNode;
        }
    }
   
    static async deleteText () {
        const isElement = this.shadowRoot.firstChild.nodeType === Node.ELEMENT_NODE;
        if (isElement) {
            const element = this.shadowRoot.firstChild;
            const cursor = TypingText.cursor();
            this.shadowRoot.append(cursor);
            element.setAttribute("cursor", "typing");
            while (element.textContent.length > 0) {
                if (this.animationPaused) {
                    await TypingText.delay(100); continue;
                }
                element.textContent = element.textContent.slice(0, -1);
                await TypingText.delay(1000 / this.options.typingSpeed);
            }
            element.removeAttribute("cursor");
            cursor.remove();
        } else {
            const textNode = this.shadowRoot.firstChild;
            while (textNode.nodeValue.length > 0) {
                if (this.animationPaused) {
                    await TypingText.delay(100); continue;
                }
                textNode.nodeValue = textNode.nodeValue.slice(0, -1);
                await TypingText.delay(1000 / this.options.typingSpeed);
            }
        }
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // You can create a shadow root if you want to encapsulate your styles and markup
        this.slots = new Array();
        this.options = { ...TypingText.defaultOptions };
        const attributes = this.attributes;
        for (let { name, value } of attributes) {
            if (!Number.isNaN(parseFloat(value)))
                value = parseFloat(value) % 1 === 0 ? parseInt(value) : parseFloat(value);
            switch (name) {
                case "typing-speed":
                    this.options.typingSpeed = value;
                    break;
                case "delay-between":
                    this.options.delayBetween = value;
                    break;
                case "delay-initial":
                    this.options.delayInitial = value;
                    break;
                case "iteration-count":
                    this.options.interationCount = value;
                    break;
                default:
                    this.options[name] = value;
            }
        }
      
        if (this.shadowRoot.ownerDocument.querySelectorAll('style[name="TypingText"]').length == 0)
            this.ownerDocument.head.insertAdjacentHTML('beforeend', `<style name="TypingText" type="text/css">${TypingText.CSS}</style>`);

        window.addEventListener('blur', () => this.pauseAnimation());
        window.addEventListener('focus', () => this.resumeAnimation());

        return this;
    }
   
    connectedCallback() {
        Array.from(this.childNodes).forEach((childNode, index) => { // Iterate through child nodes and convert them into slots
            switch (childNode.nodeType) {
                case Node.TEXT_NODE:
                    if (childNode.nodeValue.trim().length > 0)
                        this.addSlot(childNode); 
                    break;
                case Node.ELEMENT_NODE:
                    if (childNode.matches('br') || childNode.matches('hr') || childNode.matches('input')) {
                        console.warn("Element that cannot contain text nodes or other elements will be ignored:", childNode);
                        childNode.remove();
                        break;
                    }
                    this.addSlot(childNode);
                    break;
            }
        });
        this.startAnimation();
    }
    
    addSlot (node) {
        this.shadowRoot.append(node);
        this.slots.push(node);
    }
    
    removeSlot (node) {
        if (this.slots.includes(node) || this.slots.indexOf(node) !== -1)
            this.slots = this.slots.splice(this.slots.indexOf(node), 1);
        if (this.shadowRoot.contains(node))
            node.remove();
    }
    
    addSlots (...nodes) {
        nodes.forEach((node) => this.addSlot(node));
    }
    
    removeSlots (...nodes) {
        nodes.forEach((node) => this.removeSlot(node));
    }
    
    addText (newText) {
        const textNode = document.createTextNode(newText);
        this.addSlot(textNode);
    }
    
    removeText (existingText) {
        const existingNode = this.slots.find((node) => node.nodeValue = existingText || node.match(existingText));
        if (existingNode)
            this.removeSlot(existingNode)
    }
    
    async startAnimation () {
        this.animationIndex = 0;
        let iterationCount = 0;
        const initialNode = this.slots[this.animationIndex++].cloneNode(true);
        this.shadowRoot.innerHTML = ''; // Clear existing text
        this.shadowRoot.append(initialNode);
        if (this.options.iterationCount === 0) // if iteration count is 0 and animation is started, cancel
            return this.pauseAnimation();
        await TypingText.delay(this.options.delayInitial * 1000);
        while (this.options.iterationCount === Infinity || iterationCount < this.options.iterationCount) {
            if (this.animationPaused) {
                await TypingText.delay(100); // Wait briefly before checking again
                continue;
            }
            if (this.slots.length === 0) {
                console.warn('<typing-text>', "No text to animate.\n", this);
                break; // Exit loop if no slots available
            }
            const text = this.slots[this.animationIndex];
            this.setAttribute("typing",'');
            await TypingText.deleteText.call(this);
            await TypingText.writeText.call(this, text);
            this.removeAttribute("typing");
            this.animationIndex = (this.animationIndex + 1) % this.slots.length;
            if (this.animationIndex === 0)
                iterationCount++;
            await TypingText.delay(this.options.delayBetween * 1000);
        }
    }
    
    pauseAnimation () {
        this.animationPaused = true;
    }
   
    resumeAnimation () {
        this.animationPaused = false;
        this.startAnimation();
    }
}


// customElements.define('typing-text', TypingText);

   
export default TypingText;