import { useState } from "react";
import { astar, shuffle, createDest } from "./AStar";
import { Dropdown, Button } from 'react-bootstrap';

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

function Options({selectedSize, onOptionClick}) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedSize}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onOptionClick(3)}>3 X 3</Dropdown.Item>
        <Dropdown.Item onClick={() => onOptionClick(4)}>4 X 4</Dropdown.Item>
        <Dropdown.Item onClick={() => onOptionClick(5)}>5 X 5</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function Reset({onResetClick}) {
  return <Button onClick={onResetClick}>Shuffle</Button>
}

function Reference({reference, onClick}) {
  let status = null;
  if(reference) {
    status = JSON.stringify(reference)+ ", with steps: " + reference.length ;
  }
  return (
    <div className="status">
      <Button onClick={onClick}>Reference</Button>
      <h4>{status}</h4>
    </div>
  );
}

export default function Board() {
  const [size, setSize] = useState(3);
  const [selectedSize, setSelectedSize] = useState("3 X 3");
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
    if(isOver(squares, dest)) {
      newStatus = "Finished by steps: " + newSteps;
    }
    setStatus(newStatus);
  }

  function handleOptions(newSize) {
    console.log(newSize);
    const dest = createDest(newSize, newSize);
    setStatus("Target As Fallows");
    setSquares(dest);
    setSelectedSize(`${newSize} X ${newSize}`);
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
    <div>
      <div className="status">{status}</div>
      <div>
        {squares.map((line, i) => 
          <div className="board-row" key={i}>
            {line.map((value, j) => 
              <Square value={value} onClick={() => handleClick(i, j)} key={j}/> )}
          </div>
        )}
      </div>
      <Options selectedSize={selectedSize} onOptionClick={handleOptions}/>
      <Reset onResetClick={handleResetClick}/>
      <Reference reference={reference} onClick={() => getReference(squares)}/>
    </div>
  );
}

function isOver(puzzle, dest) {
  return JSON.stringify(puzzle) == JSON.stringify(dest);
}