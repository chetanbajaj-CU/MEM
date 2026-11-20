const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// The app generates HTML dynamically, so the selector refers to the DOM structure.
// Instead of finding it with jsdom (since we don't have the fully rendered HTML),
// I will just look at the code.

