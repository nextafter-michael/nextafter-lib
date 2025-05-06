import Popup from './Popup.js';
import onExitIntent from '../utils/onExitIntent.js';

class ExitIntentPopup extends Popup {
    static defaultOptions = {
        ...Popup.defaultOptions,
        exitIntentDelaySeconds: 0,
    };
    constructor (options) {
        const exitIntentDelaySeconds = options.exitIntentDelaySeconds || 0;
        if (exitIntentDelaySeconds < 0)
            throw new Error('armDelaySeconds must be a positive number.');
        try {
            super(null, options);
        } catch (error) {
            console.error("Error creating Popup:", error);
            throw error;
        }
        this.options = options;
        this.start(exitIntentDelaySeconds * 1000);
        return this;
    }
    start (delay = 0) {
        onExitIntent(() => {
            if (this.isOpen())
                return console.warn("Popup is already open.");
            this.show(); // open the popup
        }, delay);
    }
};


export default ExitIntentPopup;
