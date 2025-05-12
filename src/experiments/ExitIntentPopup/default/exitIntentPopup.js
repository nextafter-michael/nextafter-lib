import ExitIntentPopup from '../../../classes/ExitIntentPopup.js';
import { variables as popupVariables } from '../../Popup/default/popup.js';

const EXPERIMENT_VARIABLES = [
    ...popupVariables(), // inherit the popup variables from the Popup experiment
    {
        name: 'Exit Intent Delay Seconds', // {{Exit Intent Delay Seconds}}
        mapsTo: 'exitIntentDelaySeconds',
        type: 'number',
        unit: 'seconds',
        value: 0,
    },
];

export default function main (options) {
    return new ExitIntentPopup(null, options);
}

export function variables () {
    return EXPERIMENT_VARIABLES;
}

export function config () {
    return ExitIntentPopup.defaultOptions;
}
