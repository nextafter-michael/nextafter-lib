# nextafter-lib
NextAfter front-end development library

[![](https://data.jsdelivr.com/v1/package/gh/nextafter-michael/nextafter-lib/badge?style=rounded)](https://www.jsdelivr.com/package/gh/nextafter-michael/nextafter-lib)


## Example Usage
```html
<script type="module">
    import { Popup, onExitIntent } from 'https://cdn.jsdelivr.net/gh/nextafter-michael/nextafter-lib@latest/dist/index.esm.js';
    import NextAfter from 'https://cdn.jsdelivr.net/gh/nextafter-michael/nextafter-lib@latest/dist/index.esm.js';


    const popup1 = new NextAfter.Popup();
    popup1.show();

    const popup2 = new Popup();
    onExitIntent((popup) => {
        popup.show();
    }, 5000, popup2);

    customElements.define('typing-text', NextAfter.TypingText);
</script>
```
