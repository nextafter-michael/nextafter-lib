import getSlot from './getSlot.js';


function getSlotNodes (index) {
    if (parseInt(index) !== 'NaN' && index >= 0) {
        return Array.from(getSlot.call(this).assignedNodes({ flatten: true }))[index];
    } else {
        return Array.from(getSlot.call(this).assignedNodes({ flatten: true }));
    }
}


window.HTMLElement.prototype.getSlotNodes = window.HTMLElement.prototype.getSlotNodes || getSlotNodes;


export default getSlotNodes;
