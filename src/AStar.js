function createDest(m, n) {
    let dest = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => i * n + j + 1));
    dest[m - 1][n - 1] = 0;
    return dest;
}
function parity(puzzle) {
    const m = puzzle.length, n = puzzle[0].length;
    let flatten = Array(m*n).fill(null).map((_, i) => puzzle[Math.floor(i/n)][i%n]);
    let cnt = 0, pair;
  
    for(let i = 0; i < m*n; i++) {
      for(let j = i+1; j < m*n; j++) {
        if(flatten[i] != 0 && flatten[j] != 0 && flatten[i] > flatten[j]) {
          cnt += 1;
          pair = [i, j];
        }
      }
    }
  
    if(cnt % 2 == 1) {
      let i = pair[0], j = pair[1];
      let tmp = puzzle[Math.floor(i/n)][i%n];
      puzzle[Math.floor(i/n)][i%n] = puzzle[Math.floor(j/n)][j%n];
      puzzle[Math.floor(j/n)][j%n] = tmp;
    }
  }
  
function shuffle(m, n) {
    let shuffled = Array.from({ length: m * n }, (_, i) => i);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    let puzzle = Array.from({ length: m }, (_, i) => shuffled.slice(i * n, (i + 1) * n));
    parity(puzzle);
    return puzzle;
}

function heuristic(dest) {
    const m = dest.length;
    const n = dest[0].length;
    const locs = Array.from({ length: m * n }, () => [0, 0]);
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            locs[dest[i][j]] = [i, j];
        }
    }
    function manhattans(status) {
    	let puzzle = JSON.parse(status);
        let distance = 0;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                const [x, y] = locs[puzzle[i][j]];
                const manhattan = Math.abs(x - i) + Math.abs(y - j);
                distance += manhattan;
            }
        }
        return distance;
    }
    return manhattans;
}

function locateZero(puzzle) {
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[0].length; j++) {
            if (puzzle[i][j] === 0) {
                return [i, j];
            }
        }
    }
}

function neighbors(status) {
    const puzzle = JSON.parse(status);
    const [i, j] = locateZero(puzzle);
    const neis = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const validNeighbors = [];
    for (const [di, dj] of neis) {
        const x = i + di;
        const y = j + dj;
        if (x >= 0 && x < puzzle.length && y >= 0 && y < puzzle[0].length) {
            [puzzle[i][j], puzzle[x][y]] = [puzzle[x][y], puzzle[i][j]];
            validNeighbors.push([JSON.stringify(puzzle), puzzle[i][j]]);
            [puzzle[i][j], puzzle[x][y]] = [puzzle[x][y], puzzle[i][j]];
        }
    }
    return validNeighbors;
}

function traceToDest(visited, dest) {
    const path = [dest];
    const slides = [];
    while (visited[dest][0] != 'null') {
        const [pre, slide] = visited[dest];
        path.push(pre);
        slides.push(slide)
        dest = pre;
    }
    return [path.reverse(), slides.reverse()];
}

export function astar(puzzle, dest) {
    const manhattans = heuristic(dest);
    const start = JSON.stringify(puzzle);
    const target = JSON.stringify(dest);
    const heap = [[manhattans(start), 0, start]];
    const visited = {};
    visited[start] = ['null', null];

    while (heap.length > 0) {
        const [evaluate, depth, status] = heap.shift();
        if (status === target) {
            break;
        }
        for (const [nei, slide] of neighbors(status)) {
            if (!visited[nei]) {
                visited[nei] = [status, slide];
                heap.push([depth + 1 + manhattans(nei), depth + 1, nei]);
            }
        }
        heap.sort((a, b) => a[0] - b[0]);
    }

    if (!visited[target]) {
        console.log("invalid puzzle");
        return null;
    }

    const [path, slides] = traceToDest(visited, target);
    console.log(path);
    return slides;
}