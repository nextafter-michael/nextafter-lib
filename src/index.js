import Popup from './classes/Popup';
import ExitIntentPopup from './classes/ExitIntentPopup';
import onExitIntent from './utils/onExitIntent';

const NextAfter = {
    Popup,
    ExitIntentPopup,
    onExitIntent,
};

export { Popup, ExitIntentPopup, onExitIntent }; // Modular exports
export default NextAfter; // Default export for the main object
