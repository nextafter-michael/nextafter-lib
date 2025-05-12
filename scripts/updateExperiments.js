const fs = require('fs');
const path = require('path');
const { library } = require('webpack');

const experimentsDir = path.join(__dirname, '../src/experiments');
const experimentsFile = path.join(experimentsDir, 'experiments.json');


/**
 * detectVariablesFromFiles - Detect variables from files in the experiments directory
 * @description This function detects variables from files in the experiments directory. It reads the content of each file and extracts variables using a regular expression.
 * @param  {...any} files - The files to read and extract variables from.
 * @returns {Object} - An object containing the detected variables and their properties.
 * @example detectVariablesFromFiles('file1.js', 'file2.js', 'file3.js') // returns { variable1: { type: 'number', unit: 'px', default: 0, description: 'an example variable' }, ... }
 */
function detectVariablesFromFiles (filesPath, ...files) {
    const variables = {};
    files.forEach((file) => {
        const filePath = path.join(filesPath, file);
        if (!filePath.endsWith('.js') && !filePath.endsWith('.css') && !filePath.endsWith('.html'))         return; // only process js, css and html files
        if (!fs.existsSync(filePath))
            return console.log(`File ${filePath} does not exist`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const handlebars = /(\w+)\s*:\s*{{([^}]+)}}/g; // regex to detect handlebars variables
        const matches = content.match(handlebars);
        if (matches) {
            matches.forEach((match) => {
                const [variable, type, unit] = match.split(':').map((item) => item.trim());
                const variableName = variable.replace(/{{|}}/g, '').trim(); // remove handlebars from the variable name
                variables[variableName] = {
                    type: type || 'string',
                    unit: 'px',
                    default: 0,
                    description: `This is a ${type} variable`,
                };
            });
        }
    });
    return variables;
}


const defaultExperiment = {
    experiment_name: "Experiment",
    experiment_id: 0,
    author: "System",
    version: '1.0.0',
    description: "",
    path: '', // path to the experiment folder
    variants: [], // list of variants names (directories) in the experiment folder
};
const defaultVariant = {
    variant_name: "Variant",
    variant_id: 0,
    author: "System",
    version: '1.0.0',
    description: "",
    path: '', // path to the experiment variant directory
    files: [], // list of files in the variant directory
    variables: {}, // detect variables from the files in the variant directory
};


/**
 * updateExperimentJson - Update the experiment.json file in the given experiment path.
 * @param {string} experimentPath - The path to the experiment folder
 */
