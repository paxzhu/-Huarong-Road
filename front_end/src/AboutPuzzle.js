function countInversions(puzzle) {
    const flatten = puzzle.flat();
    // console.log(flatten);
    let cnt = 0;
    for(let i = 0; i < flatten.length-1; i++) {
        for(let j = i+1; j < flatten.length; j++) {
            if(flatten[j] && (flatten[i] == 0 || flatten[i] > flatten[j])) {
                cnt += 1;
            }
        }
    }
    return cnt;
}

function locateZero(puzzle) {
    for(let i = 0; i < puzzle.length; i++) {
        for(let j = 0; j < puzzle[0].length; j++) {
            if(puzzle[i][j] == 0) {
                return (i+j) % 2;
            }
        }
    }
}

function isSolvable(puzzle) {
    const cnt = countInversions(puzzle);
    const x = locateZero(puzzle);
    // console.log(`cnt: ${cnt}, x: ${x}`);
    return (cnt + x) % 2 == 0;
}

export function createDest(m, n) {
    let dest = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => i * n + j + 1));
    dest[m - 1][n - 1] = 0;
    return dest;
}

export function getPuzzle(m, n) {
    let puzzle = Array.from( {length: m*n}, (_, i) => i);
    for(let i = 0; i < puzzle.length; i++) {
        let j = Math.floor(Math.random()*puzzle.length);
        [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
    }
    puzzle = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => puzzle[i*n+j]));
    if(!isSolvable(puzzle)) {
        console.log(`Not solvable: ${puzzle}`);
        if(puzzle[0][0] && puzzle[0][1]) {
            [puzzle[0][0], puzzle[0][1]] = [puzzle[0][1], puzzle[0][0]];
        }
        else {
            [puzzle[1][0], puzzle[1][1]] = [puzzle[1][1], puzzle[1][0]];
        }
    }
    // console.log(puzzle);
    return puzzle;
}