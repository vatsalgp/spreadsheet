//Constants
const rows = 100;
const cols = 50;

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
    const row = $(e.currentTarget).parent().attr("class").split(" ").filter(str => str.includes("rowId-"))[0].split("-")[1];
    const col = $(e.currentTarget).attr("class").split(" ").filter(str => str.includes("colId-"))[0].split("-")[1];
    return [parseInt(row), parseInt(col)];
}

const addEventListeners = () => {
    $(".icon-bold").click(e => {
        const selected = $(e.currentTarget).hasClass("selected");
        $(".input-cell.selected").css("font-weight", selected ? "" : "bold");
    });

    $(".icon-italic").click(e => {
        const selected = $(e.currentTarget).hasClass("selected");
        $(".input-cell.selected").css("font-style", selected ? "" : "italic");
    });

    $(".icon-underline").click(e => {
        const selected = $(e.currentTarget).hasClass("selected");
        $(".input-cell.selected").css("text-decoration", selected ? "" : "underline");
    });

    $(".align-icon").click(e => {
        $(".align-icon.selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
    });

    $(".style-icon").click(e => {
        $(e.currentTarget).toggleClass("selected");
    });

    $(".input-cell").click(e => {
        if (e.ctrlKey) {
            const [rowId, colId] = getRowCol(e);
            const topCellSelected = rowId > 1 && $(`.rowId-${rowId - 1} .colId-${colId}`).hasClass("selected");
            if (topCellSelected) {
                $(e.currentTarget).addClass("top-cell-selected");
                $(`.rowId-${rowId - 1} .colId-${colId}`).addClass("bottom-cell-selected");
            }
            const bottomCellSelected = rowId < rows && $(`.rowId-${rowId + 1} .colId-${colId}`).hasClass("selected")
            if (bottomCellSelected) {
                $(e.currentTarget).addClass("bottom-cell-selected");
                $(`.rowId-${rowId + 1} .colId-${colId}`).addClass("top-cell-selected");
            }
            const leftCellSelected = colId > 1 && $(`.rowId-${rowId} .colId-${colId - 1}`).hasClass("selected");
            if (leftCellSelected) {
                $(e.currentTarget).addClass("left-cell-selected");
                $(`.rowId-${rowId} .colId-${colId - 1}`).addClass("right-cell-selected");
            }
            const rightCellSelected = rowId < cols && $(`.rowId-${rowId} .colId-${colId + 1}`).hasClass("selected")
            if (rightCellSelected) {
                $(e.currentTarget).addClass("right-cell-selected");
                $(`.rowId-${rowId} .colId-${colId + 1}`).addClass("left-cell-selected");
            }
        } else {
            $(".input-cell.selected").removeClass("selected");
            $(".input-cell.top-cell-selected").removeClass("top-cell-selected");
            $(".input-cell.bottom-cell-selected").removeClass("bottom-cell-selected");
            $(".input-cell.left-cell-selected").removeClass("left-cell-selected");
            $(".input-cell.right-cell-selected").removeClass("right-cell-selected");
        }
        $(`.input-cell[contenteditable="true"]`).removeAttr("contenteditable");
        $(e.currentTarget).addClass("selected");
    });

    $(".input-cell").dblclick(e => {
        $(".input-cell.selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        $(`.input-cell[contenteditable="true"]`).removeAttr("contenteditable");
        $(e.currentTarget).attr("contenteditable", "true");
        $(e.currentTarget).focus();
    });

    $(".input-cell-container").scroll(e => {
        $(".column-name-container").scrollLeft(e.currentTarget.scrollLeft);
        $(".row-name-container").scrollTop(e.currentTarget.scrollTop);
    });
}