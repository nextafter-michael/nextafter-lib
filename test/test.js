import { JSDOM } from 'jsdom';
import Popup, { variables as popupVariables, config as popupConfig } from '../src/experiments/Popup/default/popup.js';
import ExitIntentPopup, { variables as exitIntentPopupVariables, config as exitIntentPopupConfig } from '../src/experiments/ExitIntentPopup/default/exitIntentPopup.js';
import HomepageTakeover, { variables as homepageTakeoverVariables, config as homepageTakeoverConfig } from '../src/experiments/HomepageTakeover/default/homepageTakeover.js';
import { handlebarsVariablesToConfigObject } from '../src/experiments/experimentUtils.js';
import fs from 'fs';

const LOG_FILE_PATH = './test/test.log';
const logTestResult = (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE_PATH, logMessage, 'utf8');
};

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;
global.window = window;
Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'node.js' },
    configurable: true
});
Object.defineProperty(document, 'adoptedStyleSheets', {
    value: [],
    writable: true,
    configurable: true
});
global.CSSStyleSheet = class {
    replace() { return Promise.resolve() }
    replaceSync() { return this }
};

const updateVariables = (variable) => {
    if (variable.type === 'group') {
        variable.items.forEach(updateVariables);
    } else if (variable.type === 'text' || variable.type === 'text:color') {
        variable.value = variable.value || '';
    } else if (variable.type === 'number') {
        variable.value = Number(variable.value) || 0;
    } else if (variable.type === 'boolean') {
        variable.value = Boolean(variable.value);
    }
};

const extendVariablesArray = (variables) => {
    const findVariableRecursively = (variablesToSearch, nameToFind) => {
        for (const variable of variablesToSearch) {
            if (variable && variable.name === nameToFind)
                return variable;
            if (variable && variable.type === 'group' && Array.isArray(variable.items)) {
                const found = findVariableRecursively(variable.items, nameToFind);
                if (found)
                    return found;
            }
        }
        return null;
    };
    Object.defineProperties(variables, {
        get: {
            value: function (name) {
                return findVariableRecursively(this, name);
            }
        },
        set: {
            value: function (name, value) {
                const variable = findVariableRecursively(this, name);
                if (variable) {
                    variable.value = value;
                    updateVariables(variable);
                } else {
                    throw new Error(`Variable ${name} not found`);
                }
            }
        }
    });
    return variables;
};

function testPopupExperiment() {
    console.log('Popup experiment test started...');
    try {
        const vars = popupVariables();
        console.log('\nvariables:');
        console.table(vars);
        extendVariablesArray(vars);

        vars.set('Popup Heading HTML', 'Test Popup Heading HTML 1234567890');
        vars.set('Popup Body HTML', 'Test Popup Body HTML 1234567890');
        vars.set('Popup Footer HTML', 'Test Popup Footer HTML 1234567890');
        vars.set('Popup Action 1 Text', 'Test Popup Action 1 Text 1234567890'); // Corrected name
        vars.set('Popup Action 1 Action', 'https://nextafter.com/'); // Corrected name

        const config = handlebarsVariablesToConfigObject(vars, popupConfig());
        console.log('\nconfig:\n', config);

        const popup = Popup(config);
        console.log('\npopup:\n', popup);

        console.assert(popup, 'Popup should be defined.');

        logTestResult('Test passed: Popup experiment executed successfully.');
    } catch (e) {
        console.error(e);
        logTestResult(`Test failed: ${e.message}`);
    } finally {
        console.log('Popup experiment test finished.');
    }
}

function testExitIntentPopupExperiment() {
    console.log('Exit Intent Popup experiment test started...');
    try {
        const vars = exitIntentPopupVariables();
        console.log('\nvariables:');
        console.table(vars);
        extendVariablesArray(vars);

        vars.set('Popup Heading HTML', 'Test Popup Heading HTML 1234567890');
        vars.set('Popup Body HTML', 'Test Popup Body HTML 1234567890');
        vars.set('Popup Footer HTML', 'Test Popup Footer HTML 1234567890');
        vars.set('Popup Action 1 Text', 'Test Popup Action 1 Text 1234567890'); // Corrected name
        vars.set('Popup Action 1 Action', 'https://nextafter.com/'); // Corrected name
        vars.set('Exit Intent Delay Seconds', 5); // Set the exit intent delay to 5 seconds

        const config = handlebarsVariablesToConfigObject(vars, exitIntentPopupConfig());
        console.log('\nconfig:\n', config);

        const exitIntentPopup = ExitIntentPopup(config);
        console.log('\nexit intent popup:\n', exitIntentPopup);

        console.assert(exitIntentPopup, 'Exit Intent Popup should be defined.');
        console.assert(config.exitIntentDelaySeconds === 5, 'Exit Intent Delay Seconds should be set to 5.');
        
        logTestResult('Test passed: Exit Intent Popup experiment executed successfully.');
    } catch (e) {
        console.error(e);
        logTestResult(`Test failed: ${e.message}`);
    } finally {
        console.log('Exit Intent Popup experiment test finished.');
    }
}

function testHomepageTakeoverExperiment() {
    console.log('Homepage Takeover experiment test started...');
    try {
        const vars = homepageTakeoverVariables();
        console.log('\nvariables:');
        console.table(vars);
        extendVariablesArray(vars);

        vars.set('Homepage URL', 'https://nextafter.com/');
        vars.set('Destination URL', 'https://nextafter.com/');
        vars.set('src Param Value', 'redirect');
        vars.set('Redirect Cooldown Days', 7);
        vars.set('Cookie Name', 'homepageTakeoverRedirected');
        vars.set('Button Text', 'Go Back');
        vars.set('Button Position Top', 16);
        vars.set('Button Position Left', 16);
        vars.set('Button Background Color', '#ff0000');
        vars.set('Button Text Color', '#ffffff');
        vars.set('Button Border Radius', 0);
        vars.set('Button Padding', '12px 24px');

        const config = handlebarsVariablesToConfigObject(vars, homepageTakeoverConfig());
        console.log('\nconfig:\n', config);
        const homepageTakeover = HomepageTakeover(config);
        console.log('\nhomepage takeover:\n', homepageTakeover);

        console.assert(homepageTakeover, 'Homepage Takeover should be defined.');
        console.assert(config.homepageUrl === 'https://nextafter.com/', 'Homepage URL should be set correctly.');
        console.assert(config.destinationUrl === 'https://nextafter.com/', 'Destination URL should be set correctly.');
        console.assert(config.srcParamValue === 'redirect', 'src Param Value should be set correctly.');

    } catch (e) {
        console.error(e);
        logTestResult(`Test failed: ${e.message}`);
    } finally {
        console.log('Homepage Takeover experiment test finished.');
    }
}

async function run () {
    console.log('Running tests...');
    testPopupExperiment();
    testExitIntentPopupExperiment();
    testHomepageTakeoverExperiment();
}

run().then(() => {
    console.log('Tests completed. Check test.log for results.');
}).catch((error) => {
    console.error('Error running tests:', error);
});
