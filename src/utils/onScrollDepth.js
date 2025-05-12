function onScrollDepth (callback, depth, ...args) {
    let callbackCalled = false;
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        const scrollYAtMiddleOfViewport = scrollPosition + (windowHeight * depth * 0.5),
            scrollYAtMiddleOfDocument = documentHeight * depth * 0.5;
    
        if (callbackCalled == false && scrollYAtMiddleOfViewport >= scrollYAtMiddleOfDocument) {
            callback(...args);
            callbackCalled = true;
            window.removeEventListener('scroll', handleScroll);
        }
    }
    window.addEventListener('scroll', handleScroll);
};


export default onScrollDepth;