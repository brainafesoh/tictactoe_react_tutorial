import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={props.style}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        // Extra 5 of: https://reactjs.org/tutorial/tutorial.html#wrapping-up
        const winnerArray = calculateWinnerArray(this.props.squares)
        return !winnerArray ?
            <Square
                value={this.props.squares[i]}
                onClick = {() => this.props.onClick(i)}
            />
            : winnerArray.includes(i) ?
                <Square
                    value={this.props.squares[i]}
                    onClick = {() => this.props.onClick(i)}
                    // Here is the main goal. Styling the winning squares
                    style = {{backgroundColor: "#44014C"}}
                />
                :
                <Square
                    value={this.props.squares[i]}
                    onClick = {() => this.props.onClick(i)}
                />
    }

    render() {
        return (
            // Extra 3 of: https://reactjs.org/tutorial/tutorial.html#wrapping-up
            // Turn back to this to find out how to loop in JSX
            // Alternative to hardcoding the square displaying. refer to the intro tutorial
            <div>
                {
                    Array(3).fill(0).map((val, index) => {
                        return (
                            <div className="board-row">
                                {
                                    Array(3).fill(0).map((val1, index2) => {
                                        return this.renderSquare((index*3) + index2)
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                playStepPosition: null,
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // To my understanding, this block stops a user from clicking on a square that has already been taken
        // Or again to continue the game after a winnerArray has been found
        if (calculateWinnerArray(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                playStepPosition: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    // Extra 4 of: https://reactjs.org/tutorial/tutorial.html#wrapping-up
    // To be finished later
    displayMoves(order = true) {
        let history
        (order === true) ?
            history = this.state.history
            : history = this.state.history.slice(0).reverse()
        return (
            history.map((step, move) => {
                const desc = move ? // Explicitly acts like a boolean function even though move is a numeric varible. It will be equal to 0 on the first iteration.
                'Go to move #'
                    + move
                    + ': '
                    + (step.squares[step.playStepPosition])
                    + ' at position '
                    + (this.playPositionMatrix(step.playStepPosition))
                :
                'Go to game start';
                const isCurrentMove = (
                    (order === true) ? this.state.stepNumber === move
                    : 9-this.state.stepNumber === move
                )
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>
                            {
                                // Yeah!! making bold the currently selected item in the move list
                                // Extra 2 of: https://reactjs.org/tutorial/tutorial.html#wrapping-up
                                isCurrentMove ? 
                                    <b>{desc}</b>
                                    : desc
                            }
                        </button>
                    </li>
                );
            })
        )
    }

    // Displays (row, col) format for an integer position in a 3x3 matrix
    // Extra 1 of: https://reactjs.org/tutorial/tutorial.html#wrapping-up
    playPositionMatrix(i) {
        return ('(' + (Math.floor(i/3) + 1) + ',' + (i%3 + 1) + ')');
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerArray = calculateWinnerArray(current.squares);

        let status;
        if (winnerArray) {
            status = 'Winner: ' + current.squares[winnerArray[0]];
        } 
        // Extra 6 of: https://reactjs.org/tutorial/tutorial.html#wrapping-up
        else if (current.squares.indexOf(null) === -1) {
            status = 'Hey!! Start a new game. This one is a draw'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <br/>
                    <button onClick={() => this.displayMoves()}>Sort Asc/Dsc</button>
                    <ol>{this.displayMoves()}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinnerArray(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // From here learn that the equivalence symbol cannot be used as: a===b===c, so only 2 at a time.
        // It's funny I tried that though.
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c]
        }
    }
    return null;
}

// =================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)