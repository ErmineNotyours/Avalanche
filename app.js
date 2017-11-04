'use strict';
var canvas = document.getElementById('canvas');
// if (canvas.getContext) {}
var ctx = canvas.getContext('2d');
var time = 1000;
var height = 39;
var left = 2; // Not followed throughout.  Kept for compatibility
var width = 70;
var symbols = 3;
var size = 10; // Pixle size
// declare multi-dimensional array board, per MDN Indexed Collections
var rows = 25; // height of prefill board
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

var check = new Array(width + 6);
for (var i = 0; i < (width + 6); i++){
  check[i] = new Array(height + 3);
  for (var j = 0; j < (height + 3); j++){
    check[i][j] = 0;
  }
}

// Draw borders
ctx.fillStyle = 'black';
ctx.fillRect((left * size), 0, size, (size * height));
ctx.fillRect(((left + width) * size), 0, size, (size * height));

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
// Here in original version is where you would mark the center bottom of the board for the option of moving on to the next round

// Prefill board
function prefill(){
  var guess = 1; // Number of guesses it is taking to find a stable cell
  // Blank existing piece for manuall new screen
  ctx.fillstyle = 'white';
  ctx.fillRect((x1 * size), (y1 * size), (3 * size), size);
  var candidate = 0;
  var flag = true;
  // Top of while flag loop (add code)
  flag = false;
  // add cycle and check for cycle > 10 code
  for (var i = left + 1; i < width + 2; i++){
    for (var j = height - rows; j < height; j++){
      candidate = Math.floor(Math.random() * symbols) + 1;
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
      ctx.fillRect(i * size, j * size, size, size);
      board[i] [j] = candidate;
      console.log('i, j, candidate', i, j, candidate);
      // ctx.fillRect(0, 0, 50, 50);
      // ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
      // ctx.fillRect(30, 30, 50, 50);
    } // Next j
  } // Next i
}
prefill();
