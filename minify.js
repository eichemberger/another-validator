const Terser = require("terser");
const fs = require("fs");
const glob = require("glob");

// Find all the .js files in the dist folder
const files = glob.sync("dist/**/*.js");

// Minify each file
files.forEach((file) => {
    fs.readFile(file, "utf8", (err, code) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        Terser.minify(code)
            .then((result) => {
                fs.writeFile(file, result.code, (err) => {
                    if (err) {
                        console.error("Error writing file:", err);
                    }
                });
            })
            .catch((err) => {
                console.error("Error minifying file:", err);
            });
    });
});