// Generate random string
function getRandomName(length) {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var name = "";
    for (var i = 0; i < length; i++) {
        name += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return name;
}

// Set save location (Desktop)
var saveFolder = Folder.desktop;

// Check if there are open documents
if (app.documents.length > 0) {
    var originalDoc = app.activeDocument; // Remember the original active document

    for (var i = 0; i < app.documents.length; i++) {
        var doc = app.documents[i];

        // Duplicate and flatten to preserve original
        var dupDoc = doc.duplicate();
        dupDoc.flatten();

        // Generate random filename
        var randomName = getRandomName(10);
        var saveFile = new File(saveFolder + "/" + randomName + ".jpg");

        // Set JPG save options
        var jpgOptions = new JPEGSaveOptions();
        jpgOptions.quality = 12;
        jpgOptions.formatOptions = FormatOptions.STANDARDBASELINE;
        jpgOptions.embedColorProfile = true;

        // Save the duplicated doc
        dupDoc.saveAs(saveFile, jpgOptions, true, Extension.LOWERCASE);

        // Close the duplicated doc without saving
        dupDoc.close(SaveOptions.DONOTSAVECHANGES);
    }

    // alert("All open documents saved as JPGs with random names on Desktop.");
} else {
    alert("No documents are open!");
}
