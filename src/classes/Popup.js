import './popup.css';

class Popup {
  static defaultOptions = {
    id: (new Date()).getTime(),
    content: {
      headingHTML: ``,
      bodyHTML: ``,
      footerHTML: ``,
    },
    actions: [
      {
        textHTML: "Yes, I agree!",
        href: "https://donate.example.com/?src=popup",
      },
      {
        textHTML: "No, I do not agree.",
        action: function (clickEvent, dialog) {
          this ? this.close() : dialog.close();
        },
      }
    ],
    design: {
      width: 640,
      popupBackdrop: 'rgba(0 0 0 / 5%)',
      popupForegroundColor: 'black',
      popupBackgroundColor: 'white',
      popupBorder: 'none',
      popupBorderAlternate: 'none',
      popupBorderRadius: '1rem',
      popupButtonForegroundColor: 'black', // used for the first CTA button in the popup
      popupButtonBackgroundColor: '#f5c635', // used for the first CTA button in the popup
      popupButtonBorder: 'none', // used for the first CTA button in the popup
      popupButtonForegroundColor2: 'white', // used for the other CTA buttons in the popup
      popupButtonBackgroundColor2: 'black', // used for the other CTA buttons in the popup
      popupButtonBorder2: 'none', // used for the first CTA button in the popup
    },
    open: false,
    openDelaySeconds: null,
  }

  static createDialogElement = function () {
    const dialog = document.createElement('dialog');
    dialog.id = "popup-" + (new Date()).getTime();
    dialog.classList.add("NextAfterPopup", "popup");
    return document.body.appendChild(dialog), dialog;
  }

  static createCloseButton = function (closeTarget) {
    function dismissPopup (target) {
      target = target || this || null;
      if (target) {
        target instanceof Popup && target.hide();
        target instanceof HTMLDialogElement && target.close();
      }
    }
    const a = document.createElement('a');
    a.classList.add("NextAfterPopup__close-button");
    a.href = "javascript:void(0)";
    a.textContent = '×';
    a.tabIndex = -1;
    a.addEventListener('click', dismissPopup.bind(this, closeTarget));
    return a;
  };

  constructor (existingDialogElement, options = {}) {
    this.config = { ...Popup.defaultOptions, ...options };
    this.config.design = { ...Popup.defaultOptions.design, ...this.config.design };
    this.content = { ...Popup.defaultOptions.content, ...this.config.content };
    this.actions = this.config.actions && this.config.actions.length > 0 ? this.config.actions : Popup.defaultOptions.actions;
    this.config.openAfterSeconds = this.config.openAfterSeconds || this.config.openDelaySeconds || null;
    
    this.dialog = existingDialogElement || Popup.createDialogElement();
    this.dialog.innerHTML = `<div>
      <div class="na-column NextAfterPopup__content">
        <div class="na-block">
          <section class="NextAfterPopup__header"></section>
        </div>
        <div class="na-block">
          <section class="NextAfterPopup__body na-column"></section>
        </div>
        <div class="na-block">
          <section class="NextAfterPopup__actions na-row na-gap-1"></section>
        </div>
        <div class="na-block">
          <section class="NextAfterPopup__footer"></section>
        </div>
      </div>
    </div>`;

    this.blocks = {};
    this.blocks['heading'] = this.dialog.querySelector('.NextAfterPopup__header') && this.content['headingHTML'] && this.content['headingHTML'].trim().length !== 0 ? // If the heading element exists and the content is not empty
                    (
                      (this.dialog.querySelector('.NextAfterPopup__header').innerHTML = this.content['headingHTML']), this.dialog.querySelector('.NextAfterPopup__header')
                    ) : null;
    this.blocks['body'] = this.dialog.querySelector('.NextAfterPopup__body') && this.content['bodyHTML'] && this.content['bodyHTML'].trim().length !== 0 ? // If the body element exists and the content is not empty
                    (
                      (this.dialog.querySelector('.NextAfterPopup__body').innerHTML = this.content['bodyHTML']), this.dialog.querySelector('.NextAfterPopup__body')
                    ) : null;
    this.blocks['footer'] = this.dialog.querySelector('.NextAfterPopup__footer') && this.content['footerHTML'] && this.content['footerHTML'].trim().length !== 0 ? 
                    (
                      (this.dialog.querySelector('.NextAfterPopup__footer').innerHTML = this.content['footerHTML']), this.dialog.querySelector('.NextAfterPopup__footer')
                    ) : null;
    this.blocks['actions'] = this.dialog.querySelector('.NextAfterPopup__actions') && this.actions && this.actions.length > 0 ? 
                    (
                      (this.actions.forEach(({ type, textHTML, action = null, href = "javascript:void(0)" }, i) => {
                        const a = document.createElement('a'),
                              button = document.createElement('button');
                        button.classList.add("NextAfterPopup__action-button");
                        button.innerHTML = textHTML;
                        button.tabIndex = 0;
                        a.href = href;
                        if (typeof action === 'function') {
                          button.addEventListener('click', (function handlePopupActionButtonClick (event) {
                            action.call(this, event, this.dialog);
                          }).bind(this));
                        }
                        a.appendChild(button);
                        this.dialog.querySelector('.NextAfterPopup__actions').appendChild(a);
                      })),
                      this.dialog.querySelector('.NextAfterPopup__actions') // return the actions element
                    ) :
                    null;
    this.buttons = Array.from(this.blocks['actions'].children);

    const sheet = new CSSStyleSheet(),
          designConfig = this.config.design;
    sheet.replaceSync(`
      .NextAfterPopup {
        --popup-maxWidth: ${designConfig.width || 640}px;
        --popup-backdrop: ${designConfig.popupBackdrop};
        --popup-fgColor: ${designConfig.popupForegroundColor};
        --popup-bgColor: ${designConfig.popupBackgroundColor};
        --popup-border: ${designConfig.popupBorder};
        --popup-border-alt: ${designConfig.popupBorderAlternate};
        --popup-cornerRadius: ${designConfig.popupBorderRadius};
        --popup-button-fgColor: ${designConfig.popupButtonForegroundColor};
        --popup-button-bgColor: ${designConfig.popupButtonBackgroundColor};
        --popup-button-border: ${designConfig.popupButtonBorder};
        --popup-button-cornerRadius: calc(${designConfig.popupBorderRadius} / 2);
        --popup-button-fgColor2: ${designConfig.popupButtonForegroundColor2};
        --popup-button-bgColor2: ${designConfig.popupButtonBackgroundColor2};
        --popup-button-border2: ${designConfig.popupButtonBorder2};
      }
    `);
    if (designConfig.popupBorderAlternate !== 'none') // only if the alternate border is set
      sheet.replaceSync(`
      .NextAfterPopup > div {
        padding: 1rem;
        border: var(--popup-border-alt);
      }
    `);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];    
    this.dialog.insertAdjacentElement('beforeend', Popup.createCloseButton.call(this, this.dialog));
    !this.dialog.isConnected && document.body.appendChild(this.dialog); // append the <dialog> to the body if not already connected to DOM
    if (this.config.open === true) {
      this.dialog.showModal();
    } else if (this.config.openAfterSeconds && !Number.isNaN(parseInt(this.config.openAfterSeconds))) {
      const seconds = parseInt(this.config.openAfterSeconds);
      setTimeout(() => {
        this.dialog.showModal();
      }, seconds * 1000)
    }
    console.log(this);
    return this;
  }
  isOpen () {
    return this.dialog.open ? true : false;
  }
  show () {
    this.dialog.showModal();
  }
  hide () {
    this.dialog.close();
  }
}



export default Popup;
