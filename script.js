//Constants
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
    }
};

let selectedSheet = "Sheet1";
let totalSheets = 1;

$(document).ready(() => {
    addColNames(COLS);
    addRowNames(ROWS);
    addCells(ROWS, COLS);
    addEventListeners();
    loadSelectedSheet();
});

const emptySheet = () => $(".input-cell").each((i, e) => {
    for (const [property, value] of Object.entries(DEF_CELL_DATA))
        $(e).css(property, value);
    $(e).text("");
});

const loadSelectedSheet = () => {
    const sheet = DATA[selectedSheet];
    for (const rowId in sheet) {
        for (const colId in sheet[rowId]) {
            const cellData = sheet[rowId][colId];
            const cell = $(`.rowId-${rowId} .colId-${colId}`);
            for (const [property, value] of Object.entries(cellData))
                cell.css(property, value);
            if (cellData.hasOwnProperty(TEXT))
                cell.text(cellData[TEXT]);
        }
    }
};

const createSheet = () => {
    totalSheets++;
    selectedSheet = "Sheet" + totalSheets;
    DATA[selectedSheet] = {};
    const sheet = $(`<div class="sheet-tab" id="${selectedSheet}">${selectedSheet}</div>`);
    sheet.appendTo($(".sheet-tab-container"));
    sheet.click(onClickOnSheet);
}

const showSelectedSheet = () => {
    $(".sheet-tab.selected").removeClass("selected");
    $(`#${selectedSheet}`).addClass("selected");
    emptySheet();
    loadSelectedSheet();
};

const calcColCode = id => {
    let str = "";
    while (id > 0) {
        let rem = id % 26;
        if (rem == 0) {
            str = 'Z' + str;
            id = Math.floor(id / 26) - 1;
        } else {
            str = String.fromCharCode(rem + 64) + str;
            id = Math.floor(id / 26);
        }
    }
    return str;
}

const addColNames = cols => {
    const columnNameContainer = $(".column-name-container");
    for (let i = 1; i <= cols; i++)
        $(`<div class="column-name" id="colId-${i}">${calcColCode(i)}</div>`).appendTo(columnNameContainer);
}

const addRowNames = rows => {
    const rowNameContainer = $(".row-name-container");
    for (let i = 1; i <= rows; i++)
        $(`<div class="row-name" id="rowId-${i}">${i}</div>`).appendTo(rowNameContainer);
}

const addCells = (rows, cols) => {
    const inputCellContainer = $(".input-cell-container");
    for (let i = 1; i <= rows; i++) {
        const cellRow = $(`<div class="cell-row rowId-${i}"></div>`);
        for (let j = 1; j <= cols; j++)
            $(`<div class="input-cell colId-${j}"></div>`).appendTo(cellRow);
        cellRow.appendTo(inputCellContainer);
    }
}

const getRowCol = e => {
    const get = (o, s) => parseInt(o.attr("class").split(" ").filter(st => st.includes(s))[0].split("-")[1]);
    const rowId = get($(e).parent(), "rowId-");
    const colId = get($(e), "colId-");
    return [rowId, colId];
}

const shallowEqualObject = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length)
        return false;
    for (let key of keys1)
        if (object1[key] !== object2[key])
            return false;
    return true;
}

const updateSelectedCell = (property, value, defaultable) => $(".input-cell.selected").each((i, e) => {
    $(e).css(property, value);
    const [rowId, colId] = getRowCol(e);
    if (!DATA[selectedSheet][rowId]) {
        if (defaultable)
            return;
        DATA[selectedSheet][rowId] = {};
    }
    if (!DATA[selectedSheet][rowId][colId]) {
        if (defaultable)
            return;
        DATA[selectedSheet][rowId][colId] = {};
    }
    DATA[selectedSheet][rowId][colId][property] = value;
    if (!defaultable)
        return;
    delete DATA[selectedSheet][rowId][colId][property];
    if (shallowEqualObject({ ...DEF_CELL_DATA, ...DATA[selectedSheet][rowId][colId] }, DEF_CELL_DATA)) {
        delete DATA[selectedSheet][rowId][colId];
        if (shallowEqualObject(DATA[selectedSheet][rowId], {}))
            delete DATA[selectedSheet][rowId];
    }
});

