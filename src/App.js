import { useState } from "react";
import { astar } from "./AStar";

const M = 3;
const N = 3;

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

function exchangeWithBlank(puzzle, i, j) {
  const m = puzzle.length, n = puzzle[0].length;
  const neis = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  for(const [di, dj] of neis) {
    let x = i+di, y = j+dj;
    if(x >= 0 && x < m && y >= 0 && y < n && puzzle[x][y] == 0) {
      puzzle[x][y] = puzzle[i][j];
      puzzle[i][j] = 0;
    }
  }
}

function Square({value, onClick}) {
  if(value == 0) {
    value = null;
  }
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Reference({onClick}) {
  return (
    <div>
      <h1></h1>
      <button onClick={onClick}>
        Reference
      </button>
    </div>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(shuffle(M, N));
  const [steps, setSteps] = useState(0);
  const dest = createDest(M, N);
  function handleClick(i, j) {
    if(isOver(squares, dest)) {
      return ;
    }
    const m = squares.length, n = squares[0].length;
    let newSquares = Array(m).fill(null).map((_, i) => squares[i].slice());
    exchangeWithBlank(newSquares, i, j);
    setSquares(newSquares);
    setSteps(steps + 1);
  }
  const [slides, setSlides] = useState(null);
  function getSlides() {
    const newSlides = astar(squares, dest);
    setSlides(JSON.stringify(newSlides));
  }

  let referTo;
  if(slides) {
    referTo = "Steps: " + JSON.parse(slides).length;
  }

  let status = "Current Steps: " + steps;
  if(isOver(squares, dest)) {
    status = "Finished by steps: " + steps;
  }
  
  return (
    <div>
      <div className="status">{status}</div>
      <div>
        {squares.map((line, i) => 
          <div className="board-row">
            {line.map((value, j) => 
              <Square value={value} onClick={() => handleClick(i, j)}/> )}
          </div>
        )}
      </div>
      <Reference onClick={getSlides}/>
      <div>
        <h1></h1>
        <h2>{slides} {referTo}</h2>
      </div>
    </div>
  );
}

function isOver(puzzle, dest) {
  return JSON.stringify(puzzle) == JSON.stringify(dest);
}