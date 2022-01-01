//Constants
const rows = 100;
const cols = 50;
const defCellData = {
    "text": "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "white",
    "color": "black",
    "font-family": "Noto Sans",
    "font-size": "14px"
};

let selectedSheet = "Sheet1";
let totalSheets = 1;
let data = {
    "Sheet1": {}
};

$(document).ready(() => {
    addColNames(cols);
    addRowNames(rows);
    addCells(rows, cols);
    addEventListeners();
});

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

const updateSelectedCell = (property, value, defaultable) => {
    $(".input-cell.selected").each((i, e) => {
        $(e).css(property, value);
        const [rowId, colId] = getRowCol(e);
        if (!data[selectedSheet][rowId]) {
            if (defaultable)
                return;
            data[selectedSheet][rowId] = {};
        }
        if (!data[selectedSheet][rowId][colId]) {
            if (defaultable)
                return;
            data[selectedSheet][rowId][colId] = {};
        }
        data[selectedSheet][rowId][colId][property] = value;
        if (!defaultable)
            return;
        delete data[selectedSheet][rowId][colId][property];
        if (shallowEqualObject({ ...defCellData, ...data[selectedSheet][rowId][colId] }, defCellData)) {
            delete data[selectedSheet][rowId][colId];
            if (shallowEqualObject(data[selectedSheet][rowId], {}))
                delete data[selectedSheet][rowId];
        }
    });
};

const onInputCellControlClick = e => {
    const [rowId, colId] = getRowCol(e.currentTarget);
    if (rowId > 1 && $(`.rowId-${rowId - 1} .colId-${colId}`).hasClass("selected")) {
        $(e.currentTarget).addClass("top-cell-selected");
        $(`.rowId-${rowId - 1} .colId-${colId}`).addClass("bottom-cell-selected");
    }
    if (rowId < rows && $(`.rowId-${rowId + 1} .colId-${colId}`).hasClass("selected")) {
        $(e.currentTarget).addClass("bottom-cell-selected");
        $(`.rowId-${rowId + 1} .colId-${colId}`).addClass("top-cell-selected");
    }
    if (colId > 1 && $(`.rowId-${rowId} .colId-${colId - 1}`).hasClass("selected")) {
        $(e.currentTarget).addClass("left-cell-selected");
        $(`.rowId-${rowId} .colId-${colId - 1}`).addClass("right-cell-selected");
    }
    if (rowId < cols && $(`.rowId-${rowId} .colId-${colId + 1}`).hasClass("selected")) {
        $(e.currentTarget).addClass("right-cell-selected");
        $(`.rowId-${rowId} .colId-${colId + 1}`).addClass("left-cell-selected");
    }
}

const changeHeader = e => {
    const [rowId, colId] = getRowCol(e);
    if (data[selectedSheet][rowId] && data[selectedSheet][rowId][colId]) {
        const cellData = data[selectedSheet][rowId][colId];

        if (cellData.hasOwnProperty("font-family"))
            $(".font-family-selector").val(cellData["font-family"]);
        else
            $(".font-family-selector").val("Noto Sans");

        if (cellData.hasOwnProperty("font-size"))
            $(".font-size-selector").val(cellData["font-size"]);
        else
            $(".font-size-selector").val("14px");

        if (cellData.hasOwnProperty("font-weight"))
            $(".icon-bold").addClass("selected");
        else
            $(".icon-bold").removeClass("selected");

        if (cellData.hasOwnProperty("font-style"))
            $(".icon-italic").addClass("selected");
        else
            $(".icon-italic").removeClass("selected");

        if (cellData.hasOwnProperty("text-decoration"))
            $(".icon-underline").addClass("selected");
        else
            $(".icon-underline").removeClass("selected");

        $(".align-icon.selected").removeClass("selected");
        if (cellData.hasOwnProperty("text-align"))
            $(`.icon-align-${cellData["text-align"]}`).addClass("selected");
        else
            $(".icon-align-left").addClass("selected");

    } else {
        $(".style-icon.selected").removeClass("selected");
        $(".align-icon.selected").removeClass("selected");
        $(".icon-align-left").addClass("selected");
        $(".font-family-selector").val("Noto Sans");
        $(".font-size-selector").val("14px");
    }
}

const addEventListeners = () => {
    $(".font-family-selector").change(e => {
        const family = $(e.currentTarget).val();
        updateSelectedCell("font-family", family, family === "Noto Sans");
    });

    $(".font-size-selector").change(e => {
        const size = $(e.currentTarget).val();
        updateSelectedCell("font-size", size, size === "14px");
    });

    $(".icon-bold").click(e => {
        if ($(e.currentTarget).hasClass("selected"))
            updateSelectedCell("font-weight", "", true);
        else
            updateSelectedCell("font-weight", "bold", false);
    });

    $(".icon-italic").click(e => {
        if ($(e.currentTarget).hasClass("selected"))
            updateSelectedCell("font-style", "", true);
        else
            updateSelectedCell("font-style", "italic", false);
    });

    $(".icon-underline").click(e => {
        if ($(e.currentTarget).hasClass("selected"))
            updateSelectedCell("text-decoration", "", true);
        else
            updateSelectedCell("text-decoration", "underline", false);
    });

    $(".style-icon").click(e => {
        $(e.currentTarget).toggleClass("selected");
    });

    $(".icon-align-left").click(e => {
        if (!$(e.currentTarget).hasClass("selected"))
            updateSelectedCell("text-align", "left", true);
    });

    $(".icon-align-center").click(e => {
        if (!$(e.currentTarget).hasClass("selected"))
            updateSelectedCell("text-align", "center", false);
    });

    $(".icon-align-right").click(e => {
        if (!$(e.currentTarget).hasClass("selected"))
            updateSelectedCell("text-align", "right", false);
    });

    $(".align-icon").click(e => {
        $(".align-icon.selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
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
        changeHeader(e.currentTarget);
    });

    $(".input-cell").dblclick(e => {
        $(".input-cell.selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        $(`.input-cell[contenteditable="true"]`).removeAttr("contenteditable");
        $(e.currentTarget).attr("contenteditable", "true");
        $(e.currentTarget).focus();
    });

    $(".input-cell.selected").change(e => {
        console.log($(e.currentTarget).val);
    })

    $(".input-cell-container").scroll(e => {
        $(".column-name-container").scrollLeft(e.currentTarget.scrollLeft);
        $(".row-name-container").scrollTop(e.currentTarget.scrollTop);
    });
}