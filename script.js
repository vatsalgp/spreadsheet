$(document).ready(() => {
    addColNames(COLS);
    addRowNames(ROWS);
    addCells(ROWS, COLS);
    loadSheetBarAndFirstSheet();
});

const getSelectedSheet = () => $(".sheet-tab.selected").attr("id");
const getNumberOfSheets = () => Object.keys(DATA).length;

const loadSheetBarAndFirstSheet = () => {
    if (getNumberOfSheets() == 0)
        $(".icon-add").click();
    else {
        for (const sheetName in DATA)
            addSheetToBar(sheetName);
        $(".sheet-tab").first().addClass("selected");
        loadSelectedSheet();
    }
};

const addSheetToBar = sheetName => {
    const sheet = $(`<div class="sheet-tab" id="${sheetName}">${sheetName}</div>`);
    sheet.appendTo($(".sheet-tab-container"));
    sheet.click(e => {
        if (!$(e.currentTarget).hasClass("selected")) {
            $(".sheet-tab.selected").removeClass("selected");
            $(e.currentTarget).addClass("selected");
            emptySheet();
            loadSelectedSheet();
        }
    });
    sheet.contextmenu(e => {
        e.preventDefault();
        sheet.click();
        const modal = $(".sheet-options-modal");
        modal.css("left", e.pageX);
        modal.css("display", "block");
        $(".sheet-rename").click(() => {
            $(".sheet-rename-modal").css("display", "block");
            $(".new-sheet-name").focus();
            $(".error-message").css("display", "none");
        });
        $(".sheet-delete").click(() => {
            $(".sheet-delete-modal").css("display", "block");
            $(".selected-sheet-name").text(getSelectedSheet());
        });
    });
    return sheet;
};

const emptySheet = () => $(".input-cell").each((i, e) => {
    for (const [property, value] of Object.entries(DEF_CELL_DATA))
        $(e).css(property, value);
    $(e).text("");
});

const loadSelectedSheet = () => {
    const sheet = DATA[getSelectedSheet()];
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
    const sheet = DATA[getSelectedSheet()];
    if (!sheet[rowId]) {
        if (defaultable)
            return;
        sheet[rowId] = {};
    }
    if (!sheet[rowId][colId]) {
        if (defaultable)
            return;
        sheet[rowId][colId] = {};
    }
    sheet[rowId][colId][property] = value;
    if (!defaultable)
        return;
    delete sheet[rowId][colId][property];
    if (shallowEqualObject({ ...DEF_CELL_DATA, ...sheet[rowId][colId] }, DEF_CELL_DATA)) {
        delete sheet[rowId][colId];
        if (shallowEqualObject(sheet[rowId], {}))
            delete sheet[rowId];
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
    const sheet = DATA[getSelectedSheet()];
    if (sheet[rowId] && sheet[rowId][colId]) {
        const cellData = sheet[rowId][colId];

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