const onInputCellControlClick = e => {
    const [rowId, colId] = getRowCol(e.currentTarget);
    if (rowId > 1 && $(`.rowId-${rowId - 1} .colId-${colId}`).hasClass("selected")) {
        $(e.currentTarget).addClass("top-cell-selected");
        $(`.rowId-${rowId - 1} .colId-${colId}`).addClass("bottom-cell-selected");
    }
    if (rowId < ROWS && $(`.rowId-${rowId + 1} .colId-${colId}`).hasClass("selected")) {
        $(e.currentTarget).addClass("bottom-cell-selected");
        $(`.rowId-${rowId + 1} .colId-${colId}`).addClass("top-cell-selected");
    }
    if (colId > 1 && $(`.rowId-${rowId} .colId-${colId - 1}`).hasClass("selected")) {
        $(e.currentTarget).addClass("left-cell-selected");
        $(`.rowId-${rowId} .colId-${colId - 1}`).addClass("right-cell-selected");
    }
    if (rowId < COLS && $(`.rowId-${rowId} .colId-${colId + 1}`).hasClass("selected")) {
        $(e.currentTarget).addClass("right-cell-selected");
        $(`.rowId-${rowId} .colId-${colId + 1}`).addClass("left-cell-selected");
    }
}

const updateIconBar = e => {
    const [rowId, colId] = getRowCol(e);
    if (DATA[selectedSheet][rowId] && DATA[selectedSheet][rowId][colId]) {
        const cellData = DATA[selectedSheet][rowId][colId];

        if (cellData.hasOwnProperty(FONT_FAMILY))
            $(".font-family-selector").val(cellData[FONT_FAMILY]);
        else
            $(".font-family-selector").val(DEF_CELL_DATA[FONT_FAMILY]);

        if (cellData.hasOwnProperty(FONT_SIZE))
            $(".font-size-selector").val(cellData[FONT_SIZE]);
        else
            $(".font-size-selector").val(DEF_CELL_DATA[FONT_SIZE]);

        if (cellData.hasOwnProperty(FONT_WEIGHT))
            $(".icon-bold").addClass("selected");
        else
            $(".icon-bold").removeClass("selected");

        if (cellData.hasOwnProperty(FONT_STYLE))
            $(".icon-italic").addClass("selected");
        else
            $(".icon-italic").removeClass("selected");

        if (cellData.hasOwnProperty(TEXT_DECORATION))
            $(".icon-underline").addClass("selected");
        else
            $(".icon-underline").removeClass("selected");

        $(".align-icon.selected").removeClass("selected");
        if (cellData.hasOwnProperty(TEXT_ALIGN))
            $(`.icon-align-${cellData[TEXT_ALIGN]}`).addClass("selected");
        else
            $(`.icon-align-${DEF_CELL_DATA[TEXT_ALIGN]}`).addClass("selected");

        if (cellData.hasOwnProperty(BACKGROUND_COLOR))
            $(".background-color-picker").val(cellData[BACKGROUND_COLOR]);
        else
            $(".background-color-picker").val(DEF_CELL_DATA[BACKGROUND_COLOR]);

        if (cellData.hasOwnProperty(COLOR))
            $(".text-color-picker").val(cellData[COLOR]);
        else
            $(".text-color-picker").val(DEF_CELL_DATA[COLOR]);
    } else {
        $(".style-icon.selected").removeClass("selected");
        $(".align-icon.selected").removeClass("selected");
        $(`.icon-align-${DEF_CELL_DATA[TEXT_ALIGN]}`).addClass("selected");
        $(".font-family-selector").val(DEF_CELL_DATA[FONT_FAMILY]);
        $(".font-size-selector").val(DEF_CELL_DATA[FONT_SIZE]);
        $(".background-color-picker").val(DEF_CELL_DATA[BACKGROUND_COLOR]);
        $(".text-color-picker").val(DEF_CELL_DATA[COLOR]);
    }
}

