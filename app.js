'use strict';
var canvas = document.getElementById('canvas');
// if (canvas.getContext) {}
var ctx = canvas.getContext('2d');
ctx.font = '48px serif';
// function frame(){
//   update();
//   render();
//   requestAnimationFrame(frame);
// }
var height = 70;
var left = 2; // Not followed throughout.  Kept for compatibility
var width = 90;
var symbols = 3;
var size = 8; // Pixel size
// declare multi-dimensional array board, per MDN Indexed Collections
var rows = 55; // height of prefill board
var x = 0; // x location of piece
var y = 0; // y location of piece
var x1 = 0; // provisional x Location of piece
var y1 = 0; // provisional y location of piece
var cfl = false;
var dead = 0;
var board = new Array(width + 6);
for (var i = 0; i < (width + 6); i++){
  board[i] = new Array(height + 3);
  for (var j = 0; j < (height + 3); j++){
    board[i][j] = 0;
  }
}
// Initialize check
var check = new Array(width + 6);
for (var i = 0; i <= (width + 6); i++){
  check[i] = new Array(height + 3);
  for (var j = 0; j <= (height + 3); j++){
    check[i] [j] = false;
  }
}
var erase = new Array(height);
//var shape = new Array(3);
// for (var s = 0; s <= 2; s++){
//   shape[s] = 0;
//  // console.log('In shape initialization: s, shape[s] ', s, shape[s]);
// }
//var nShape = new Array(3);

// Pad borders of board
// bottom row
for (var fill = 0; fill < (width + 6); fill++){
  board[fill] [height + 1] = 15;
}
// Left and right sides
for (var fill = 0; fill < (height + 3); fill++){
  board[left] [fill] = 15;
  board[left + width + 1] [fill] = 15;
}

// Draw borders
ctx.fillStyle = 'black';
ctx.fillRect((left * size), 0, size, (size * (height + 1)));
ctx.fillRect(((left + (width + 1)) * size), 0, size, (size * (height + 1)));
// Draw bottom boarder too?

// Here in original version is where you would mark the center bottom of the board for the option of moving on to the next round

