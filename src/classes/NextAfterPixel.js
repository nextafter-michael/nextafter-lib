class NextAfterPixel {
    static getURL = "https://pxl.nextafter.org/get_cors.php";
    static sendURL = "https://pxl.nextafter.org/tracker.php";
    static validQueryParams = [ 'id', 'type', 'range', 'from', 'to', 'bypass' ];
    static validateQueryParamValues = {
        amt: (value) => {
            return value && !isNaN(value) && value > 0;
        },
        type: (value) => {
            const validTypes = [ undefined, 'single', 'recurring', 'unbounce' ];
            return validTypes.includes(value);
        },
        range: (value) => {
            const validRanges = [ undefined, 'hour', 'week', 'month', 'year', 'all' ];
            return validRanges.includes(value);
        },
        from: (value) => {
            return value && typeof value == 'string' && /^\d+$/.test(value) && value.length === 4 + 2 + 2 && !isNaN(Date.parse(value));
        },
        to: (value) => {
            return value && typeof value == 'string' && /^\d+$/.test(value) && value.length === 4 + 2 + 2 && !isNaN(Date.parse(value));
        },
        name: (value) => {
            return value && typeof value == 'string' && value.length > 0;
        },
        state: (value) => {
            return value && typeof value == 'string' && value.length > 0;
        },
        city: (value) => {
            return value && typeof value == 'string' && value.length > 0;
        }
    };
    /*static GET = async function (url) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: { accept: "application/json" }
                });

                if (response.status != 200)
                    throw new Error("HTTP error:", response.status);

                const data = await response.json();
                resolve(data);
            } catch (error) {
                console.error("Failed to fetch data from server:", error);
                reject({ error: err.message });
            }
        });
    }*/
   static sendPixel = function (url) {
        const img = new Image();
        img.onload = function () {
            console.log("Pixel sent successfully.");
            this.remove(); // remove the image after it has been loaded
        };
        img.onerror = function () {
            console.error("Error sending pixel.");
            this.remove(); // remove the image even if there was an error
        };
        img.src = url;
        document.body.appendChild(img);
    }

    constructor (id) {
        const _id = Symbol('id');
        this._getId = function () {
            return this[_id];
        };
        this._setId = function (value) {
            this[_id] = value;
        };

        const _debug = Symbol('debug_mode');
        this._getDebugMode = function () {
            return this[_debug];
        };
        this._setDebugMode = function (value) {
            this[_debug] = value;
        };

        this._setId(id);
        this._setDebugMode(false);
        this.responses = [];
    }
    
    get (options = {}, responseCallback = void(0)) {
        const url = new URL(NextAfterPixel.getURL);

        url.searchParams.append('id', this.id); // add id to url
        Object.entries(options) // convert options object to array of key-value pairs
            .filter(([ key, value ]) => value !== undefined) // filter out undefined values
            .map(([ key, value ]) => [ key.toLocaleLowerCase(), value ]) // convert keys to lowercase
            .sort(([ keyA ], [ keyB ]) => { // sort options by valid query params order
                const sortOrder = NextAfterPixel.validQueryParams;
                return sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB);
            }) // sort options by valid query params order, if not found, it will be sorted to the end of the array
            .forEach(([ key, value ]) => {
                if (key == 'id') {
                    url.searchParams.append('id', this.id);
                    console.warn("Warning: Cannot override ID set by constructor.");
                } else if (key == 'bypass') {
                    console.warn("Cannot use bypass parameter in get() method. Enable pixel instance debug mode instead to bypass cache.");
                } else if (key == 'from' || key == 'to') {
                    const date = new Date(value); // convert value to date object
                    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); // format date as YYYYMMDD
                    if (!NextAfterPixel.validateQueryParamValues[key](formattedDate))
                        return console.warn(`Warning: Invalid date format for "${key}" ignored. Expected format is YYYYMMDD.`);
                    url.searchParams.append(key, formattedDate);
                } else if (NextAfterPixel.validQueryParams.includes(key)) {
                    if (NextAfterPixel.validateQueryParamValues[key] && !NextAfterPixel.validateQueryParamValues[key](value))
                        return console.warn(`Warning: Invalid value for "${key}" ignored.`);
                    url.searchParams.append(key, value);
                } else {
                    console.warn(`Warning: Invalid query parameter "${key}" ignored.`); // warn about invalid params
                }
            }); // add options to url

        if (this.debug) { // if debug mode is enabled, add cache bypass parameter
            url.searchParams.append('bypass', '1');
            console.warn("Warning! Bypass mode is intended for testing purposes only. Disable it before launching your experiment.");
        }

        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url.href, {
                    method: "GET",
                    headers: { accept: "application/json" }
                });

                if (response.status != 200)
                    throw new Error("HTTP error:", response.status);

                const data = await response.json();
                if (responseCallback && typeof responseCallback === 'function')
                    responseCallback(data);
                this.responses.push(data);
                resolve(data);

                setTimeout(() => {
                    reject({ error: "Timeout: No response from server after 10 seconds." });
                }, 10 * 1000);
            } catch (error) {
                console.error("Failed to fetch donations from server:", error);
                reject({ error: err.message });
            }
        });
    }

    get_all (options = {}, responseCallback = void(0)) {
        const url = new URL(NextAfterPixel.getURL);

        url.searchParams.append('id', this.id); // add id to url
        Object.entries(options) // convert options object to array of key-value pairs
            .filter(([ key, value ]) => value !== undefined) // filter out undefined values
            .map(([ key, value ]) => [ key.toLocaleLowerCase(), value ]) // convert keys to lowercase
            .sort(([ keyA ], [ keyB ]) => { // sort options by valid query params order
                const sortOrder = [ ...NextAfterPixel.validQueryParams, 'limit', 'offset' ];
                return sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB);
            }) // sort options by valid query params order, if not found, it will be sorted to the end of the array
            .forEach(([ key, value ]) => {
                if (key == 'id') {
                    url.searchParams.append('id', this.id);
                    console.warn("Warning: Cannot override ID set by constructor.");
                } else if (key == 'bypass') {
                    console.warn("Cannot use bypass parameter in get() method. Enable pixel instance debug mode instead to bypass cache.");
                } else if (key == 'from' || key == 'to') {
                    const date = new Date(value); // convert value to date object
                    const formattedDate = date.toISOString().split('T')[0].replace(/-/g, ''); // format date as YYYYMMDD
                    if (!NextAfterPixel.validateQueryParamValues[key](formattedDate))
                        return console.warn(`Warning: Invalid date format for "${key}" ignored. Expected format is YYYYMMDD.`);
                    url.searchParams.append(key, formattedDate);
                } else if ([ ...NextAfterPixel.validQueryParams, 'limit', 'offset' ].includes(key)) {
                    if (NextAfterPixel.validateQueryParamValues[key] && !NextAfterPixel.validateQueryParamValues[key](value))
                        return console.warn(`Warning: Invalid value for "${key}" ignored.`);
                    url.searchParams.append(key, value);
                } else {
                    console.warn(`Warning: Invalid query parameter "${key}" ignored.`); // warn about invalid params
                }
            }); // add options to url

        if (this.debug) { // if debug mode is enabled, add cache bypass parameter
            url.searchParams.append('bypass', '1');
            console.warn("Warning! Bypass mode is intended for testing purposes only. Disable it before launching your experiment.");
        }

        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(url.href, {
                    method: "GET",
                    headers: { accept: "application/json" }
                });

                if (response.status != 200)
                    throw new Error("HTTP error:", response.status);

                const data = await response.json();
                if (responseCallback && typeof responseCallback === 'function')
                    responseCallback(data);
                this.responses.push(data);
                resolve(data);

                setTimeout(() => {
                    reject({ error: "Timeout: No response from server after 10 seconds." });
                }, 10 * 1000);
            } catch (error) {
                console.error("Failed to fetch donations from server:", error);
                reject({ error: err.message });
            }
        });
    }

    track (amount, type) {
        const url = new URL(NextAfterPixel.sendURL);
        url.searchParams.append('id', this.id);
        url.searchParams.append('amount', amount);
        if (type !== 'single' && type !== 'recurring')
            return console.warn(`Warning: Invalid type "${type}" ignored. Valid types are "single" or "recurring".`);
        url.searchParams.append('type', type);
        this.sendPixel(sendURL.href);
    }

    get id () {
        return this._getId();
    }

    set debug (boolean) {
        this._setDebugMode(boolean ? true : false);
        console.info(`Debug mode now ${this._getDebugMode() ? 'enabled' : 'disabled'}`);
    }

    get debug () {
        return this._getDebugMode();
    }
}


async function fetchDonations (id, options = {}, callback = void(0)) {
    const pixel = new NextAfterPixel(id);
    return await pixel.get(options, callback);
}


export { fetchDonations as NextAfterPixelFetchDonations };
export default NextAfterPixel;
