var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 1;

var player1Score = 0;
var player2Score = 0;
const winningScore = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const paddleThickness = 10;
const paddleHeight = 100;

function calculateMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	};
} 

function handleMouseClick(evt){
	if(showingWinScreen){
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick)

	canvas.addEventListener('mousemove',
		function(evt){
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y-(paddleHeight/2)
		})
}

function ballReset() {
	if(player1Score >= winningScore ||
	player2Score >= winningScore){
		showingWinScreen = true;

	}
	ballSpeedX = -ballSpeedX
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function computerMovement(){
	var paddle2YCenter = paddle2Y + (paddleHeight/2);
	if(paddle2YCenter < ballY-35){
		paddle2Y += 6;
	}else if(paddle2YCenter > ballY+35){
		paddle2Y -= 6;
	}
}

function moveEverything() {
	if(showingWinScreen){
		return;
	}
	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX < 0){
		if(ballY > paddle1Y &&
			ballY < paddle1Y + paddleHeight){
				ballSpeedX = -ballSpeedX;

				var deltaY = ballY - (paddle1Y+paddleHeight/2);
				ballSpeedY = deltaY * 0.35;
		}else{
			player2Score++;
			ballReset();
			
		}
	}
	if(ballX > canvas.width){
		if(ballY > paddle2Y &&
			ballY < paddle2Y + paddleHeight){
				ballSpeedX = -ballSpeedX;

				var deltaY = ballY - (paddle1Y+paddleHeight/2);
				ballSpeedY = deltaY * 0.35;
		}else{
			player1Score++;
			ballReset();
			
		}
	}
	if(ballY < 0){
		ballSpeedY = -ballSpeedY
	}
	if(ballY > canvas.height){
		ballSpeedY = -ballSpeedY;
	}
}

function drawEverything() {
	colorRect(0,0,canvas.width,canvas.height,'black');

	if(showingWinScreen){
		canvasContext.fillStyle = 'white';

		if(player1Score >= winningScore){
			canvasContext.fillText('Left Player Won!',350,200);

		}else if(player2Score >= winningScore){
			canvasContext.fillText('Right Player Won!',350,200);
		}

		
		canvasContext.fillText("click to continue",350,500);
		return;

	}
	// Left paddle
	colorRect(0,paddle1Y,paddleThickness,paddleHeight,'white');
	// Right computer paddle
	colorRect(canvas.width-paddleThickness,paddle2Y,paddleThickness,paddleHeight,'white');
	// Ball
	colorCircle(ballX,ballY,10,'white');

	canvasContext.fillText(player1Score, 100,100);
	canvasContext.fillText(player2Score, canvas.width-100,100);
	
}

function colorCircle(centerX,centerY,radius,drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}

function colorRect(leftX,topY, width,height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}