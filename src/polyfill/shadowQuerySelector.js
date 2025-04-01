function shadowQuerySelectorAll (selector) {
    let matches = [];
    const traverse = (element) => { // Helper function to recursively traverse elements
        if (element instanceof HTMLElement && element.matches(selector)) // Check if element matches the selector
            matches.push(element);

        if (customElements.get(element.tagName.toLowerCase())) { // Traverse through shadow DOM children if element is a custom element with shadow DOM
            let children = element.shadowRoot ? Array.from(element.shadowRoot.children) : [];
            children.forEach((child) => traverse(child));
        } else { // Traverse through regular children
            Array.from(element.children).forEach((child) => traverse(child));
        }

        if (element.tagName.toLowerCase() === 'slot') { // Handle slot elements
            let slottedNodes = element.assignedNodes({ flatten: true });
            slottedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE)
                traverse(node);
            });
        }
    };
    this instanceof Document ? traverse(this.documentElement) : traverse(this); // Start traversal from the root element as long as it's not the Document
    return matches.length > 0 ? matches : undefined;
};


function shadowQuerySelector (selector) {
    let matches = [];
    const traverse = (element) => { // Helper function to recursively traverse elements
        if (element instanceof HTMLElement && element.matches(selector)) // Check if element matches the selector
            return matches.push(element);

        if (customElements.get(element.tagName.toLowerCase())) { // Traverse through shadow DOM children if element is a custom element with shadow DOM
            let children = element.shadowRoot ? Array.from(element.shadowRoot.children) : [];
            children.forEach((child) => traverse(child));
        } else { // Traverse through regular children
            Array.from(element.children).forEach((child) => traverse(child));
        }

        if (element.tagName.toLowerCase() === 'slot') { // Handle slot elements
            let slottedNodes = element.assignedNodes({ flatten: true });
            slottedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE)
                traverse(node);
            });
        }
    };
    this instanceof Document ? traverse(this.documentElement) : traverse(this); // Start traversal from the root element as long as it's not the Document
    return matches.length > 0 ? matches[0] : undefined;
}


window.HTMLElement.prototype.shadowQuerySelectorAll = window.HTMLElement.prototype.shadowQuerySelectorAll || shadowQuerySelectorAll;
window.HTMLElement.prototype.shadowQuerySelector = window.HTMLElement.prototype.shadowQuerySelector || shadowQuerySelector;
window.Document.prototype.shadowQuerySelectorAll = window.HTMLElement.prototype.shadowQuerySelectorAll || shadowQuerySelectorAll;
window.Document.prototype.shadowQuerySelector = window.HTMLElement.prototype.shadowQuerySelector || shadowQuerySelector;
window.DocumentFragment.prototype.shadowQuerySelectorAll = window.HTMLElement.prototype.shadowQuerySelectorAll || shadowQuerySelectorAll;
window.DocumentFragment.prototype.shadowQuerySelector = window.HTMLElement.prototype.shadowQuerySelector || shadowQuerySelector;


export { shadowQuerySelectorAll, shadowQuerySelector };
export default { shadowQuerySelectorAll, shadowQuerySelector };