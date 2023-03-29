'use strict';

class Player {
  constructor(choice) {
    this.choice = choice;
  }

  get getChoice() {
    return this.choice;
  }
}

//gameboard object
const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const setChoice = (index, choice) => {
    board[index] = choice;
  };

  const getBoardArea = (index) => {
    return board[index];
  };

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
  };

  return { setChoice, getBoardArea, reset };
})();

//game logic and functions

const game = (() => {
  const player1 = new Player('X');
  const player2 = new Player('O');
  let round = 1;
  let gameIsOver = false;

  const makePlay = (choice) => {
    gameBoard.setChoice(choice, getPlayerSymbol());
    if (checkWinner(choice)) {
      displayController.displayWinnerMessage(getPlayerSymbol());
      gameIsOver = true;
      return;
    }
    if (round === 9) {
      displayController.displayWinnerMessage('Draw');
      gameIsOver = true;
      return;
    }

    round++;
    displayController.setInfo(`Player ${round % 2 === 1 ? 1 : 2} turn`);
  };

  const getPlayerSymbol = () => {
    if (round % 2 === 1) {
      return player1.getChoice;
    } else {
      return player2.getChoice;
    }
  };
  //i looked in the web '-'
  const checkWinner = (fieldIndex) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winConditions
      .filter((combination) => combination.includes(fieldIndex))
      .some((possibleCombination) =>
        possibleCombination.every(
          (index) => gameBoard.getBoardArea(index) === getPlayerSymbol()
        )
      );
  };

  const reset = () => {
    round = 1;
    gameIsOver = false;
  };

  const getGameisOver = () => {
    return gameIsOver;
  };

  return { makePlay, getGameisOver, reset };
})();

//display the symbols, infos and end messages
const displayController = (() => {
  const fields = document.querySelectorAll('.field');
  const info = document.querySelector('.info');
  const modal = document.querySelector('.end-modal');
  const endMessage = document.querySelector('.end-message');
  const overlay = document.querySelector('.overlay');
  const restartButton = document.querySelector('.restart-button');

  fields.forEach((field) =>
    field.addEventListener('click', (e) => {
      if (game.getGameisOver() || e.target.textContent !== '') return;
      game.makePlay(parseInt(e.target.dataset.index));
      renderGameboard();
    })
  );

  const renderGameboard = () => {
    for (let i = 0; i < fields.length; i++) {
      fields[i].textContent = gameBoard.getBoardArea(i);
    }
  };

  const setInfo = (message) => {
    info.textContent = message;
  };

  const displayWinnerMessage = (winner) => {
    if (winner === 'X') {
      endMessage.textContent = 'Player 1 won';
    } else if (winner === 'O') {
      endMessage.textContent = 'Player 2 won';
    } else {
      endMessage.textContent = "It's a draw";
    }
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
  };

  restartButton.addEventListener('click', (e) => {
    gameBoard.reset();
    game.reset();
    renderGameboard();
    setInfo('Player 1 Turn');
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
  });

  return { setInfo, displayWinnerMessage };
})();
