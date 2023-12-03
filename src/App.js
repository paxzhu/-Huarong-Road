import { useState } from "react";
import { astar, shuffle, createDest } from "./AStar";

const M = 3;
const N = 3;

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