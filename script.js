//Constants
const rows = 20;
const cols = 20

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
        const cellRow = $(`<div class="cell-row" id="rowId-${i}"></div>`);
        for (let j = 1; j <= cols; j++)
            $(`<div class="input-cell" id="colId-${j}"></div>`).appendTo(cellRow);
        cellRow.appendTo(inputCellContainer);
    }
}

const addEventListeners = () => {
    $(".align-icon").click(event => {
        $(".align-icon.selected").removeClass("selected");
        $(event.currentTarget).addClass("selected");
    });

    $(".style-icon").click(event => {
        $(event.currentTarget).toggleClass("selected");
    });

    $(".input-cell").click(event => {
        $(".input-cell.selected").removeClass("selected");
        $(event.currentTarget).addClass("selected");
    });
}