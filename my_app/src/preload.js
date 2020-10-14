import text from "raw-loader!./test.md";
process.once('loaded', () => {
    global.marked = require("marked");
    global.md_text = text;
});