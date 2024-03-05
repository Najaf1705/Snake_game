const board=document.querySelector("#board");
const ctx=board.getContext("2d");
const scoreElm=document.querySelector("#score");
const hscoreElm=document.querySelector("#hscore");
const resetBtn=document.querySelector("#reset");
const bwidth=board.width;
const bheight=board.height;
const bbgColor="black";
const snakeColor="green";
const foodColor="white";
const unitSize=16;
let running=false;
let xVelocity=unitSize;
let yVelocity=0;
let foodX,foodY,highScore = parseInt(localStorage.getItem('high')) || 0;

let score=0;
// Snake is an array of objs
let snake=[
  {x:unitSize*3,y:0},
  {x:unitSize*2,y:0},
  {x:unitSize,y:0},
  {x:0,y:0}
];

window.addEventListener("keydown",changeDirection);
resetBtn.addEventListener("click",resetGame);

gameStart();

function gameStart(){
  running=true;
  scoreElm.textContent="Score: "+score;
  hscoreElm.textContent="High Score: "+highScore;
  createFood();
  placeFood();
  drawSnake();
  nextTick();
};
function nextTick(){
  if(running){
    setTimeout(()=>{
      clearBoard();
      placeFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    },100);
  }else{
    displayGameOver();
  }
};
function clearBoard(){
  var gradient = ctx.createLinearGradient(0, 0, bwidth, bwidth);
  gradient.addColorStop(0, "black");
  gradient.addColorStop(1, "#ff2222");
  ctx.fillStyle=gradient;
  ctx.fillRect(0,0,bwidth,bwidth);
};
function createFood(){
  function randomFood(min,max){
    let ranNum=Math.round((Math.random()*bwidth+min)/unitSize)*unitSize;
    return ranNum;
  }
  foodX=randomFood(0,bwidth-unitSize);
  foodY=randomFood(0,bwidth-unitSize);
  console.log(foodX,foodY);
};
function placeFood(){
  ctx.fillStyle=foodColor;
  // ctx.fillRect(foodX,foodY,unitSize,unitSize);
  // Calculate the center of the food
  const centerX = foodX + unitSize / 2;
  const centerY = foodY + unitSize / 2;

  // Draw a circular shape for the food
  ctx.beginPath();
  ctx.arc(centerX, centerY, unitSize / 2, 0, 2 * Math.PI);
  ctx.fill();
};
function moveSnake(){
  const head={
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity
  };
  snake.unshift(head);
  if(snake[0].x==foodX && snake[0].y==foodY){
    score+=1;
    scoreElm.textContent="Score:"+score;
    createFood();
  }else{
    snake.pop();
  }
};
function drawSnake(){
  ctx.fillStyle=snakeColor;
  ctx.strokeStyle="white"
  snake.forEach(part=>{
    ctx.fillRect(part.x,part.y,unitSize,unitSize);
    ctx.strokeRect(part.x,part.y,unitSize,unitSize);
  })
};
function changeDirection(e){
  const keyPressed=e.keyCode;
  const LEFT=37;
  const UP=38;
  const RIGHT=39;
  const DOWN=40;

  const goingUp=(yVelocity==-unitSize);
  const goingDown=(yVelocity==unitSize);
  const goingLeft=(xVelocity==-unitSize);
  const goingRight=(xVelocity==unitSize);

  switch (true) {
    case (keyPressed==LEFT && !goingRight):
      xVelocity=-unitSize;
      yVelocity=0;      
      break;
    case (keyPressed==RIGHT && !goingLeft):
      xVelocity=unitSize;
      yVelocity=0;      
      break;
    case (keyPressed==UP && !goingDown):
      xVelocity=0;
      yVelocity=-unitSize;      
      break;
    case (keyPressed==DOWN && !goingUp):
      xVelocity=0;
      yVelocity=unitSize;      
      break;
  
    default:
      break;
  }
};
function checkGameOver(){
  switch (true) {
    case (snake[0].x<0 || snake[0].x>bwidth || snake[0].y<0 || snake[0].y>bwidth):
      running=false;
      break;
  }
  for(let i=1;i<snake.length;i++){
    if(snake[i].x==snake[0].x && snake[i].y==snake[0].y){
      running=false;
    }
  }
};
function displayGameOver(){
  ctx.font="50px MV Boli";
  ctx.fillStyle="white";
  ctx.textAlign="center";
  ctx.fillText("Game Over!!",bwidth/2,bwidth/2);
  running=false;
};
function resetGame(){
  console.log(score);
  console.log(highScore);
  if(score>highScore){
    console.log("hehe");
    localStorage.setItem('high',score);
    highScore=score;
  }
  hscoreElm.textContent="High Score: "+ localStorage.getItem('high');
  score=0;
  xVelocity=unitSize;
  yVelocity=0;
  snake=[
    {x:unitSize*3,y:0},
    {x:unitSize*2,y:0},
    {x:unitSize,y:0},
    {x:0,y:0}
  ];
  gameStart();
};
document.getElementById('left').addEventListener('click', function() {
  if(xVelocity!=unitSize){
    xVelocity = -unitSize;
    yVelocity = 0;
  }
});

document.getElementById('up').addEventListener('click', function() {
  if(yVelocity!=unitSize){
    xVelocity = 0;
    yVelocity = -unitSize;
  }
});

document.getElementById('right').addEventListener('click', function() {
  if(xVelocity!=-unitSize){
    xVelocity = unitSize;
    yVelocity = 0;
  }
});

document.getElementById('down').addEventListener('click', function() {
  if(yVelocity!=-unitSize){
    xVelocity = 0;
    yVelocity = unitSize;
  }
});
