import { faRobot, faUserLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { userDetailsType } from "../pages/Game/Game";

type SquareValue = "X" | "O" | null;

interface BoardProps {
  userDetails: userDetailsType;
}

const Board: React.FC<BoardProps> = ({ userDetails }) => {
  const [squares, setSquares] = useState<Array<SquareValue>>(
    Array(9).fill(null)
  );
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [whoWin, setWhoWin] = useState("");
  const [countWin, setCountWin] = useState({
    user: 0,
    bot: 0,
  });
  const [consecutiveWin, setConsecutiveWin] = useState(0);

  const botMove = () => {
    const emptyIndices = squares
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null) as number[];

    if (emptyIndices.length > 0) {
      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      handleClick(randomIndex);
    }
  };

  useEffect(() => {
    if (winningLine === null && !squares.includes(null)) {
      setConsecutiveWin(0);
      setWhoWin("Draw");
    }
  }, [squares, winningLine]);

  const handleClick = (index: number) => {
    if (squares[index] || winningLine) return;

    const newSquares = squares.slice();
    newSquares[index] = isXNext ? "X" : "O";
    setSquares(newSquares);
    setIsXNext(!isXNext);

    const winner = calculateWinner(newSquares);
    if (winner) {
      setWinningLine(winner.line);
    }

    if (winner?.player === "X") {
      let newCount = 0;
      if (consecutiveWin === 3) {
        newCount = countWin.user + 2;
        setConsecutiveWin(0);
      } else {
        newCount = countWin.user + 1;
        setConsecutiveWin(consecutiveWin + 1);
      }
      setCountWin({
        ...countWin,
        user: newCount,
      });
    } else if (winner?.player === "O") {
      setCountWin({
        user: countWin.user > 0 ? countWin.user - 1 : 0,
        bot: countWin.bot + 1,
      });
      setConsecutiveWin(0);
    }

    if (winner?.player) {
      setWhoWin(
        winner?.player === "X"
          ? `${userDetails.given_name.toUpperCase()} WIN`
          : "AI WIN"
      );
    }
  };

  const calculateWinner = (
    squares: Array<SquareValue>
  ): { player: SquareValue; line: number[] } | null => {
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

    for (const [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { player: squares[a], line: [a, b, c] };
      }
    }
    return null;
  };

  useEffect(() => {
    if (!isXNext && !winningLine) {
      botMove();
    }
  }, [isXNext, squares, winningLine]);
  const renderSquare = (index: number) => (
    <button
      className={`square ${
        winningLine?.includes(index) ? "winning-square" : ""
      }`}
      onClick={() => handleClick(index)}
    >
      {squares[index]}
    </button>
  );

  const renderWinningLine = () => {
    if (!winningLine) return null;

    const [a, b, c] = winningLine;
    const isHorizontalRow1 = a === 0 && b === 1 && c === 2;
    const isHorizontalRow2 = a === 3 && b === 4 && c === 5;
    const isHorizontalRow3 = a === 6 && b === 7 && c === 8;
    const isVerticalCol1 = a === 0 && b === 3 && c === 6;
    const isVerticalCol2 = a === 1 && b === 4 && c === 7;
    const isVerticalCol3 = a === 2 && b === 5 && c === 8;
    const isDiagonal = (a === 0 && c === 8) || (a === 2 && c === 6);

    const lineClass = isHorizontalRow1
      ? "isHorizontal-row1"
      : isHorizontalRow2
      ? "isHorizontal-row2"
      : isHorizontalRow3
      ? "isHorizontal-row3"
      : isVerticalCol1
      ? "vertical-col1"
      : isVerticalCol2
      ? "vertical-col2"
      : isVerticalCol3
      ? "vertical-col3"
      : isDiagonal
      ? "diagonal"
      : "";

    const reverse = isDiagonal && a === 2 && c === 6;

    return (
      <div
        className={`line ${lineClass}`}
        data-reverse={reverse ? "true" : "false"}
      />
    );
  };

  const onResetGame = () => {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setWinningLine(null);
    setWhoWin("");
  };

  return (
    <>
      <div className="status">
        <div>
          <FontAwesomeIcon icon={faUserLarge} /> {countWin.user}{" "}
        </div>
        <div>{whoWin}</div>
        <div>
          <FontAwesomeIcon icon={faRobot} /> {countWin.bot}
        </div>
      </div>
      <div className="main-board">
        <div className="board">
          {renderWinningLine()}
          <div className="board-row">
            {renderSquare(0)} {renderSquare(1)} {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)} {renderSquare(4)} {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)} {renderSquare(7)} {renderSquare(8)}
          </div>
          <div className="btn-reset">
            {" "}
            <button onClick={() => onResetGame()}>reset</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
