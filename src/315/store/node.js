const glob = require("glob");
const path = require('path')
function getEntries(globPath) {
    var files = glob.sync(globPath),
        entries = {};
    files.forEach(function (filepath) {
        console.log(filepath);
        var split = filepath.split('/');
        return split[-1]
    });

    return entries;

}

// console.log(path.resolve(__dirname, '../views/**/store.tsx'));
let arr = getEntries(path.resolve(__dirname,'../views/**/store.ts'))
console.log(arr)
