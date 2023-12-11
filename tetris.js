const cvs = document.getElementById("tetris");
const ctx = cvs.getContext("2d");
const scoreElement = document.getElementById("score");

const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 25;
const VACANT = "GRAY"; 


function drawSquare(x,y,color, highlightColor){
    ctx.fillStyle = color;
    ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);

    if (highlightColor) {
        ctx.strokeStyle = highlightColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(x * SQ + 3, y * SQ + 3, SQ - 6, SQ - 6);
        ctx.lineWidth = 1; // Reset to the default lineWidth
    }
}


let board = [];
for( r = 0; r <ROW; r++){
    board[r] = [];
    for(c = 0; c < COL; c++){
        board[r][c] = VACANT;
    }
}

function drawBoard(){
    for( r = 0; r <ROW; r++){
        for(c = 0; c < COL; c++){
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();



const PIECES = [
    [Z,"red"],
    [S,"green"],
    [T,"yellow"],
    [O,"blue"],
    [L,"purple"],
    [I,"cyan"],
    [J,"orange"]
];

function randomPiece(){
    let r = randomN = Math.floor(Math.random() * PIECES.length) 
    return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();



function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    
    this.tetrominoN = 0; 
    this.activeTetromino = this.tetromino[this.tetrominoN];
    
    this.x = 3;
    this.y = -2;
}


Piece.prototype.fill = function(color, highlightColor){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
    
            if( this.activeTetromino[r][c]){
                drawSquare(this.x + c,this.y + r, color, highlightColor);
            }
        }
    }
}



Piece.prototype.draw = function(){
    this.fill(this.color, "white");
}



Piece.prototype.unDraw = function(){
    this.fill(VACANT);
}



Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
        this.unDraw();
        this.y++;
        this.draw();
    }else{
   
        this.lock();
        p = randomPiece();
    }
    
}


Piece.prototype.moveRight = function(){
    if(!this.collision(1,0,this.activeTetromino)){
        this.unDraw();
        this.x++;
        this.draw();
    }
}

Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
        this.unDraw();
        this.x--;
        this.draw();
    }
}

Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            
            kick = -1; 
        }else{
           
            kick = 1; 
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; 
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}

let score = 0;

Piece.prototype.lock = function(){
    for( r = 0; r < this.activeTetromino.length; r++){
        for(c = 0; c < this.activeTetromino.length; c++){
      
            if( !this.activeTetromino[r][c]){
                continue;
            }
            
            if(this.y + r < 0){
                alert("Game Over");
                
                gameOver = true;
                break;
            }
          
            board[this.y+r][this.x+c] = this.color;
        }
    }
    
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COL; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
           
            for( y = r; y > 1; y--){
                for( c = 0; c < COL; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            
            for( c = 0; c < COL; c++){
                board[0][c] = VACANT;
            }
            
            score += 10;
        }
    }
   
    drawBoard();
    
    scoreElement.innerHTML = score;
}


Piece.prototype.collision = function(x,y,piece){
    for( r = 0; r < piece.length; r++){
        for(c = 0; c < piece.length; c++){
          
            if(!piece[r][c]){
                continue;
            }
        
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            if(newX < 0 || newX >= COL || newY >= ROW){
                return true;
            }
           
            if(newY < 0){
                continue;
            }
            
            if( board[newY][newX] != VACANT){
                return true;
            }
        }
    }
    return false;
}



document.addEventListener("keydown",CONTROL);
document.getElementById("instructions").style.display = "block";


function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode == 38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode == 39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode == 40){
        p.moveDown();
    }
}


let dropStart = Date.now();
let gameOver = false;
function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta > 500){
        p.moveDown();
        dropStart = Date.now();
    }
    if( !gameOver){
        requestAnimationFrame(drop);
    }
}

drop();
function restartGame() {
    // Reset variables and board state
    score = 0;
    scoreElement.innerHTML = score;
    board = [];
    for (r = 0; r < ROW; r++) {
        board[r] = [];
        for (c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
    drawBoard();

    // Start a new game
    gameOver = false;
    dropStart = Date.now();
    p = randomPiece();
    drop();
}


