// Prefill board
function prefill(){
  //document.addEventListener('keydown', processKeydown);
  //debugger;
  globalPrefillFlag = false;
  // Blank existing piece for manual new screen
  ctx.fillStyle = 'white';
  ctx.fillRect((x1 * size), (y1 * size), size - 1, (3 * size) - 1);
  var candidate = 0;
  var guess = 1; // Number of guesses it is taking to find a stable cell

  for (var i = left + 1; i <= width + 2; i++){
    // for (var j = height - rows; j <= height; j+=3){ // Parkay version from this line to next commented block

    //   if (i%3 == 0){
    //       board[i][j] = 3;
    //       ctx.fillStyle = 'blue';
    //       ctx.fillRect(i * size, j * size, size - 1, size - 1);
    //       board[i][j+1] = 1;
    //       ctx.fillStyle = 'red';
    //       ctx.fillRect(i * size, (j+1) * size, size - 1, size - 1);
    //       board[i][j+2] = 1;
    //       ctx.fillRect(i * size, (j+2) * size, size - 1, size - 1);
    //   }else if ((i+1)%3 == 0){
    //       board[i][j] = 1;
    //       ctx.fillStyle = 'red';
    //       ctx.fillRect(i * size, j * size, size - 1, size - 1);
    //       board[i][j+1] = 2;
    //       ctx.fillStyle = 'green';
    //       ctx.fillRect(i * size, (j+1) * size, size - 1, size - 1);
    //       board[i][j+2] = 2;
    //       ctx.fillRect(i * size, (j+2) * size, size - 1, size - 1);
    //   }else{
    //       board[i][j] = 1;
    //       ctx.fillStyle = 'red';
    //       ctx.fillRect(i * size, j * size, size - 1, size - 1);
    //       if ((Math.floor(Math.random() * 2) + 1)==1)
    //       {
    //         board[i][j+1] = 3;
    //         ctx.fillStyle = 'blue';
    //         ctx.fillRect(i * size, (j+1) * size, size - 1, size - 1);
    //       } else {
    //         board[i][j+1] = 2;
    //         ctx.fillStyle = 'green';
    //         ctx.fillRect(i * size, (j+1) * size, size - 1, size - 1);

    //       }
    //       board[i][j+2] = 2;
    //       ctx.fillStyle = 'green';
    //       ctx.fillRect(i * size, (j+2) * size, size - 1, size - 1);
  
    //   }

    for (var j = height - rows; j <= height; j++){
      var cycle = 0;
      var flag = true;
      while (flag) {
        flag = false;
        cycle++;
        //  console.log('Top of while flag, cycle = ', cycle);
        if (cycle > 10){
          guess++;
          console.log('Incrementing guess, ', guess);
          i--; // Yes, I'm decrementing the loop counter
          //  console.log('decrementing i: ', i);
          cycle = 0;
          if (i < (left + 1)){
            globalPrefillFlag = true;
            //  console.log('i is < 4, returning, ', i);
            return;
          }
        }
        candidate = Math.floor(Math.random() * symbols) + 1;
        // Proximity checking
        // why didn't I use && (and) here?

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
      //  console.log('At end of while flag loop: flag=', flag);
      } // wend flag
      // // Now that we have a viable candidate, set the color:
      // switch (candidate){
      // case 1:
      //   ctx.fillStyle = 'red';
      //   break;
      // case 2:
      //   ctx.fillStyle = 'green';
      //   break;
      // case 3:
      //   ctx.fillStyle = 'blue';
      //   break;
      // }
      // ctx.fillRect(i * size, j * size, size - 1, size - 1);

      displayCell(i, j, candidate);

      //ctx.stroke();
      board[i] [j] = candidate;
    
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
var shape = [];
function pickShape(){
  for (var s = 0; s <= 2; s++){
    nShape[s] = Math.floor(Math.random() * symbols) + 1;
    console.log('In pickShape, s, nShape ', s, nShape);

    shape[s] = nShape;
  }
}

pickShape(); // Pick shape for initial Next window

// Make turn. Pull the shape from the next window and place it on the center top of the field.  This will loop again when the piece has reached the bottom and the field is done processing for 3 in a row.

// Move Piece.  Piece moves when commanded, or moves down after a certain amount of time.  If a downward move is blocked, call Check Field.

makeTurn();

function preTurn(){
  // Set initial position of piece on top of field
  x = left + Math.floor(width / 2);
  y = 5; // move down to pad top of field
  // Copy next shape to current shape

  shape = nShape;
  // console.log('copying from nShape: s, shape[s] ', s, shape[s]);

  // Pick next next shape
  for (var s = 0; s <= 2; s++){
    nShape[s] = Math.floor(Math.random() * symbols) + 1;
    // Set the color:
    // switch (nShape[s]){
    // case 1:
    //   ctx.fillStyle = 'red';
    //   break;
    // case 2:
    //   ctx.fillStyle = 'green';
    //   break;
    // case 3:
    //   ctx.fillStyle = 'blue';
    //   break;
    // }
    // // Draw the shape in next window
    // ctx.fillRect((width + 5) * size, (y + s) * size, size - 1, size - 1);

    displayCell(x, y+s, nShape[s]);

  //  console.log('In pick next next, s, nShape[s]: ', s, nShape[s]);
  } // next s, end pick next next shape
  var bot = 0;
  var drop = 0;

  // Check for end of play.  If there is a conflict at the start of a turn, the board is full, the piece is blocked and the game is over.
  if (board[x] [y] || board[x] [y + 1] || board[x] [y + 2]){
    // End of game code here
  }

  // Draw initial shape
  for (var s = 0; s <= 2; s++){
    //  console.log('In draw initial shape, s, shape[s]', s, shape);
    // // Set the color:
    // switch (shape[s]){
    // case 1:
    //   ctx.fillStyle = 'red';
    //   break;
    // case 2:
    //   ctx.fillStyle = 'green';
    //   break;
    // case 3:
    //   ctx.fillStyle = 'blue';
    //   break;
    // }
    // // Draw the shape
    // ctx.fillRect((x) * size, (y + s) * size, size - 1, size - 1);

    displayCell(x, y+s, shape[s]);

  }

}

function makeTurn(){
  preTurn();
  document.addEventListener('keydown', processKeydown);
  //window.requestAnimationFrame(empty);
  // Make move loop.  Turn on event listeners.
  setTimeout(movePieceDown(), 1000);
  // Pause one second
  // Works once only.
} // end makeTurn

function processKeydown(ev){
  event.preventDefault();
  //console.log('In processKeydown, ev = ', ev, ev.code);

  switch(ev.code){
  case 'ArrowLeft':
    movePieceLeft();
    break;
  case 'ArrowRight':
    movePieceRight();
    break;
  case 'ArrowDown':
    movePieceDown();
    break;
  case 'Space':
    rotate();
    break;
  case 'KeyR':
    redraw();
    break;
  }
}

function empty(){
}

function movePieceLeft(){
  // put piece location into provisional variables so they can be returned if new location is blocked
  x1 = x;
  y1 = y;
  x--;
  movePiece();
}

function movePieceRight(){
  x1 = x;
  y1 = y;
  x++;
  movePiece();
}
function movePieceDown(){
  x1 = x;
  y1 = y;
  y++;
  if (movePiece()){
    checkField();
  };
}
function movePiece(){
  cfl = false;
  // Check to see if piece can move
  // Remember, we've already incremented/decremented x, y location
  if ((board[x] [y]) || (board[x] [y + 1]) || board[x] [y + 2]){ // There's something at the new location.
    cfl = true; // Triggers checkField on moveDown.
    // Return old values
    x = x1;
    y = y1;
    return true; // For triggering checkField
  } // end if
  // Erase shape at old location
  ctx.fillStyle = 'white';
  ctx.fillRect(x1 * size, y1 * size, size - 1, size * 3);
  // Draw shape at new location
  for (var s = 0; s <= 2; s++){
    //console.log('In draw shape at new location, s, shape[s], x1, y1, x, y ', s, shape[s], x1, y1, x, y);
    // // Set the color:
    // switch (shape[s]){
    // case 1:
    //   ctx.fillStyle = 'red';
    //   break;
    // case 2:
    //   ctx.fillStyle = 'green';
    //   break;
    // case 3:
    //   ctx.fillStyle = 'blue';
    //   break;
    // }
    // // Draw the shape
    // ctx.fillRect((x) * size, (y + s) * size, size - 1, size - 1);

    displayCell(x, y+s, shape[s]);
  }
}
function rotate(){
  var swap = shape[2];
  shape[2] = shape[1];
  shape[1] = shape[0];
  shape[0] = swap;
  // Draw shape
  for (var s = 0; s <= 2; s++){
    //console.log('In rotate, s, shape[s], x1, y1, x, y ', s, shape[s], x1, y1, x, y);
    // // Set the color:
    // switch (shape[s]){
    // case 1:
    //   ctx.fillStyle = 'red';
    //   break;
    // case 2:
    //   ctx.fillStyle = 'green';
    //   break;
    // case 3:
    //   ctx.fillStyle = 'blue';
    //   break;
    // }
    // // Draw the shape
    // ctx.fillRect((x) * size, (y + s) * size, size - 1, size - 1);

    displayCell(x, y+s, shape[s]);
  }
}

function checkField(){
  console.log('At top of checkField')
  // Add piece to board
  for (var s = 0; s <= 2; s++){
    board[x] [y + s] = shape[s];
  }

  var found = true;
  while (found){
    found = false;

    // Reinitialize check
    // var check = new Array(width + 6);
    check = new Array(width + 6);
    for (var i = 0; i <= (width + 6); i++){
      check[i] = new Array(height + 3);
      for (var j = 0; j <= (height + 3); j++){
        check[i] [j] = false;
      }
    }

    // Check for three in a row
    for (var j = 2; j <= height; j++){
      for (var i = left + 1; i <= width + 2; i++){
        if(board[i] [j] != 0){ // Skip dead cells
          //console.log('Inside three in a row, i, j, board[i] [j], found ', i, j, board[i] [j], found);
          //debugger;

          // Check horizontal
          // if array(i, j) = array(i - 1, j) and array(i, j) = array(i + 1, j) then check(i - 1, j) = 1 : check(i, j) = 1 : check(i + 1, j) =1 : found = 1
          if (board [i] [j] == board[i - 1] [j] && board[i] [j] == board[i + 1] [j]){
            found = true;
            check[i] [j] = true;
            check[i - 1] [j] = true;
            check[i + 1] [j] = true;
          }

          // Check vertical
          // if array(i, j) = array(i, j - 1) and array(i, j) = array(i, j + 1) then check(i, j - 1) = 1 : check(i, j) = 1 : check(i, j + 1) = 1 : found = 1
          if (board[i] [j] == board[i] [j - 1] && board[i] [j] == board[i] [j + 1]){
            found = true;
            check[i] [j] = true;
            check[i] [j - 1] = true;
            check[i] [j + 1] = true;
          }

          // Check diagonal left
          // if array(i, j) = array(i - 1, j - 1) and array(i, j) = array(i + 1, j + 1) then check(i - 1, j - 1) = 1 : check(i, j) = 1 : check(i + 1, j + 1) = 1 : found = 1
          if (board[i] [j] == board[i - 1] [j - 1] && board[i] [j] == board[i + 1] [j + 1]){
            found = true;
            check[i] [j] = true;
            check[i - 1] [j - 1] = true;
            check[i + 1] [j + 1] = true;
          }

          // Check diagonal right
          // if array(i, j) = array(i + 1, j - 1) and array(i, j) = array(i - 1, j + 1) then check(i + 1, j - 1) = 1 : check(i, j) = 1 : check(i - 1, j + 1) = 1 : found = 1
          if (board[i] [j] == board[i + 1] [j - 1] && board[i] [j] == board[i - 1] [j + 1]){
            found = true;
            check[i] [j] = true;
            check[i - 1] [j + 1] = true;
            check[i + 1] [j - 1] = true;
          }
        } // end if skip dead cells
      } // next i
    } // next j

    // Count deleted cells
    var nowDead = 0;
    for(j = 2; j <= height; j++){
      for(i = left + 1; i <= width + 2; i++){
        if(check[i] [j]){
          dead++;
          nowDead++;
        }
      }
    }
    // update totals to screen
    console.log('dead, nowDead ', dead, nowDead);

    if(!found){
      preTurn();
      return;
    }

    // Flash cells
    function blinkOff(){
      console.log('blinkOff');
      for(var j = 2; j <= height; j++){
        for(var i = left + 1; i <= width + 2; i++){
          if(check[i] [j]){
            ctx.fillStyle = 'magenta';
            ctx.fillRect((i) * size, (j) * size, size - 1, size - 1);
          }
        } // next i
      } // next j
      //requestAnimationFrame(frame);
    }

    function blinkOn(){
      console.log('blinkOn');
      for(var j = 2; j <= height; j++){
        for(var i = left + 1; i <= width + 2; i++){
          if(check[i] [j]){
            switch (board[i] [j]){
            case 0:
              ctx.fillStyle = 'white';
              break;
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
          } //switch
          ctx.fillRect((i) * size, (j) * size, size - 1, size - 1); 
        } // next i
      } // next j
      //requestAnimationFrame(frame);

    }

    //console.log('blinkOff/blinkOn procedure');
    for(var blink = 0; blink <= 0; blink++){
      //window.requestAnimationFrame(blinkOff);
      // var d = new Date(); // Alternative to using setTimeout
      // while (d + 5 > Date()){}

      //window.requestAnimationFrame(redraw);
      // var d = new Date();
      // while (d + 10 > Date()){}
      blinkOff();
      // var d = new Date();
      // while (d + 10 > Date()){}
      //blinkOn(); 

    } // next blink

    //redraw();

    // document.addEventListener('keydown',empty() );
    console.log('About to call collapse'); //breakpoint here to illustrate each step of collapse animation.
    collapse();
    //window.requestAnimationFrame(collapse);

    // check for end of screen here, if option chosen
    // if check(2 + int(width/2) ,height) then goto 460 (prefill board)

  } // wend found
} // checkField

function collapse() {
  console.log('Inside collapse()');
  // Remove cells from board
  // 2500 for i = 3 to width + 2
  for(var i = left + 1; i <= width + 2; i++){
    // 2505 offset = 0
    var offset = 0;
    // 2510 for j = height to 2 step -1
    for(j = height; j >= 0; j--){
      // console.log('Top of collapse i, j, board [i][j]: ', i, j, board[i][j]);
      // 2520 if not check(i,j) then array(i, j + offset) = array(i, j) : color= array(i, j): plot i, j + offset
      if(!check[i] [j]){
        // console.log('!check triggered: i, j, check[i][j], offset', i, j, check[i][j], offset);
        board[i] [j + offset] = board[i] [j];
        // switch (board[i] [j]){
        // case 0:
        //   ctx.fillStyle = 'RGB(255, 251, 202, 0.9)' ; // offwhite for debugging.  Return to 'white' or whatever the background is
        //   break;
        // case 1:
        //   ctx.fillStyle = 'red';
        //   break;
        // case 2:
        //   ctx.fillStyle = 'green';
        //   break;
        // case 3:
        //   ctx.fillStyle = 'blue';
        //   break;
        // } // Switch
        // ctx.fillRect(i * size, (j + offset) * size, size - 1, size - 1);

        displayCell(i, j + offset, board[i] [j]);
        //ctx.fillText(offset, i * size + ((width + 5) * size), ((j + offset) * size)); // Temp code.  Remove after debugging
      } // Endif not check 
 
      // This should be an else, after if not check.  Check brackets.
      // Else should work, but use the following if statement for now
      // console.log('Before if check: i, j, check[i][j]', i, j, check[i][j]);
      if (check[i] [j]){
        //else{
        // 2530 if check(i, j) then offset = offset + 1 :
        offset++;
        console.log('Collapse: offset incrementing, i, j, offset ', i, j, offset);
      } // endif check [i] [j]
    } // next j
  } // next i
  if (offset > 0){
    for (var l = offset; l >= 0; l--){
        // There could be cells to be blanked above the reach of j + offset, so this clears them from screen, but not from board[][]?
      ctx.fillStyle = 'RGB(255, 251, 202)' ; // offwhite for debugging.  Return to 'white' or whatever the background is
      ctx.fillRect(i * size, (l) * size, size - 1, size - 1);

      // displayCell(i, j, );
      // ctx.fillText(l, i * size + ((width + 5) * size), ((l) * size)); // Temp code.  Remove after debugging
    } // next l
  } // end if offset > 0
} // end function collapse


function redraw()
{
  //console.log('Inside redraw');

  for (var i = left + 1; i <= width + 2; i++){
    for (var j = height - rows; j <= height; j++){
      console.log('i ' + i + ' j ' + j + ' board [i] [j] ' + board [i] [j]);
      switch (board[i] [j]){
      case 0:
        ctx.fillStyle = 'white';
        break;
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

    } // next j
  } // next i
} // redraw

function displayCell(i, j, color)
{
  switch (color){
    case 0:
      ctx.fillStyle = 'RGB(255, 251, 202, 0.9)' ; // offwhite for debugging.  Return to 'white' or whatever the background is
      break;
    case 1:
      ctx.fillStyle = 'red';
      break;
    case 2:
      ctx.fillStyle = 'green';
      break;
    case 3:
      ctx.fillStyle = 'blue';
      break;
    } // Switch
    ctx.fillRect(i * size, j * size, size - 1, size - 1);

} // displayCell