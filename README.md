# 1D Spreadsheet

[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A514-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Code Size](https://img.shields.io/badge/code%20size-%3C1%20KB-blue)](./solution.js)

A dependency-resolving **1-dimensional spreadsheet** evaluator written in
JavaScript — no dependencies, ~35 lines.

---

## Overview

Each cell of a 1-D spreadsheet holds an operation with two operands:

```
<OPERATION> <arg1> <arg2>
```

An operand is either a **literal integer** (`-10000 … 10000`), a **reference** to
another cell (`$n`, 0-indexed), or `_` (unused / treated as `0`).

Cells may reference cells that appear **after** them, so the evaluation order is not
the file order. The program resolves the whole dependency graph and prints the value
of every cell, one per line.

The input guarantees there are **no cycles**, which is what makes a recursive
resolver safe.

---

## Approach — memoized depth-first resolution

The evaluator is a lazy recursive solver with a cache:

```js
function solveCell(i) {
    if (cache[i] !== undefined) return cache[i];
    // resolve operands (which may recursively solve other cells)
    cache[i] = res;
    return res;
}
```

Key properties:

- **Demand-driven** — a cell is only computed when something asks for it, so
  unreachable work is never done.
- **Memoized** — `cache[i]` is filled the first time a cell is solved; every later
  reference is an `O(1)` lookup. A diamond-shaped dependency graph
  (`A → B, A → C, B → D, C → D`) therefore evaluates `D` exactly once instead of
  once per path.
- **Cycle-safe by contract** — the statement forbids cycles, so the recursion depth
  is bounded by `N ≤ 100`; no visited-set or iterative topological sort is needed.
- **Forward references come for free** — because resolution is recursive rather than
  a left-to-right scan, `$5` inside cell `0` simply triggers `solveCell(5)`.

### Operand parsing

```js
function parseArg(arg) {
    if (arg === '_') return 0;
    if (arg[0] === '$') return solveCell(parseInt(arg.slice(1)));
    return parseInt(arg);
}
```

The leading `$` is the only marker of a reference, so a single `arg[0]` test
distinguishes a cell from a literal.

### `-0` normalization

```js
if (Object.is(res, -0)) res = 0;
```

JavaScript can produce a negative zero (e.g. `0 * -1`). It prints as `0` in most
contexts but can leak as `-0` through `String()`/`console.log` edge cases; the guard
normalizes it so output is always a plain `0`.

### Complexity

| | |
|---|---|
| Time | `O(N)` — each cell is solved once |
| Space | `O(N)` for the cache, `O(N)` recursion depth worst case |

---

## Operation Set

| Operation | Semantics |
|:---------:|-----------|
| `VALUE arg1 _` | The cell's value is `arg1`; `arg2` is always `_`. |
| `ADD arg1 arg2` | `arg1 + arg2` |
| `SUB arg1 arg2` | `arg1 - arg2` |
| `MULT arg1 arg2` | `arg1 × arg2` |

| Operand form | Meaning |
|:------------:|---------|
| `-?[0-9]+` | Literal integer value. |
| `$n` | Value of cell `n` (0-indexed). May point forward. |
| `_` | Unused operand, treated as `0`. |

---

## Execution

Requires **Node.js 14+**. No install step.

### Run from a file

```bash
node solution.js < program.txt
```

### Run from stdin

```bash
node solution.js <<'EOF'
2
VALUE 3 _
ADD $0 4
EOF
```

Output:

```
3
7
```

### Run the test-suite

```bash
./run_tests.sh
```

10 cases: the sample, forward references, negative arithmetic, `_` operands,
single cell, `-0`, integer bounds, and a 100-cell dependency chain.

### Debug helper

`runner.js` recreates CodinGame's `readline()` environment locally:

```bash
node runner.js solution.js < tests/01_example.txt
```

---

## Author

**Abdelhakim Baalla**

- GitHub: [https://github.com/Abdelhakim-Baalla](https://github.com/Abdelhakim-Baalla)

## License

Released under the [MIT License](./LICENSE).
