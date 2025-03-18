// classes
import ExitIntentPopup from './classes/ExitIntentPopup';
import Popup from './classes/Popup';

// polyfill
// ...

// utils
import asyncWaitForElement from './utils/asyncWaitForElement';
import onExitIntent from './utils/onExitIntent';

// web-components
import TypingText from './web-components/typing-text';


const NextAfter = {
    // classes
    Popup,
    ExitIntentPopup,
    // polyfill

    // utils
    asyncWaitForElement,
    onExitIntent,
    // web-components
    TypingText,
};


export {
    ExitIntentPopup,
    Popup,
    asyncWaitForElement,
    onExitIntent,
    TypingText,
};
export default NextAfter;
