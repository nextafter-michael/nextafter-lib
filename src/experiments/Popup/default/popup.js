import Popup from '/src/classes/Popup.js';

export default function main (options) {
    return new Popup(null, options);
}

const defaultOptionsExample = {
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
      popupButtonBorder: 'none', // used for the first CTA button in the popup
    },
    open: false,
};

export function variables (configurationObject = Popup.defaultOptions) {
    let vars = Object.fromEntries(Object.entries(configurationObject).map(([key, value]) => {
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return [key, value.map((item) => {
                    if (typeof item === 'object') {
                        return Object.entries(item).reduce((acc, [k, v]) => {
                            acc[k] = v;
                            return acc;
                        }, {});
                    } else {
                        return item;
                    }
                })];
            } else {
                Object.entries(value).forEach(([k, v]) => {
                    if (typeof v === 'object') {
                        value[k] = Object.entries(v).reduce((acc, [k2, v2]) => {
                            acc[k2] = v2;
                            return acc;
                        }, {});
                    }
                });
                return [key, Object.entries(value).reduce((acc, [k, v]) => {
                    acc[k] = v;
                    return acc;
                }, {})];
            }
        } else if (typeof value === 'function') {
            return [key, value.toString()];
        } else {
            return [key, value];
        }
    }));
    vars = Object.entries(vars).reduce((acc, [key, value]) => {
        acc[`popup_${key}`] = value;
        return acc;
    }, {});

    return vars;
}