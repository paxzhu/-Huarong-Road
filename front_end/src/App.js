import { useState, useRef, useEffect } from "react";
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

// function Square({value, onSquareClick}) {
//   if(value == 0) {
//     value = null;
//   }
  

//   return (
//     <button class="" onClick={onSquareClick}>
//       {value}
//     </button>
//   );
// }

function Options({onOptionClick}) {
  const [inputSize, setInputSize] = useState(3);
  return (
    
        <form onSubmit={(e) => {
          e.preventDefault();
          onOptionClick(inputSize);
        }}>
          <label for="validationCustom03" class="form-label">Game Size</label>
          <div class="input-group">
              <input 
                  type="number" 
                  class="form-control" 
                  id="validationCustom03" 
                  placeholder="Enter a number"
                  title="3 <= Size <=5"
                  min="3"
                  max="5"
                  required 
                  value={inputSize} 
                  onChange={(e) => setInputSize(e.target.value)}
              />
              <button type="submit" class="btn btn-outline-primary">Submit</button>
          </div>
        </form>
  );
}

function Reset({onResetClick}) {
  return <button type="button" class="btn btn-primary me-2" onClick={onResetClick}>Shuffle</button>
}

function Reference({reference, onClick}) {
  let status = null;
  if(reference) {
    status = JSON.stringify(reference)+ ", with steps: " + reference.length ;
  }
  return (
      <button type="button" class="btn btn-info me-2" onClick={onClick}>Reference</button>
  );
}

export default function Board() {
  const [size, setSize] = useState(3);
  const dest = createDest(size, size);
  const [squares, setSquares] = useState(dest);
  const [steps, setSteps] = useState(0);
  const [status, setStatus] = useState("Target As Follows");
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
    // console.log(newSize);
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
    console.log(puzzle)
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
  // responsive width of puzzle-main
  const mainRef = useRef(null);
  const [mainWidth, setMainWidth] = useState(0);
  useEffect(() => {
    if (mainRef.current) {
      setMainWidth(mainRef.current.clientWidth); // 获取父元素的宽度
    }
  }, []);
  // console.log(mainWidth);
  const fontSize = (mainWidth/squares.length)*0.5;

  const Square = ({value, fontSize, onSquareClick}) => {
      if(value == 0) {
          value = null;
        }
      
      return (
      <button className="puzzle-button" style={{fontSize: fontSize}} onClick={onSquareClick}>
          {value}
      </button>
      );
  }; 

  return (
    <div class="container">
      <div className="status text-center fs-1" id="puzzle-status">{status}</div>
      <div className="custom-container custom-border mb-2" id="puzzle-main" ref={mainRef}>
        {squares.map((line, i) =>
          <div class="box" key={i}>
            {line.map((value, j) =>
              <div class="col square">
                <Square value={value} fontSize={fontSize} onSquareClick={() => handleClick(i, j)} />
              </div>
              )}
          </div>
        )}
      </div>
      <div class="custom-container custom-border mb-2" id="puzzle-menu">
        <div class="custom-border mb-2">
          <Options onOptionClick={handleOptions} />
        </div>
        <div >
          <Reset onResetClick={handleResetClick} />
          <Reference reference={reference} onClick={() => getReference(squares)} />
        </div>
      </div>
    </div>
  );
}

function isOver(puzzle, dest) {
  return JSON.stringify(puzzle) == JSON.stringify(dest);
}