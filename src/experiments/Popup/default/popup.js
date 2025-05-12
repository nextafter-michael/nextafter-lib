import Popup from '../../../classes/Popup.js';

const EXPERIMENT_VARIABLES = [
    {
        name: 'Popup Heading HTML', // {{Popup Heading HTML}}
        mapsTo: 'content.headingHTML',
        type: 'text:long',
        unit: null,
        value: '<h3>This is the heading HTML</h3>',
    },
    {
        name: 'Popup Body HTML',
        mapsTo: 'content.bodyHTML',
        type: 'text:long',
        unit: null,
        value: `<p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>`,
    },
    {
        name: 'Popup Footer HTML',
        mapsTo: 'content.footerHTML',
        type: 'text:long',
        unit: null,
        value: '<p>This is the footer HTML</p>',
    },
    {
        name: 'Popup Actions',
        type: 'group',
        items: [
            {
                group_index: 0,
                name: 'Popup Action 1',
                type: 'group',
                items: [
                    {
                        group_index: 0,
                        name: 'Popup Action 1 Text',
                        mapsTo: 'actions[0].textHTML',
                        type: 'text',
                        unit: null,
                        value: 'Yes, I agree!',
                    },
                    {
                        group_index: 1,
                        name: 'Popup Action 1 Action',
                        mapsTo: 'actions[0].href',
                        type: 'text:url',
                        unit: null,
                        value: 'https://donate.example.com/?src=popup',
                    },
                ]
            },
            {
                group_index: 1,
                name: 'Popup Action 2',
                type: 'group',
                items: [
                    {
                        group_index: 0,
                        name: 'Popup Action 2 Text',
                        mapsTo: 'actions[1].textHTML',
                        type: 'text',
                        unit: null,
                        value: 'No, I do not agree.',
                    },
                    {
                        group_index: 1,
                        name: 'Popup Action 2 Action',
                        mapsTo: 'actions[1].href',
                        type: 'text:url',
                        unit: null,
                        value: 'javascript:void(0)',
                    },
                ]
            }
        ],
    },
    {
        name: 'Popup Width',
        mapsTo: 'design.width',
        type: 'number',
        unit: 'px',
        value: 640,
    },
    {
        name: 'Popup Backdrop Color',
        mapsTo: 'design.popupBackdrop',
        type: 'text',
        unit: 'color',
        value: 'rgba(0 0 0 / 5%)',
    },
    {
        name: 'Popup Foreground Color',
        mapsTo: 'design.popupForegroundColor',
        type: 'text',
        unit: 'color',
        value: 'black',
    },
    {
        name: 'Popup Background Color',
        mapsTo: 'design.popupBackgroundColor',
        type: 'text',
        unit: 'color',
        value: 'white',
    },
    {
        name: 'Popup Border Color',
        mapsTo: 'design.popupBorder',
        type: 'text',
        unit: null,
        value: 'none',
    },
    {
        name: 'Popup Border Alternate Color',
        mapsTo: 'design.popupBorderAlternate',
        type: 'text',
        unit: null,
        value: 'none',
    },
    {
        name: 'Popup Border Radius',
        mapsTo: 'design.popupBorderRadius',
        type: 'number',
        unit: 'rem',
        value: 1,
    },
    {
        name: 'Popup Button Foreground Color (CTA)',
        mapsTo: 'design.popupButtonForegroundColor',
        type: 'text',
        unit: 'color',
        value: 'black', // used for the first CTA button in the popup
    },
    {
        name: 'Popup Button Background Color (CTA)',
        mapsTo: 'design.popupButtonBackgroundColor',
        type: 'text',
        unit: 'color',
        value: '#f5c635', // used for the first CTA button in the popup
    },
    {
        name: 'Popup Button Border (CTA)',
        mapsTo: 'design.popupButtonBorder',
        type: 'text',
        unit: 'color',
        value: 'none', // used for the first CTA button in the popup
    },
    {
        name: 'Popup Button Foreground Color (Other)',
        mapsTo: 'design.popupButtonForegroundColor2',
        type: 'text',
        unit: 'color',
        value: 'white', // used for the other CTA buttons in the popup
    },
    {
        name: 'Popup Button Background Color (Other)',
        mapsTo: 'design.popupButtonBackgroundColor2',
        type: 'text',
        unit: 'color',
        value: '#000000', // used for the other CTA buttons in the popup
    },
    {
        name: 'Popup Button Border (Other)',
        mapsTo: 'design.popupButtonBorder2',
        type: 'text',
        unit: null,
        value: '#000000', // used for the other CTA buttons in the popup
    }
];

export default function main (options) {
    return new Popup(null, options);
}

export function variables () {
    return EXPERIMENT_VARIABLES;
}

export function config () {
    return Popup.defaultOptions;
}
