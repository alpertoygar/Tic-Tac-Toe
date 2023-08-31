import { useState } from "react";

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const [isReversed, setIsReversed] = useState(false);

    function handlePlay(nextSquares) {
        const nextHistory= [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.filter((squares, move) => move<currentMove).map((squares, move) => {
        let description;
        if (move > 0 && move<currentMove) {
            description = 'Go to move #' + (move+1);
        } else if (move === currentMove) {
            description = 'You are at move #' + (move+1);
            return <div className="status">{description}</div>
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    function reverse(){
        setIsReversed(!isReversed);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <button onClick={reverse}>Reverse move list</button>
                <ol>{(isReversed) ? moves.reverse() : moves}</ol>
            </div>
        </div>
    )
}

function Board({ xIsNext, squares, onPlay }) {
    const [winner, line] = calculateWinner(squares);
    const textColors = Array(9).fill("black");
    if(line) {
        for (let i of line){
            textColors[i] = "red";
        }
    }
    function handleClick(i){
        if(squares[i] || winner) return;
        const nextSquares = squares.slice();
        nextSquares[i] = (xIsNext) ? "X" : "O" ;
        onPlay(nextSquares);
    }

    let status;
    if(winner){
        status = "Winner: " + winner;

    } else {
        if(squares.filter(square => square).length===9){
            status = "Draw!";
        } else {
            status = "Next player: " + (xIsNext ? "X" : "O");
        }
    }

    return (
        <>
            <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} textColor={textColors[0]}/>
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} textColor={textColors[1]}/>
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} textColor={textColors[2]}/>
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} textColor={textColors[3]}/>
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} textColor={textColors[4]}/>
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} textColor={textColors[5]}/>
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} textColor={textColors[6]}/>
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} textColor={textColors[7]}/>
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} textColor={textColors[8]}/>
            </div>
        </>
    );
}

function Square({value, onSquareClick, textColor}) {
    return (
        <button className="square" onClick={onSquareClick} style={{color:textColor}}>{value}</button>
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, null];
}
