function asyncWaitForElement (selector, timeout = 10000) {
    return new Promise((resolve, reject) => {

        if (document.querySelector(selector) && document.querySelector(selector).isConnected)
            return resolve(document.querySelector(selector));
        
        let interval;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations)
                for (const addedNode of mutation.addedNodes)
                    if (addedNode instanceof HTMLElement && addedNode.matches(selector) && addedNode.isConnected)
                        return clearInterval(interval), observer.disconnect(), resolve(addedNode);
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });

        interval = setInterval((selector) => {
            if (document.querySelector(selector) && document.querySelector(selector).isConnected)
                return clearInterval(interval), observer.disconnect(), resolve(document.querySelector(selector));
        }, 50, selector);

        setTimeout((observer) => {
            observer.disconnect(),
            reject(new Error(`Element with selector "${selector}" not found within the time limit.`));
        }, timeout, observer);

    });
}

function asyncWaitForElements (...selectors) {
    return Promise.all(selectors.map((selector) => waitForElement(selector)));
}


export { asyncWaitForElement, asyncWaitForElements };
export default asyncWaitForElement;
