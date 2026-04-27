/**
 * Oracle-Infinity: Minimax Engine with Alpha-Beta Pruning
 * Optimized for the 'Oldest Mark Removal' rule.
 */

export const calculateWinner = (squares, size) => {
    // Check Rows
    for (let i = 0; i < size; i++) {
        if (squares[i].every(v => v && v === squares[i][0])) {
            return { winner: squares[i][0], line: Array.from({length: size}, (_, k) => ({i, j: k})) };
        }
    }
    // Check Columns
    for (let j = 0; j < size; j++) {
        let first = squares[0][j];
        if (first && squares.every(row => row[j] === first)) {
            return { winner: first, line: Array.from({length: size}, (_, k) => ({i: k, j})) };
        }
    }
    // Check Diagonals
    let d1 = squares[0][0];
    if (d1 && squares.every((row, i) => row[i] === d1)) {
        return { winner: d1, line: Array.from({length: size}, (_, k) => ({i: k, j: k})) };
    }
    let d2 = squares[0][size - 1];
    if (d2 && squares.every((row, i) => row[size - 1 - i] === d2)) {
        return { winner: d2, line: Array.from({length: size}, (_, k) => ({i: k, j: size - 1 - k})) };
    }

    return null;
};

const getValidMoves = (squares, queue, size) => {
    const moves = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const isOldest = queue.length === size && queue[0].i === i && queue[0].j === j;
            if (!squares[i][j] || isOldest) {
                moves.push({ i, j });
            }
        }
    }
    return moves;
};

const simulateMove = (squares, xQueue, oQueue, i, j, isX, size) => {
    const nextSquares = squares.map(row => [...row]);
    let nextXQueue = [...xQueue];
    let nextOQueue = [...oQueue];
    const mark = isX ? 'X' : 'O';

    nextSquares[i][j] = mark;
    const queue = isX ? nextXQueue : nextOQueue;
    queue.push({ i, j });

    // Note: Deletion now happens at turn START in Game.js, 
    // but for minimax to look ahead, we should simulate the state AFTER the next deletion.
    // However, simplest is to just treat it as a standard move on the already-cleared board.

    if (isX) nextXQueue = queue; else nextOQueue = queue;

    return { nextSquares, nextXQueue, nextOQueue };
};

export const getBestMove = (squares, xQueue, oQueue, isX, size, depth = 6) => {
    let bestScore = isX ? -Infinity : Infinity;
    let move = null;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!squares[i][j]) {
                const { nextSquares, nextXQueue, nextOQueue } = simulateMove(squares, xQueue, oQueue, i, j, isX, size);
                const score = minimax(nextSquares, nextXQueue, nextOQueue, 0, !isX, -Infinity, Infinity, size, depth);
                
                if (isX) {
                    if (score > bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                } else {
                    if (score < bestScore) {
                        bestScore = score;
                        move = { i, j };
                    }
                }
            }
        }
    }
    return move;
};

const minimax = (squares, xQueue, oQueue, depth, isMaximizing, alpha, beta, size, maxDepth) => {
    const winner = calculateWinner(squares, size);
    if (winner === 'X') return 100 - depth;
    if (winner === 'O') return depth - 100;
    if (depth >= maxDepth) return 0;

    if (isMaximizing) {
        let maxEval = -Infinity;
        // Simulate next turn's deletion for lookahead
        const futureXQueue = [...xQueue];
        const futureSquares = squares.map(row => [...row]);
        if (futureXQueue.length >= size) {
            const oldest = futureXQueue.shift();
            futureSquares[oldest.i][oldest.j] = null;
        }

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (!futureSquares[i][j]) {
                    const { nextSquares, nextXQueue, nextOQueue } = simulateMove(futureSquares, futureXQueue, oQueue, i, j, true, size);
                    const evalScore = minimax(nextSquares, nextXQueue, nextOQueue, depth + 1, false, alpha, beta, size, maxDepth);
                    maxEval = Math.max(maxEval, evalScore);
                    alpha = Math.max(alpha, evalScore);
                    if (beta <= alpha) break;
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        // Simulate next turn's deletion for lookahead
        const futureOQueue = [...oQueue];
        const futureSquares = squares.map(row => [...row]);
        if (futureOQueue.length >= size) {
            const oldest = futureOQueue.shift();
            futureSquares[oldest.i][oldest.j] = null;
        }

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (!futureSquares[i][j]) {
                    const { nextSquares, nextXQueue, nextOQueue } = simulateMove(squares, xQueue, futureOQueue, i, j, false, size);
                    const evalScore = minimax(nextSquares, nextXQueue, nextOQueue, depth + 1, true, alpha, beta, size, maxDepth);
                    minEval = Math.min(minEval, evalScore);
                    beta = Math.min(beta, evalScore);
                    if (beta <= alpha) break;
                }
            }
        }
        return minEval;
    }
};
