/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = makeBoard(WIDTH, HEIGHT); // array of rows, each row is array of cells  (board[y][x])

const rootProperty = document.querySelector(':root');

/** makeBoard: create in-JS board array structure
 *    boardArray = array of rows, each row is array of cells  (boardArray[y][x])
 */
function makeBoard(width, height) {
  const boardArray = [];
  for (let i = 0; i < height; i++) boardArray.push(new Array(width));
  return boardArray;
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  const htmlBoard = document.querySelector('#board');

  // Create the top table row with:
  //  id='column-top'
  //  click event => handleClick function.
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  htmlBoard.addEventListener('click', handleClick);
  htmlBoard.addEventListener('mouseover', togglePiece);
  htmlBoard.addEventListener('mouseout', togglePiece);

  // Create individual cells and append to the top table row
  // With variable id attributes 'col-n'
  for (let i = 0; i < WIDTH; i++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', 'col-' + i);
    top.append(headCell);
  }

  htmlBoard.append(top);

  // Create individual cells in a HEIGHT x WIDTH array.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `cell-${y}-${x}`);
      // cell.addEventListener('mouseover', hoverPiece);
      // cell.addEventListener('mouseout', clearPiece);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) return x;
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */
function placeInTable(y) {
  // TODO: make a div and insert into correct table cell
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][y]) {
      const pieceDiv = document.createElement('div');
      pieceDiv.classList.add('player-' + currPlayer);
      pieceDiv.classList.add('piece');
      const emptyCellDiv = document.querySelector('#cell-' + i + '-' + y);
      emptyCellDiv.append(pieceDiv);
      board[i][y] = currPlayer;
      return;
    } else {
      console.log('Next Space');
    }
  }
}

/** endGame: announce game end */
function endGame(msg) {
  // TODO: pop up alert message
  alert(msg);
}

/** togglePiece: Toggles the player's piece over the respective column. */
function togglePiece(event) {
  let targetElement = event.target;
  const targetTagName = event.target.tagName;
  if (targetTagName == 'TABLE') return;

  console.log(targetElement);
  if (targetTagName == 'DIV') targetElement = event.target.parentNode;

  const targetIdArray = targetElement.id.split('-');
  const columnIndex = targetIdArray.length;
  const columnTop = document.querySelector('#col-' + targetIdArray[columnIndex - 1]);
  columnTop.classList.toggle('piece');
}

function setPlayerColor(player) {
  if (player == 1) rootProperty.style.setProperty('--player-color', 'red');
  else rootProperty.style.setProperty('--player-color', 'blue');
}

// Fills out board with color.
// MAYBE RELOGIC THIS
function colorBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      if (board[y][x]) {
        const cell = document.querySelector(`#cell-${y}-${x}`);
        if (board[y][x] == 1) cell.style.backgroundColor = 'red';
        else cell.style.backgroundColor = 'blue';
      }
    }
  }
}

/** handleClick: handle click of column to play piece */
function handleClick(event) {
  // get x from ID of clicked cell
  const currElement = event.target;
  const x = currElement.id.split('-')[2];

  if (event.target.tagName == 'TABLE') return;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) return;

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y);
  // colorBoard();
  console.log(board);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  if (currPlayer === 1) currPlayer = 2;
  else currPlayer = 1;
  console.log(currPlayer);
  setPlayerColor(currPlayer);
}

/** checkForWin: check board cell-by-cell for 'does a win start here?' */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// Style Site with added Text and Elements
document.addEventListener('DOMContentLoaded', () => {
  const gameDiv = document.querySelector('#game');
  const boardDiv = document.querySelector('#board');
  const titleHeader = document.createElement('h1');
  titleHeader.innerText = 'Gravitrips';
  gameDiv.insertBefore(titleHeader, boardDiv);
});

makeBoard();
makeHtmlBoard();