const onClickOnSheet = e => {
    if (!$(e.currentTarget).hasClass("selected")) {
        selectedSheet = e.currentTarget.innerText;
        showSelectedSheet();
    }
}

const addEventListeners = () => {
    $(".font-family-selector").change(e => {
        const family = $(e.currentTarget).val();
        updateSelectedCell(FontFamily, family, family === DEF_CELL_DATA[FontFamily]);
    });

    $(".font-size-selector").change(e => {
        const size = $(e.currentTarget).val();
        updateSelectedCell(FONT_SIZE, size, size === DEF_CELL_DATA[FONT_SIZE]);
    });

    $(".icon-bold").click(e => {
        if ($(e.currentTarget).hasClass("selected"))
            updateSelectedCell(FONT_WEIGHT, "", true);
        else
            updateSelectedCell(FONT_WEIGHT, "bold", false);
    });

    $(".icon-italic").click(e => {
        if ($(e.currentTarget).hasClass("selected"))
            updateSelectedCell(FONT_STYLE, "", true);
        else
            updateSelectedCell(FONT_STYLE, "italic", false);
    });

    $(".icon-underline").click(e => {
        if ($(e.currentTarget).hasClass("selected"))
            updateSelectedCell(TEXT_DECORATION, "", true);
        else
            updateSelectedCell(TEXT_DECORATION, "underline", false);
    });

    $(".style-icon").click(e => {
        $(e.currentTarget).toggleClass("selected");
    });

    $(".icon-align-left").click(e => {
        if (!$(e.currentTarget).hasClass("selected"))
            updateSelectedCell(TEXT_ALIGN, "left", true);
    });

    $(".icon-align-center").click(e => {
        if (!$(e.currentTarget).hasClass("selected"))
            updateSelectedCell(TEXT_ALIGN, "center", false);
    });

    $(".icon-align-right").click(e => {
        if (!$(e.currentTarget).hasClass("selected"))
            updateSelectedCell(TEXT_ALIGN, "right", false);
    });

    $(".align-icon").click(e => {
        $(".align-icon.selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
    });

    $(".background-color-picker").change(e => {
        const color = e.currentTarget.value;
        updateSelectedCell(BACKGROUND_COLOR, color, color === DEF_CELL_DATA[BACKGROUND_COLOR]);
    });

    $(".text-color-picker").change(e => {
        const color = e.currentTarget.value;
        updateSelectedCell(COLOR, color, color === DEF_CELL_DATA[color]);
    });

    $(".icon-color-fill div").click(() => $(".background-color-picker").click());

    $(".icon-color-text div").click(() => $(".text-color-picker").click());

    $(".input-cell-container").scroll(e => {
        $(".column-name-container").scrollLeft(e.currentTarget.scrollLeft);
        $(".row-name-container").scrollTop(e.currentTarget.scrollTop);
    });

    $(".input-cell").click(e => {
        if (e.ctrlKey) {
            onInputCellControlClick(e);
        } else {
            $(".input-cell.selected").removeClass("selected");
            $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
            $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
            $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
            $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
        }
        $(`.input-cell[contenteditable="true"]`).removeAttr("contenteditable");
        $(e.currentTarget).addClass("selected");
        updateIconBar(e.currentTarget);
    });

    $(".input-cell").dblclick(e => {
        $(".input-cell.selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        $(`.input-cell[contenteditable="true"]`).removeAttr("contenteditable");
        $(e.currentTarget).attr("contenteditable", "true");
        $(e.currentTarget).focus();
    });

    $(".input-cell").blur(e => {
        const text = e.currentTarget.innerText;
        updateSelectedCell(TEXT, text, text === "");
    });

    $(".icon-add").click(e => {
        createSheet();
        showSelectedSheet();
    });

    $(".sheet-tab").click(onClickOnSheet);
}