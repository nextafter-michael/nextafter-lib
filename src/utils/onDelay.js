/**
 * onExitIntent - Executes a function after a delay is completed and the exit intent conditions are triggered. (setTimeout wrapper)
 * @param {function} functionRef - A function to be executed after the delay is completed and the exit intent conditions are triggered.
 * @param {number} delay - The time, in milliseconds that the timer should wait before the specified function or code is executed. If this parameter is omitted, a value of 0 is used, meaning execute "immediately", or more accurately, the next event cycle.
 * @param {...*} args - Additional arguments which are passed through to the function specified by functionRef.
 * @returns {number} - The ID of the timer created by setTimeout. This can be used to cancel the timer using clearTimeout.
 * @example
 * onDelay(() => {
 *     console.log("This will be executed after 2 seconds.");
 * }, 2000);
 */

function onDelay (functionRef, delay = 0, ...args) {
    return setTimeout(functionRef, delay, ...args);
}

function onDelaySeconds (functionRef, seconds = 0, ...args) {
    return setTimeout(functionRef, seconds * 1000, ...args);
}

export default onDelay;
export { onDelay, onDelaySeconds };
