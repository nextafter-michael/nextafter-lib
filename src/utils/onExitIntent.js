/**
 * onExitIntent - Executes a function after a delay is completed and the exit intent conditions are triggered.
 * @param {function} functionRef - A function to be executed after the delay is completed and the exit intent conditions are triggered.
 * @param {number} delay - The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
 * @param {...*} args - Additional arguments which are passed through to the function specified by functionRef.
 */

function onExitIntent (functionRef, delay = 0, ...args) {
    const onDocumentExit = (event) => { // define a function that will be called when elements are mouseout'd
        if (!event.toElement && !event.relatedTarget) { // only continue if the next element is null (outside of the document)        
            document.removeEventListener('mouseout', onDocumentExit); // stop listening for this event; prevent from firing again
            window.onblur = () => {}; // reset window.onblur callback; prevent from firing again
            
            functionRef.call(null, ...args); // run the code that is supposed to run on exit intent

            /// handle clicks anywhere outside the dialog to close the popup
            const handleClickWhileDialog = (event2) => {
                if (event2.target.tagName.toLowerCase() == "dialog") { // if the popup is the <dialog> element
                    event2.target.close(); // use the built-in close feature to dismiss the popup
                    window.onclick = () => {}; // reset window.onclick callback (the same callback that triggered this event); prevent from firing again
                }
            };
            window.onclick = handleClickWhileDialog; // AFTER the exit has been triggered, listen for clicks in the document. close the popup if the click is not within the <dialog>
        }
    };
   
    return setTimeout(() => {
        document.addEventListener('mouseout', onDocumentExit); // needs to fire on every element exit in the document
        window.onblur = onDocumentExit; // checks if the window loses focus (switch tabs/windows; alt-tab) (document must be focused in order to unfocus)
    }, delay);
}

export default onExitIntent;
