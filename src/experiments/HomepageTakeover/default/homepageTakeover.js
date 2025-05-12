import HomepageTakeover from '../../../classes/HomepageTakeover.js';

const EXPERIMENT_VARIABLES = [
    {
        name: "Homepage URL",
        mapsTo: "homepageUrl",
        type: "text:url",
        unit: null,
        value: "https://nextafter.com/",
    },
    {
        name: "Destination URL",
        mapsTo: "destinationUrl",
        type: "text:url",
        unit: null,
        value: "https://nextafter.com/",
    },
    {
        name: "src Param Value",
        mapsTo: "srcParamValue",
        type: "text",
        unit: null,
        value: "redirect",
    },
    {
        name: "Redirect Cooldown Days",
        mapsTo: "redirectCooldownDays",
        type: "number",
        unit: null,
        value: 7,
    },
    {
        name: "Cookie Name",
        mapsTo: "cookieName",
        type: "text",
        unit: null,
        value: "homepageTakeoverRedirected",
    },
    {
        name: "Button Text",
        mapsTo: "buttonText",
        type: "text",
        unit: null,
        value: "Go Back",
    },
    {
        name: "Button Design",
        mapsTo: "buttonDesign",
        type: "group",
        items: [
            {
                group_index: 0,
                name: "Button Position Top",
                mapsTo: "design.top",
                type: "text",
                unit: "px",
                value: 16,
            },
            {
                group_index: 1,
                name: "Button Position Left",
                mapsTo: "design.left",
                type: "text",
                unit: "px",
                value: 16,
            },
            {
                group_index: 2,
                name: "Button Background Color",
                mapsTo: "design.backgroundColor",
                type: "text:color",
                unit: null,
                value: "#000000",
            },
            {
                group_index: 3,
                name: "Button Text Color",
                mapsTo: "design.color",
                type: "text:color",
                unit: null,
                value: "#FFFFFF",
            },
            {
                group_index: 4,
                name: "Button Border Radius",
                mapsTo: "design.borderRadius",
                type: "number",
                unit: "px",
                value: 4,
            },
            {
                group_index: 5,
                name: "Button Padding",
                mapsTo: "design.padding",
                type: "text",
                unit: null,
                value: "8px 16px",
            },
        ],
    }
];

export default function main (options) {
    return new HomepageTakeover(options);
}

export function variables () {
    return EXPERIMENT_VARIABLES;
}

export function config () {
    return HomepageTakeover.defaultOptions;
}
