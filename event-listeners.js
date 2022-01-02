const addEventListeners = () => {
    $(".container").click(e => {
        $(".sheet-options-modal").css("display", "none");
    });

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

    $(".icon-add").click(() => {
        let newSheetName;
        let number = getNumberOfSheets();
        do {
            number++;
            newSheetName = "Sheet" + number;
        } while (DATA.hasOwnProperty(newSheetName));
        DATA[newSheetName] = {};
        $(".sheet-tab.selected").removeClass("selected");
        addSheetToBar(newSheetName).addClass("selected");
        emptySheet();
    });

    $(".sheet-rename-modal .submit-button").click(() => {
        const newName = $(".new-sheet-name").val().trim();
        const oldName = getSelectedSheet();
        if (DATA.hasOwnProperty(newName) || newName === "") {
            $(".error-message").css("display", "block");
        } else {
            DATA[newName] = DATA[oldName];
            delete DATA[oldName];
            const sheet = $("#" + oldName);
            sheet.attr("id", newName);
            sheet.text(newName);
            $(".new-sheet-name").val("");
            $(".sheet-rename-modal").css("display", "none");
        }
    });

    $(".sheet-rename-modal .cancel-button").click(() => {
        $(".new-sheet-name").val("");
        $(".sheet-rename-modal").css("display", "none");
    });

    $(".sheet-delete-modal .submit-button").click(() => {
        const sheetName = getSelectedSheet();
        delete DATA[sheetName];
        $("#" + sheetName).remove();
        if (getNumberOfSheets() != 0)
            $("#" + Object.keys(DATA)[0]).click();
        else
            $(".icon-add").click();
        $(".sheet-delete-modal").css("display", "none");
    });

    $(".sheet-delete-modal .cancel-button").click(() => {
        $(".sheet-delete-modal").css("display", "none");
    });
};