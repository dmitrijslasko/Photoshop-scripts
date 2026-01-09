#target photoshop

function main() {

    // PNG options (PNG-24). Photoshop сам сохранит прозрачность.
    var pngOptions = new PNGSaveOptions();
    pngOptions.interlaced = false;

    if (!app.documents.length) {
        alert("Please open a document first.");
        return;
    }

    var originalDoc = app.activeDocument;

    // Save original unit settings
    var originalRulerUnits = app.preferences.rulerUnits;
    // Set to pixels for the whole operation
    app.preferences.rulerUnits = Units.PIXELS;

    // UI
    var dlg = new Window('dialog', 'Nastiani Image Splitter');
    dlg.alignChildren = ['fill', 'top'];

    dlg.add('statictext', undefined, 'Enter number of Rows and Columns:');

    var rowGroup = dlg.add('group');
    rowGroup.add('statictext', undefined, 'Rows:');
    var rowInput = rowGroup.add('edittext', undefined, '2');
    rowInput.characters = 5;

    var colGroup = dlg.add('group');
    colGroup.add('statictext', undefined, 'Columns:');
    var colInput = colGroup.add('edittext', undefined, '2');
    colInput.characters = 5;

    var btnGroup = dlg.add('group');
    btnGroup.alignment = 'center';
    var okBtn = btnGroup.add('button', undefined, 'OK');
    var cancelBtn = btnGroup.add('button', undefined, 'Cancel');

    cancelBtn.onClick = function () {
        dlg.close();
    }

    okBtn.onClick = function () {
        dlg.close(1);
    }

    if (dlg.show() !== 1) {
        // Restore units before exiting
        app.preferences.rulerUnits = originalRulerUnits;
        return;
    }

    var rows = parseInt(rowInput.text, 10);
    var cols = parseInt(colInput.text, 10);

    if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
        alert("Invalid input. Please enter positive integers.");
        app.preferences.rulerUnits = originalRulerUnits;
        return;
    }

    var tileWidth = originalDoc.width / cols;
    var tileHeight = originalDoc.height / rows;

    var baseName = originalDoc.name.replace(/\.[^\.]+$/, '');
    var exportFolder = new Folder(originalDoc.path + "/" + originalDoc.name + "_" + rows + "_" + cols);
    if (!exportFolder.exists) exportFolder.create();

    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {

            var x = c * tileWidth;
            var y = r * tileHeight;

            // Duplicate and crop
            app.activeDocument = originalDoc;

            var filename = baseName + "_R" + r + "_C" + c;
            var dup = originalDoc.duplicate(filename, false);

            app.activeDocument = dup;

            // Важно: не делаем flatten(), чтобы сохранить прозрачность
            dup.crop([
                UnitValue(x, 'px'),
                UnitValue(y, 'px'),
                UnitValue(x + tileWidth, 'px'),
                UnitValue(y + tileHeight, 'px')
            ]);

            // Save as PNG (transparency preserved)
            var filepath = new File(exportFolder + "/" + filename + ".png");
            dup.saveAs(filepath, pngOptions, true, Extension.LOWERCASE);

            // Close without saving changes to the PSD
            dup.close(SaveOptions.DONOTSAVECHANGES);
        }
    }

    // Restore original unit settings
    app.preferences.rulerUnits = originalRulerUnits;

    alert("Done! Split into " + rows + " rows and " + cols + " columns.\nSaved as transparent PNGs.");
}

main();