function updateExperimentJson (experimentPath) {
    const experimentJsonPath = path.join(experimentPath, 'experiment.json');

    let experiment;
    if (fs.existsSync(experimentJsonPath)) { // check if experiment.json exists
        console.log(`experiment.json found in ${experimentPath}, updating it.`);
        try {
            experiment = JSON.parse(fs.readFileSync(experimentJsonPath, 'utf-8'));
        } catch (e) {
            console.error(`Error parsing ${experimentJsonPath}, creating a new one. Error: ${e.message}`);
            experiment = null; // Force creation of new experiment
        }

        if (experiment) {
            if (!Array.isArray(experiment.variants)) {
                console.log(`variants property in ${experimentJsonPath} is not an array or is missing. Initializing to empty array.`);
                experiment.variants = [];
            }
            if (!experiment.experiment_id) {
                console.log(`experiment.json found in ${experimentPath} but experiment_id property is missing, creating a new one.`);
                experiment.experiment_id = 0; // This might need a better strategy if IDs must be unique across experiments file
            }
            if (!experiment.experiment_name) {
                console.log(`experiment.json found in ${experimentPath} but experiment_name property is missing, creating a new one.`);
                experiment.experiment_name = path.basename(experimentPath);
            }
            if (!experiment.path) {
                console.log(`experiment.json found in ${experimentPath} but path property is missing, creating a new one.`);
                experiment.path = path.relative(experimentsDir, experimentPath).replace(/\\/g, '/');
            }
        }
    }
    
    if (!experiment) { // Handles case where file didn't exist or was unparsable
        console.log(`experiment.json not found or invalid in ${experimentPath}, creating a new one.`);
        const experimentName = path.basename(experimentPath);
        const nextHighestExperimentId = () => {
            let maxId = 0;
            try {
                const experimentFiles = fs.readdirSync(experimentsDir).filter((file) => {
                    const entryPath = path.join(experimentsDir, file);
                    if (fs.statSync(entryPath).isDirectory()) {
                        const expJsonPath = path.join(entryPath, 'experiment.json');
                        return fs.existsSync(expJsonPath);
                    }
                    return false;
                });

                const ids = experimentFiles.map((dir) => {
                    const filePath = path.join(experimentsDir, dir, 'experiment.json');
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    return data.experiment_id;
                }).filter(id => typeof id === 'number');
                if (ids.length > 0) {
                  maxId = Math.max(0, ...ids);
                }
            } catch(e) {
                console.warn("Could not determine next experiment ID from existing files, using default.", e.message);
            }
            return maxId + 1;
        };
        experiment = {
            ...defaultExperiment,
            experiment_id: nextHighestExperimentId(),
            experiment_name: experimentName,
            path: path.relative(experimentsDir, experimentPath).replace(/\\/g, '/'),
            variants: [], // Initialize with empty variants
        };
    }

    const processedJsonVariants = [];
    let maxExistingVariantId = 0;

    (experiment.variants || []).forEach((variantFromJson) => {
        if (typeof variantFromJson !== 'object' || variantFromJson === null || !variantFromJson.variant_name) {
            console.log(`Skipping invalid variant entry in ${experimentJsonPath}:`, JSON.stringify(variantFromJson));
            return;
        }

        const variantDirForJsonEntry = path.join(experimentPath, variantFromJson.variant_name);
        if (!fs.existsSync(variantDirForJsonEntry) || !fs.statSync(variantDirForJsonEntry).isDirectory()) {
            console.log(`Directory for variant '${variantFromJson.variant_name}' (from JSON) at '${variantDirForJsonEntry}' not found. This variant entry will be ignored.`);
            return; 
        }

        const currentVariant = { ...defaultVariant, ...variantFromJson };
        currentVariant.path = path.relative(experimentsDir, variantDirForJsonEntry).replace(/\\/g, '/');
        currentVariant.variant_name = variantFromJson.variant_name;

        if (typeof currentVariant.variant_id === 'number') {
            if (currentVariant.variant_id > maxExistingVariantId) {
                maxExistingVariantId = currentVariant.variant_id;
            }
        } else {
            delete currentVariant.variant_id;
        }
        
        currentVariant.files = Array.isArray(currentVariant.files) ? currentVariant.files : [];
        currentVariant.variables = (typeof currentVariant.variables === 'object' && currentVariant.variables !== null) ? currentVariant.variables : {};

        processedJsonVariants.push(currentVariant);
    });

    const finalVariantsList = [];
    const variantDirNamesOnDisk = fs.readdirSync(experimentPath).filter((file) => {
        const filePath = path.join(experimentPath, file);
        return fs.statSync(filePath).isDirectory();
    });

    let nextVariantIdCounter = maxExistingVariantId;
    const getNextVariantId = () => {
        nextVariantIdCounter++;
        return nextVariantIdCounter;
    };

    for (const dirName of variantDirNamesOnDisk) {
        const variantAbsolutePath = path.join(experimentPath, dirName);
        const variantCanonicalPath = path.relative(experimentsDir, variantAbsolutePath).replace(/\\/g, '/');
        
        const variantFiles = fs.readdirSync(variantAbsolutePath).filter(f => f.endsWith('.js') || f.endsWith('.css') || f.endsWith('.html'));
        const detectedVariables = detectVariablesFromFiles(variantAbsolutePath, ...variantFiles);

        let existingProcessedVariant = processedJsonVariants.find(v => v.path === variantCanonicalPath || v.variant_name === dirName);

        if (existingProcessedVariant) {
            console.log(`Updating data for existing variant directory: '${dirName}'`);
            existingProcessedVariant.variant_name = dirName;
            existingProcessedVariant.path = variantCanonicalPath;
            existingProcessedVariant.files = variantFiles;
            existingProcessedVariant.variables = detectedVariables;
            if (typeof existingProcessedVariant.variant_id !== 'number') {
                existingProcessedVariant.variant_id = getNextVariantId();
            }
            finalVariantsList.push(existingProcessedVariant);
        } else {
            console.log(`Adding new variant for directory on disk: '${dirName}'`);
            finalVariantsList.push({
                ...defaultVariant,
                variant_name: dirName,
                variant_id: getNextVariantId(),
                path: variantCanonicalPath,
                files: variantFiles,
                variables: detectedVariables,
            });
        }
    }

    experiment.variants = finalVariantsList;
    experiment.variants.sort((a, b) => (a.variant_id || 0) - (b.variant_id || 0));

    fs.writeFileSync(experimentJsonPath, JSON.stringify(experiment, null, 2), 'utf-8');
}


