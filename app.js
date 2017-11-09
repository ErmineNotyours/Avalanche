'use strict';
var canvas = document.getElementById('canvas');
// if (canvas.getContext) {}
var ctx = canvas.getContext('2d');
var time = 100000; // Rough time delay
var height = 60;
var left = 2; // Not followed throughout.  Kept for compatibility
var width = 80;
var symbols = 3;
var size = 10; // Pixle size
// declare multi-dimensional array board, per MDN Indexed Collections
var rows = 45; // height of prefill board
var x1 = 0; // x Location of piece
var y1 = 0; // y location of piece
var board = new Array(width + 6);
for (var i = 0; i < (width + 6); i++){
  board[i] = new Array(height + 3);
  for (var j = 0; j < (height + 3); j++){
    board[i][j] = 0;
  }
}
var erase = new Array(height);
var shape = new Array(2);
var nShape = new Array(3);

// Pad borders of board
// bottom row
for (var fill = 0; fill < (width + 6); fill++){
  board[fill] [height + 1] = 15;
}
// Left and right sides
for (fill = 0; fill < (height + 3); fill++){
  board[left] [fill] = 15;
  board[left + width + 1] [fill] = 15;
}
// Draw borders
ctx.fillStyle = 'black';
ctx.fillRect((left * size), 0, size, (size * height));
ctx.fillRect(((left + width) * size), 0, size, (size * height));

// Here in original version is where you would mark the center bottom of the board for the option of moving on to the next round

// Prefill board
function prefill(){
  //debugger;
  globalPrefillFlag = false;
  // Blank existing piece for manuall new screen
  ctx.fillStyle = 'white';
  ctx.fillRect((x1 * size), (y1 * size), size - 1, (3 * size) - 1);
  var candidate = 0;
  var guess = 1; // Number of guesses it is taking to find a stable cell

  for (var i = left + 1; i < width + 2; i++){
    for (var j = height - rows; j < height; j++){
      var cycle = 0;
      var flag = true;
      while (flag) {
        flag = false;
        cycle++;
        console.log('Top of while flag, cycle = ', cycle);
        if (cycle > 10){
          guess++;
          i--; // Yes, I'm decrementing the loop counter
          console.log('decrementing i: ', i);
          cycle = 0;
          if (i < (left + 1)){
            globalPrefillFlag = true;
            console.log('i is < 4, returning, ', i);
            return;
          }
        }
        candidate = Math.floor(Math.random() * symbols) + 1;
        // Proximity checking
        // Same symbol horizontal left
        if (board[i - 1] [j] == candidate){
          if (board[i - 2] [j] == candidate){
            flag = true;
          }
        }
        // 610 if array(i - 1, j) = candidate then if array(i - 2, j) = candidate then flag = 1 : rem same symbol horz left

        // Same symbol up
        if (board[i] [j - 1] == candidate){
          if (board[i] [j - 2] == candidate){
            flag = true;
          }
        }
        // 620 if array(i, j - 1) = candidate then if array(i, j - 2) = candidate then flag = 1 : rem same symbol up
        // Same symbol diagonally left and up
        if (board[i - 1] [j - 1] == candidate){
          if (board[i - 2] [j - 2] == candidate){
            flag = true;
          }
        }
        // 630 if array(i - 1, j - 1) = candidate then if array(i - 2, j - 2) = candidate then flag = 1 : rem same symbol diag left & up
        // Same symbol diagonally left and down
        if (board[i - 1] [j + 1] == candidate){
          if (board [i - 2] [j + 2] == candidate){
            flag = true;
          }
        }
        // 640 if array(i - 1, j + 1) = candidate then if array(i - 2, j + 2) = candidate then flag = 1 : rem same symbol diag left & down
        console.log('At end of while flag loop: flag=', flag);
      } // wend flag
      // Now that we have a viable candidate, set the color:
      switch (candidate){
      case 1:
        ctx.fillStyle = 'red';
        break;
      case 2:
        ctx.fillStyle = 'green';
        break;
      case 3:
        ctx.fillStyle = 'blue';
        break;
      }
      ctx.fillRect(i * size, j * size, size - 1, size - 1);
      board[i] [j] = candidate;
      console.log('i, j, candidate', i, j, candidate);
      // ctx.fillRect(0, 0, 50, 50);
      // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
      // ctx.fillRect(30, 30, 50, 50);
    } // Next j
  } // Next i
}
var globalPrefillFlag = true;
// It's possible that the function prefill will be so unable to find a stable board with no three in a row that it will have to start over again.  globalPrefillFlag helps do this.
while (globalPrefillFlag){
  globalPrefillFlag = false;
  prefill();
}

