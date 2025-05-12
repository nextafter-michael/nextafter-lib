/**
 * setNestedProperty - Set a nested property in an object using a dot-separated path. If the property does not exist, it will be created.
 * @param {Object} obj - The object to set the property on.
 * @param {string} path - The dot-separated path to the property.
 * @param {*} value - The value to set the property to.
 * @returns {void}
 * @example
 * const obj = {};
 * setNestedProperty(obj, 'a.b.c', 42);
 * console.log(obj); // { a: { b: { c: 42 } } }
 * setNestedProperty(obj, 'a.b[d]', 'hello');
 * console.log(obj); // { a: { b: { c: 42, d: 'hello' } } }
 */
const setNestedProperty = (obj, path, value) => {
    // If the path is undefined or null, log a warning and return the object as is
    if (!path)
        return console.warn('setNestedProperty called with an undefined or null path:', path), obj;
    
    // Split the path into keys using the dot separator
    const keys = path.split('.');
    let current = obj;

    // Iterate through all keys except the last one to traverse or create nested objects/arrays
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the current key does not exist, create an object or array based on the next key
        if (!current[key]) {
            current[key] = isNaN(keys[i + 1]) ? {} : []; // Create an object if the next key is not a number, otherwise create an array
        }
        current = current[key]; // Move to the next level in the object
    }

    // Handle the last key in the path
    const lastKey = keys[keys.length - 1];
    if (lastKey.includes('[') && lastKey.includes(']')) {
        // If the last key contains bracket notation, split it into base key and index
        const [baseKey, index] = lastKey.split(/\[(.+?)\]/).filter(Boolean);
        // If the base key does not exist, create an array
        if (!current[baseKey]) current[baseKey] = [];
        const parsedIndex = parseInt(index, 10); // Parse the index as an integer
        if (!isNaN(parsedIndex)) {
            // If the index is valid, set the value at the specified index
            current[baseKey][parsedIndex] = value;
        } else {
            // Log a warning if the index is invalid
            console.warn(`Invalid index in path: ${path}`);
        }
    } else {
        // If the last key does not contain bracket notation, set the value directly
        current[lastKey] = value;
    }
    return obj; // Return the modified object
};


/**
 * handlebarsVariablesToConfigObject - Convert handlebars variables to a configuration object.
 * @param {Array} handlebarsVariables - The handlebars variables to convert.
 * @param {Object} defaultConfigObject - The default configuration object to merge with.
 * @return {Object} - The configuration object.
 */
export function handlebarsVariablesToConfigObject(handlebarsVariables, defaultConfigObject) {
    // Create a copy of the default configuration object to avoid mutating the original
    const configObject = { ...defaultConfigObject };

    /**
     * Recursively process a variable and set its value in the configuration object.
     * @param {Object} variable - The variable to process.
     * @param {string} pathToProperty - The parent path for nested variables.
     * @return {void}
     */
    const processVariable = (variable, pathToProperty = '') => {
        // Helper functions to determine the type of path notation
        const hasBracketNotation = (mapsToPath) => mapsToPath && mapsToPath.includes('[') && mapsToPath.includes(']');
        const hasDotNotation = (mapsToPath) => mapsToPath && mapsToPath.includes('.');
        const isGroup = (variable) => variable.type === 'group';

        // Construct the full path for the variable
        const fullPath = pathToProperty ? `${pathToProperty}.${variable.mapsTo || ''}` : variable.mapsTo;

        if (isGroup(variable)) {
            // If the variable is a group, process its child items recursively
            if (variable.items && variable.items.length > 0) {
                if (!Array.isArray(variable.items))
                    console.warn(`Variable ${variable.name} is a group but items is not an array.`);
                variable.items.forEach((variableInGroup) => {
                    processVariable(variableInGroup, fullPath);
                });
            } else {
                console.warn(`Variable ${variable.name} is a group but has no items.`);
            }
        } else if (hasBracketNotation(fullPath)) {
            // Handle bracket notation (e.g., actions[0].textHTML)
            const [basePath, index] = fullPath.split(/\[(.+?)\]/).filter(Boolean);
            if (!configObject[basePath]) configObject[basePath] = []; // Create array if it doesn't exist
            const parsedIndex = parseInt(index, 10);
            if (!isNaN(parsedIndex)) {
                if (!configObject[basePath][parsedIndex])
                    configObject[basePath][parsedIndex] = {}; // Create object if it doesn't exist
                const property = fullPath.split('.').pop(); // Extract the property name
                // Ensure correct type for variable.value
                const value = variable.type === 'number' ? Number(variable.value) : String(variable.value);
                configObject[basePath][parsedIndex][property] = value;
            } else {
                console.warn(`Variable ${variable.name} has an invalid index in mapsTo property.`);
            }
        } else if (hasDotNotation(fullPath)) {
            // Handle dot notation (e.g., content.headingHTML)
            const value = variable.type === 'number' ? Number(variable.value) : String(variable.value);
            setNestedProperty(configObject, fullPath, value);
        } else if (fullPath) {
            // Handle simple paths without dot or bracket notation
            const value = variable.type === 'number' ? Number(variable.value) : String(variable.value);
            configObject[fullPath] = value;
        } else {
            // Warn if the variable does not have a valid mapsTo property
            console.warn(`Variable ${variable.name} does not have a valid mapsTo property.`);
        }
    };

    // Iterate over all variables and process them
    handlebarsVariables.forEach((variable) => {
        processVariable(variable);
    });

    // Return the final configuration object
    return configObject;
}


export default {
    handlebarsVariablesToConfigObject
};