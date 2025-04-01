// classes
import ExitIntentPopup from './classes/ExitIntentPopup';
import NextAfterPixel, { NextAfterPixelFetchDonations } from './classes/NextAfterPixel';
import Popup from './classes/Popup';

// polyfill
import getSlot from './polyfill/getSlot';
import getSlotNodes from './polyfill/getSlotNodes';
import shadowChildren from './polyfill/shadowChildren';
import { shadowQuerySelector, shadowQuerySelectorAll } from './polyfill/shadowQuerySelector';

// utils
import asyncWaitForElement from './utils/asyncWaitForElement';
import onExitIntent from './utils/onExitIntent';
import onScrollDepth from './utils/onScrollDepth';

// web-components
import TypingText from './web-components/typing-text';


const fetchDonations = NextAfterPixelFetchDonations;


const NextAfter = {
    // classes
    Popup,
    ExitIntentPopup,
    NextAfterPixel,
    // polyfill
    getSlot,
    getSlotNodes,
    shadowChildren,
    shadowQuerySelector,
    shadowQuerySelectorAll,
    // utils
    asyncWaitForElement,
    fetchDonations,
    onExitIntent,
    onScrollDepth,
    // web-components
    TypingText,
};


export {
    ExitIntentPopup,
    Popup,
    NextAfterPixel,
    getSlot,
    getSlotNodes,
    shadowChildren,
    shadowQuerySelector,
    shadowQuerySelectorAll,
    asyncWaitForElement,
    fetchDonations,
    onExitIntent,
    onScrollDepth,
    TypingText,
};
export default NextAfter;
