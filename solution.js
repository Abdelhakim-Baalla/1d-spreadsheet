const N = parseInt(readline());
const cells = [];

for (let i = 0; i < N; i++) {
    const [op, arg1, arg2] = readline().split(' ');
    cells.push({ op, arg1, arg2 });
}

const cache = new Array(N);

function parseArg(arg) {
    if (arg === '_') return 0;
    if (arg[0] === '$') return solveCell(parseInt(arg.slice(1)));
    return parseInt(arg);
}

function solveCell(i) {
    if (cache[i] !== undefined) return cache[i];

    const { op, arg1, arg2 } = cells[i];
    const v1 = parseArg(arg1);
    const v2 = parseArg(arg2);

    let res;
    switch (op) {
        case 'VALUE': res = v1; break;
        case 'ADD':   res = v1 + v2; break;
        case 'SUB':   res = v1 - v2; break;
        case 'MULT':  res = v1 * v2; break;
    }

    if (Object.is(res, -0)) res = 0;
    cache[i] = res;
    return res;
}

for (let i = 0; i < N; i++) {
    console.log(solveCell(i));
}