/**
 * updateExperimentsJson - Update the experiments.json file with the current experiments.
 * @returns {void}
 */
function updateExperimentsJson () {
    let experiments = {
        name: "nextafter-lib",
        author: "NextAfter",
        version: "1.0.0",
        lastBuildDate: new Date().toISOString(),
        experiments: []
    };

    // Load existing experiments.json if it exists
    if (fs.existsSync(experimentsFile)) {
        const existingData = JSON.parse(fs.readFileSync(experimentsFile, 'utf-8'));
        experiments.name = existingData.name || experiments.name;
        experiments.author = existingData.author || experiments.author;
        experiments.version = existingData.version || experiments.version;
        experiments.experiments = existingData.experiments || experiments.experiments;
        experiments.lastBuildDate = experiments.lastBuildDate;
    }

    // Ensure all directories in the experiments folder are processed
    const experimentDirectories = fs.readdirSync(experimentsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && entry.name !== 'experiments.json')
        .map((entry) => entry.name); // Map to directory names

    // Check for duplicate experiment IDs
    const experimentIds = new Set();
    experimentDirectories.forEach((experimentDirectoryName) => {
        const experimentDirectoryPath = path.join(experimentsDir, experimentDirectoryName);
        updateExperimentJson(experimentDirectoryPath); // Update the experiment.json file in the experiment directory

        const experimentJsonPath = path.join(experimentDirectoryPath, 'experiment.json');
        if (fs.existsSync(experimentJsonPath)) {
            const experiment = JSON.parse(fs.readFileSync(experimentJsonPath, 'utf-8'));

            // Check for duplicate experiment IDs
            if (experimentIds.has(experiment.experiment_id)) {
                console.log(`Duplicate experiment ID detected: ${experiment.experiment_id} in ${experimentDirectoryPath}`);
            } else {
                experimentIds.add(experiment.experiment_id);
            }

            // Check if the experiment already exists in the experiments list
            const existingExperimentIndex = experiments.experiments.findIndex((exp) => exp.id === experiment.experiment_id);
            if (existingExperimentIndex !== -1) {
                // Update the existing experiment
                experiments.experiments[existingExperimentIndex] = {
                    id: experiment.experiment_id,
                    name: experiment.experiment_name,
                    description: experiment.description,
                    variants: experiment.variants.map((variant) => variant.variant_name),
                };
            } else {
                // Add the new experiment
                experiments.experiments.push({
                    id: experiment.experiment_id,
                    name: experiment.experiment_name,
                    description: experiment.description,
                    variants: experiment.variants.map((variant) => variant.variant_name),
                });
            }
        } else {
            console.log(`experiment.json not found in ${experimentDirectoryPath}`);
        }
    });

    fs.writeFileSync(experimentsFile, JSON.stringify(experiments, null, 2));
}


updateExperimentsJson();