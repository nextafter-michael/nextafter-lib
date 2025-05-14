class HomepageTakeoverButton {
  static defaultOptions = {
    buttonTextHTMLHTML: 'Go Back',
    href: 'javascript:void(0)',
    design: {
      top: '1rem',
      left: '1rem',
      color: '#fff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '1rem',
      padding: '0.5rem 1rem',
    }
  }
  constructor (options = {}) {
    options = {
      ...HomepageTakeoverButton.defaultOptions,
      ...options
    };
    const designOptions = {
      ...HomepageTakeoverButton.defaultOptions.design,
      ...options.design
    };
    delete options.design;

    const container = document.createElement('div');
    container.classList.add('homepage-takeover-button-container');
    container.style.setProperty('position', 'fixed');
    container.style.setProperty('z-index', '65536');
    container.style.setProperty('top', 0);
    container.style.setProperty('left', 0);
    container.style.setProperty('padding-top', designOptions.top);
    container.style.setProperty('padding-left', designOptions.left);
    container.style.setProperty('max-width', '100%');

    const link = document.createElement('a');
    link.style.setProperty('display', 'contents');
    link.href = options.href;
    if (link.href === 'javascript:void(0)') {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.location.searchParams.has('fromUrl')) {
          const fromUrl = window.location.searchParams.get('fromUrl');
          window.location.href = fromUrl;
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/'; // Fallback to homepage if no history
        }
      });
    }

    const button = document.createElement('button');
    button.classList.add('homepage-takeover-button');
    button.innerHTML = options.buttonTextHTML;
    Object.entries(designOptions)
      .filter(([key]) => key !== 'top' && key !== 'left')
      .forEach(([key, value]) => {
        button.style.setProperty(key, value);
      });

    container.appendChild(link);
    link.appendChild(button);
    document.body.appendChild(container);

    this.element = button;
    return this;
  }
}

