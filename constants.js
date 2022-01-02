const ROWS = 100;
const COLS = 50;

const TEXT = "text";
const FONT_WEIGHT = "font-weight";
const FONT_STYLE = "font-style";
const TEXT_DECORATION = "text-decoration";
const TEXT_ALIGN = "text-align";
const BACKGROUND_COLOR = "background-color";
const COLOR = "color";
const FONT_FAMILY = "font-family";
const FONT_SIZE = "font-size";

const DEF_CELL_DATA = {
    [TEXT]: "",
    [FONT_WEIGHT]: "",
    [FONT_STYLE]: "",
    [TEXT_DECORATION]: "",
    [TEXT_ALIGN]: "left",
    [BACKGROUND_COLOR]: "#ffffff",
    [COLOR]: "#000000",
    [FONT_FAMILY]: "Noto Sans",
    [FONT_SIZE]: "14px"
};

const DATA = {
    "Sheet1": {
        1: {
            1: {
                "text": "Default Text",
                "font-size": "16px",
                "color": "#ffffff",
                "background-color": "#ff0000"
            }
        }
    },
    "Sheet2": {
        2: {
            2: {
                "text": "Default Text",
                "font-size": "16px",
                "color": "#ffffff",
                "background-color": "#00ff00"
            }
        }
    },
    "Sheet3": {
        3: {
            3: {
                "text": "Default Text",
                "font-size": "16px",
                "color": "#ffffff",
                "background-color": "#0000ff"
            }
        }
    }
};