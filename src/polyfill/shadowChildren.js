function getShadowChildren () {
    if (parseInt(index) !== 'NaN' && index >= 0) {
        return Array.from(this.shadowRoot.children)[index];
    } else {
        return Array.from(this.shadowRoot.children);
    }
}


window.HTMLElement.prototype.shadowChildren = window.HTMLElement.prototype.shadowChildren || getShadowChildren;


export default getShadowChildren;