class HomepageTakeover {
  static defaultOptions = {
    homepageUrl: null, // Required: The URL of the homepage
    destinationUrl: null, // Required: The URL to redirect to
    srcParamValue: 'redirect', // Value for the 'src' query parameter
    redirectCooldownDays: 7, // Cooldown period in days
    cookieName: "homepageTakeoverRedirected", // Name of the cookie to store the redirect timestamp
    buttonTextHTML: "Go Back", // Text for the button
    buttonDesign: HomepageTakeoverButton.defaultOptions.design // Design options for the button
  }
  static executeRedirect = function (destinationUrl) {
    if (!destinationUrl)
      return console.warn("No destination URL provided.");
    if (destinationUrl instanceof URL) {
      window.location.assign(destinationUrl.href);
    } else if (typeof destinationUrl === 'string') {
      if (destinationUrl.startsWith('javascript:')) {
        // do nothing
      } else {
        window.location.assign(destinationUrl);
      }
    }
  }
  /**
   * 
   * @param {*} options 
   * @param {string} options.homepageUrl - The URL of the homepage (required)
   * @param {string} options.destinationUrl - The URL to redirect to (required)
   * @param {string} options.srcParamValue - The value for the 'src' query parameter (default: 'redirect')
   * @param {number} options.redirectCooldownDays - The cooldown period in days (default: 7)
   * @param {string} options.cookieName - The name of the cookie to store the redirect timestamp (default: "homepageTakeoverRedirected")
   * @param {string} options.buttonTextHTML - The text for the button (default: "Go Back")
   * @returns 
   */
  constructor (options = {}) {
    this.options = { ...HomepageTakeover.defaultOptions, ...options };

    if (!this.options.destinationUrl)
      return console.warn('HomepageTakeover: destinationUrl is required.');
    
    const currentUrl = new URL(window.location.href);
    const normalizePathname = (url) => url.pathname.replace(/\/+$/, ''); // Remove trailing slashes
    const matchesHomepage = (url) => {
      const homepageUrl = new URL(this.options.homepageUrl, window.location.origin); // Ensure it's an absolute URL
      return normalizePathname(url) === normalizePathname(homepageUrl);
    };
    const matchesDestination = (url) => {
      const destinationUrl = new URL(this.options.destinationUrl, window.location.origin); // Ensure it's an absolute URL
      return normalizePathname(url) === normalizePathname(destinationUrl);
    };
    const isFromRedirect = (url) => {
      url = url instanceof URL ? url : new URL(url, window.location.origin); // Ensure it's an absolute URL
      const fromUrlParam = url.searchParams.get('fromUrl');
      return fromUrlParam && decodeURIComponent(fromUrlParam) === this.options.homepageUrl;
    };
    
    if (matchesHomepage(currentUrl)) {
      return this.handleHomepage(), true;
    } else if (matchesDestination(currentUrl) && isFromRedirect(currentUrl)) {
      return this.handleDestinationPage(), true;
    } else if (matchesDestination(currentUrl)) {
      // This is the destination page, but not from a redirect. Do nothing.
      return false;
    } else {
      // This is neither the homepage nor the destination page. Do nothing.
      return false;
    }
  }
  /**
   * Code that runs on the homepage or source page. This is where the redirect happens if needed.
   */
  handleHomepage () {
    const currentUrl = new URL(window.location.href);
    const queryParams = currentUrl.searchParams;
    const fromUrlParam = queryParams.get('fromUrl');

    if (fromUrlParam) {
      const decodedFromUrl = decodeURIComponent(fromUrlParam);
    } else {
      // This is the source page. Check if we should redirect.
      const lastRedirectTimestamp = localStorage.getItem(this.options.cookieName);
      const now = new Date().getTime();
      const cooldownMilliseconds = this.options.redirectCooldownDays * 24 * 60 * 60 * 1000;

      if (!lastRedirectTimestamp || (now - parseInt(lastRedirectTimestamp, 10)) > cooldownMilliseconds) {
        // Redirect is needed
        const destination = new URL(this.options.destinationUrl, window.location.origin); // Ensure it's an absolute URL

        // Carry over existing UTM parameters
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((utm) => {
          if (queryParams.has(utm) && !destination.searchParams.has(utm)) {
            destination.searchParams.set(utm, queryParams.get(utm));
          }
        });

        // Add 'src' and 'fromUrl' parameters
        this.options.srcParamValue && destination.searchParams.set('src', this.options.srcParamValue);
        destination.searchParams.set('fromUrl', encodeURIComponent(currentUrl.href));

        HomepageTakeover.executeRedirect(destination.href);
        localStorage.setItem(this.options.cookieName, now.toString());
      }
    }
  }
  /**
   * Code that runs on the destination page. This is where the button is added.
   */
  handleDestinationPage () {
    const currentUrl = new URL(window.location.href);
    const queryParams = currentUrl.searchParams;
    const fromUrlParam = queryParams.get('fromUrl');
    if (!fromUrlParam)
      return console.warn('No fromUrl parameter found in the URL.');

    const decodedFromUrl = decodeURIComponent(fromUrlParam);
    new HomepageTakeoverButton({
      buttonTextHTML: this.options.buttonTextHTML,
      href: decodedFromUrl,
      design: this.options.buttonDesign,
    });
  }
}

/*new HomepageTakeover({
  homepageUrl: 'https://example.com/homepage', // Required: The URL of the homepage
  destinationUrl: 'https://example.com/destination', // Required: The URL to redirect to
  srcParamValue: 'redirect', // Value for the 'src' query parameter
  redirectCooldownDays: 7, // Cooldown period in days
  cookieName: "homepageTakeoverRedirected", // Name of the cookie to store the redirect timestamp
  buttonTextHTML: "Go Back", // Text for the button
  buttonDesign: {
    top: '1rem',
    left: '1rem',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '1rem',
    padding: '0.5rem 1rem',
  }
});*/

export default HomepageTakeover;
