import { useState } from "react";
import { astar, shuffle, createDest } from "./AStar";

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

function Options({onOptionClick}) {
  const [inputSize, setInputSize] = useState(3);
  return (
    <div class="form-floating mb-3 ">
      <input 
      type="number" 
      class="form-control" 
      id="floatingInput" 
      placeholder="size" 
      value={inputSize}
      onChange={(e) => setInputSize(e.target.value)}
      onKeyDown={(e) => {
        const sizeIsValid = e.target.value > 2 && e.target.value < 6;
        if(e.key === 'Enter' && sizeIsValid) {
          onOptionClick(e.target.value);
        }
      }}
      />
      <label for="floatingInput"> 2 {'<'} Size {'<'} 6</label>
    </div>
  );
}

function Reset({onResetClick}) {
  return <button type="button" class="btn btn-primary" onClick={onResetClick}>Shuffle</button>
}

function Reference({reference, onClick}) {
  let status = null;
  if(reference) {
    status = JSON.stringify(reference)+ ", with steps: " + reference.length ;
  }
  return (
    <div className="status">
      <button type="button" class="btn btn-info" onClick={onClick}>Reference</button>
      <h4>{status}</h4>
    </div>
  );
}

export default function Board() {
  const [size, setSize] = useState(3);
  const dest = createDest(size, size);
  const [squares, setSquares] = useState(dest);
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState("Target As Fallows");
  function handleClick(i, j) {
    if(isOver(squares, dest)) {
      return ;
    }
    const m = squares.length, n = squares[0].length;
    let newSquares = Array(m).fill(null).map((_, i) => squares[i].slice());
    let newSteps = steps + 1;
    let newStatus = "Current Steps: " + newSteps;
    exchangeWithBlank(newSquares, i, j);
    setSquares(newSquares);
    setSteps(newSteps);
    if(isOver(newSquares, dest)) {
      newStatus = "Finished by steps: " + newSteps;
    }
    setStatus(newStatus);
  }

  function handleOptions(newSize) {
    console.log(newSize);
    const dest = createDest(newSize, newSize);
    setStatus("Target As Fallows");
    setSquares(dest);
    setSize(newSize);
  }

  function handleResetClick() {
    const shuffled = shuffle(size, size);
    setSteps(0);
    setStatus("Current Steps: 0");
    setSquares(shuffled);
  }
  // http request
  const [reference, setReference] = useState(null);
  const getReference = async (puzzle) => {
    await fetch('http://127.0.0.1:5000/getReference', {
      method: 'POST',
      body: JSON.stringify({
          puzzle: puzzle,
      }),
      headers: {
          'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setReference(data);
      })
      .catch((err) => {
          console.log(err.message);
      });
    };

  return (
    <div class="container justify-content-center ">
      <div className="status">{status}</div>
      <div >
        {squares.map((line, i) => 
          <div className="board-row " key={i}>
            {line.map((value, j) => 
              <Square value={value} onClick={() => handleClick(i, j)} key={j}/> )}
          </div>
        )}
      </div>
      <Options onOptionClick={handleOptions}/>
      <Reset onResetClick={handleResetClick}/>
      <Reference reference={reference} onClick={() => getReference(squares)}/>
    </div>
  );
}

function isOver(puzzle, dest) {
  return JSON.stringify(puzzle) == JSON.stringify(dest);
}