var nShape = []; // Next shape to be picked.  Necessary for a next window
function pickShape(){
  for (var s = 0; s > 2; s++){
    nShape[s] = Math.floor(Math.random() * symbols) + 1;
  }
}

pickShape(); // Pick shape for initial Next window

// Make turn. Pull the shape from the next window and place it on the center top of the field.  This will loop again when the piece has reached the bottom and the field is done processing for 3 in a row.

// Move Piece.  Piece moves when commanded, or moves down after a certain amount of time.  If a downward move is blocked, call Check Field.

makeTurn();

function makeTurn(){
  // Set ititial position of piece on top of field
  var x = left + Math.floor(width / 2);
  var y = 0;
  // Copy next shape to current shape
  for (var s = 0; s < 2; s++){
    shape[s] = nShape[s];
  }
  // Pick next next shape
  for (var s = 0; s <= 2; s++){
    nShape[s] = Math.floor(Math.random() * symbols) + 1;
    // Set the color:
    switch (nShape[s]){
    case 1:
      ctx.fillStyle = 'red';
      break;
    case 2:
      ctx.fillStyle = 'green';
      break;
    case 3:
      ctx.fillStyle = 'blue';
      break;
    }
    // Draw the shape in next window
    ctx.fillRect((width + 5) * size, (y + s) * size, size, size);
    console.log('In pick next next, s, nShape[s]: ', s, nShape[s]);
  } // next s, end pick next next shape
  var t1 = time;
  var bot = 0;
  var drop = 0;

  // Check for end of play.  If there is a conflict at the start of a turn, the board is full, the piece is blocked and the game is over.
  if (board[x] [y] || board[x] [y + 1] || board[x] [y + 2]){
    // End of game code here
  }
  //window.requestAnimationFrame(empty);
  // Make move loop.  Turn on event listeners.  Pause before moving piece automatically
  // Uncaught TypeError: Cannot read property 'addEventListener' of undefined
  document.addEventListener('keydown', processKeydown);
} // end makeTurn

function processKeydown(ev){
  event.preventDefault();
  //console.log('In processKeydown, ev = ', ev, ev.code);

  switch(ev.code){
  case 'ArrowLeft':
    //console.log('Process move left');
    break;
  case 'ArrowRight':
    //console.log('Process move right');
    break;
  case 'ArrowDown':
    //console.log('Process force down');
    break;
  case 'Space':
    //console.log('Process rotate');
    break;
  }
  // result: In processKeydown, ev =  KeyboardEvent {isTrusted: true, key: "ArrowLeft", code: "ArrowLeft", location: 0, ctrlKey: false, …}
  // and In processKeydown, ev =  KeyboardEvent {isTrusted: true, key: " ", code: "Space", location: 0, ctrlKey: false, …}
  // Need to access "code: " element of object
}
// check needs to be initialized for each round of a Check Field.  Move it there.
var check = new Array(width + 6);
for (var i = 0; i < (width + 6); i++){
  check[i] = new Array(height + 3);
  for (var j = 0; j < (height + 3); j++){
    check[i][j] = 0;
  }
}
function empty(){
}
