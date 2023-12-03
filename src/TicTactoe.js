import { useState } from "react";
let BOARD_W = 3;
let BOARD_H = 3;
let WIN_LEN = 3;

function Square({value, onClick}) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i, j) {
    if(squares[i][j] || calculateWinner(squares)) {
      return;
    }
    const newSquares = Array(3).fill(null).map((_, i) => squares[i].slice())
    newSquares[i][j] = xIsNext ? 'X' : 'O'; 
    onPlay(newSquares);
  }
  const winner = calculateWinner(squares);
  let status;
  status = xIsNext ? "Next Player: X" : "Next Player:O";
  if(winner) {
    status = "Winner: " + winner;
  }
  return (
    <div>
      <h4>{status}</h4>
      {squares.map((line, i) => (
        <div className="board-row">
          {line.map( (value, j) => 
            <Square value={value} onClick={() => handleClick(i, j)}/>
          )}
        </div>
      ))}
    </div>
  );
} 

export default function Game() {
  const [history, setHistory] = useState([Array(3).fill(null).map(() => Array(3).fill(null))]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove%2 == 0;
  const currentHistory = history[currentMove];
  function handlePlay(newSquares) {
    setCurrentMove(currentMove+1);
    setHistory([...history.slice(0, currentMove+1), newSquares]);
  }
  function jumpTo(i) {
    setCurrentMove(i);
  }

  const moves = history.map((_, move) => {
    let description = "Go to game start";
    if(move > 0) {
      description = "Go to move #" + move;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {description}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext}  squares={currentHistory} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  function isWinner(i, j, shift) {
    let step = 1;
    const [x, y] = shift;
    const boundary_i = i + x*(WIN_LEN-1), boundary_j = j + y*(WIN_LEN-1);
    if(boundary_i < 0 || boundary_i >= BOARD_H || boundary_j < 0 || boundary_j >= BOARD_W)
      return false; 
    for(step; step < WIN_LEN; step++) {
      if(squares[i + x*step][j + y*step] != squares[i][j]) {
        break;
      }
    }
    return step === WIN_LEN;
  }

  for(let i = 0; i < squares.length; i++) {
    for(let j = 0; j < squares[0].length; j++) {
      if(squares[i][j]) {
        if(isWinner(i, j, [0, 1]) || 
            isWinner(i, j, [1, 0]) || 
            isWinner(i, j, [1, 1]) || 
            isWinner(i, j, [1, -1]))
          return squares[i][j];
      }
    }
  }
  return null;
}
