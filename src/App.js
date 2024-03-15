//import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function Game() {
  const boardSize = 3;
  const [history, setHistory] = useState([{ squares: Array(boardSize * boardSize).fill(null), index: -1 }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortDescending, setSortDescending] = useState(false);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(newSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: newSquares, index: (index + 1) }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function handleSort() {
    const sort = !sortDescending;
    setSortDescending(sort);
  }

  const moves = history.map((entries, move) => {
    let row = entries.index % boardSize == 0 ? boardSize : entries.index % boardSize;
    let col = Math.ceil(entries.index / boardSize);
    let description = (move > 0 ? ('Go to move #' + move + ' [' + row + ',' + col + ']') : 'Go to game start');
    return (
      <li key={move}>
        {move === currentMove ? (
          <>You are at move # {move}</>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });


  const sort = sortDescending ? "Sort ascending" : "Sort descending";
  return (
    <>
      <div className="game">
        <div className="game-baord">
          <Board size={boardSize} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button onClick={handleSort}>{sort}</button>
          <ol>{sortDescending ? moves.slice().reverse() : moves}</ol>
        </div>
      </div>
    </>
  );
}

function Board({ size, xIsNext, squares, onPlay }) {

  const winner = calculateWinner(squares);
  const nextPlayer = "Next player: " + (xIsNext ? "X" : "O");
  const winnerPlayer = "Winner: " + (xIsNext ? "O" : "X");
  let status = winner ? (winner[0] ? winnerPlayer : "It's a draw!") : nextPlayer;

  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[index] = xIsNext ? 'X' : 'O';
    onPlay(newSquares, index);
  }

  const group = (items, n) => items.reduce((acc, x, i) => {
    const idx = Math.floor(i / n);
    acc[idx] = [...(acc[idx] || []), x];
    return acc;
  }, []);

  return (
    <>
      <div className="status">{status}</div>
      {group(squares, size).map((rows, index) =>
        <div key={index} className="board-row">
          {rows.map((square, i) => <Square winner={winner && winner.includes(i + index * size)} key={i + index * size} value={square} onSquareClick={() => handleClick(i + index * size)} />)}
        </div>
      )}
    </>
  );
}

function Square({ value, onSquareClick, winner = false }) {
  let squareClass = winner ? "winner square" : "square";
  return (
    <>
      <button className={squareClass} onClick={onSquareClick}>{value}</button>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let unfinished = false;
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (!squares[a] || !squares[b] || !squares[b]) {
      unfinished = true;
    }
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return [true, a, b, c];
    }
  }
  return unfinished ? null : [false];
}

export default Game;