import React, { useState, useEffect, useCallback } from 'react';
import Board from './Board';
import { calculateWinner, getBestMove } from '../minimax';
import './../App.css';

const Game = () => {
    const [boardSize, setBoardSize] = useState(3);
    const [squares, setSquares] = useState(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
    const [xIsNext, setXIsNext] = useState(true);
    const [xMarksQueue, setXMarksQueue] = useState([]);
    const [oMarksQueue, setOMarksQueue] = useState([]);
    const [gameMode, setGameMode] = useState('PVP'); // PVP or PVA (Player vs AI)
    const [isThinking, setIsThinking] = useState(false);

    // Automatic Deletion Logic (Start of Turn)
    useEffect(() => {
        if (calculateWinner(squares, boardSize)) return;

        const currentQueue = xIsNext ? xMarksQueue : oMarksQueue;
        
        // If player already has max marks, remove the oldest to make space BEFORE they move
        if (currentQueue.length >= boardSize) {
            const newSquares = squares.map(row => [...row]);
            const nextQueue = [...currentQueue];
            const oldest = nextQueue.shift();
            
            newSquares[oldest.i][oldest.j] = null;
            
            setSquares(newSquares);
            if (xIsNext) setXMarksQueue(nextQueue);
            else setOMarksQueue(nextQueue);
        }
    }, [xIsNext]); // Trigger every time the turn changes

    const executeMove = useCallback((i, j) => {
        if (squares[i][j] || calculateWinner(squares, boardSize)) return;

        const newSquares = squares.map(row => [...row]);
        const mark = xIsNext ? 'X' : 'O';

        newSquares[i][j] = mark;

        let newQueue = mark === 'X' ? [...xMarksQueue] : [...oMarksQueue];
        newQueue.push({ i, j });

        setSquares(newSquares);
        
        if (mark === 'X') setXMarksQueue(newQueue);
        else setOMarksQueue(newQueue);

        // Check for winner IMMEDIATELY with the new squares
        const winResult = calculateWinner(newSquares, boardSize);
        if (!winResult) {
            setXIsNext(!xIsNext);
        }
    }, [squares, xIsNext, xMarksQueue, oMarksQueue, boardSize]);

    // Oracle AI Trigger
    useEffect(() => {
        // Only trigger if it's AI turn AND the deletion for this turn has already processed 
        // (i.e. if marks < boardSize, space is ready)
        const currentQueue = xIsNext ? xMarksQueue : oMarksQueue;
        const needsDeletion = currentQueue.length >= boardSize;

        if (!xIsNext && gameMode === 'PVA' && !calculateWinner(squares, boardSize) && !needsDeletion) {
            setIsThinking(true);
            const timer = setTimeout(() => {
                const move = getBestMove(squares, xMarksQueue, oMarksQueue, false, boardSize);
                if (move) executeMove(move.i, move.j);
                setIsThinking(false);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [xIsNext, gameMode, squares, xMarksQueue, oMarksQueue, boardSize, executeMove]);

    const winResult = calculateWinner(squares, boardSize);
    const winner = winResult?.winner;
    const winningLine = winResult?.line || [];
    
    const resetGame = (size) => {
        setBoardSize(size);
        setSquares(Array(size).fill(null).map(() => Array(size).fill(null)));
        setXMarksQueue([]);
        setOMarksQueue([]);
        setXIsNext(true);
    };

    return (
        <div className="game-container">
            <div className="oracle-header">
                <h1>ORACLE_INFINITY</h1>
                <div className="status-bar">
                    {winner ? `VERDICT: ${winner}_DOMINATION` : 
                     isThinking ? 'ORACLE_CALCULATING...' : 
                     `PLAYER_${xIsNext ? '1' : '2'}_INPUT_REQUIRED`}
                </div>
            </div>

            <div className="board-wrapper">
                <Board 
                    squares={squares} 
                    onClick={(i, j) => (xIsNext || gameMode === 'PVP') && executeMove(i, j)} 
                    xQueue={xMarksQueue}
                    oQueue={oMarksQueue}
                    winningLine={winningLine}
                />
            </div>

            <div className="controls">
                <button className="vector-btn" onClick={() => setGameMode(gameMode === 'PVP' ? 'PVA' : 'PVP')}>
                    MODE: {gameMode}
                </button>
                <button className="vector-btn" onClick={() => resetGame(boardSize)}>
                    RESET_GRID
                </button>
                <button className="vector-btn" onClick={() => resetGame(boardSize === 3 ? 4 : 3)}>
                    GRID: {boardSize}x{boardSize}
                </button>
            </div>

            {winner && (
                <div className="winner-overlay">
                    <h1 style={{fontFamily: 'var(--font-mono)'}}>{winner}_WINS</h1>
                    <button className="vector-btn" onClick={() => resetGame(boardSize)} style={{marginTop: '2rem'}}>
                        INITIALIZE_NEW_CYCLE
                    </button>
                </div>
            )}
        </div>
    );
};

export default Game;
