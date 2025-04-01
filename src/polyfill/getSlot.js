function getSlot () {
    return this.querySelector('slot') || (this.shadowRoot && this.shadowRoot.querySelector('slot'));
}


window.HTMLElement.prototype.getSlot = window.HTMLElement.prototype.getSlot || getSlot;


export default getSlot;
