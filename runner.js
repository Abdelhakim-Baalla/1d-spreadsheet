// Local runner that mimics CodinGame's readline() environment.
// usage: node runner.js solution.js < program.txt
const fs = require('fs');
const code = fs.readFileSync(process.argv[2], 'utf8');
const lines = fs.readFileSync(0, 'utf8').split('\n');
let pos = 0;
global.readline = () => (pos < lines.length ? lines[pos++] : null);
eval(code);
