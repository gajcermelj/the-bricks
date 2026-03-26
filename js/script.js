function drawIt() {
	var x = 150;
	var y = 150;
	var dx = 2;
	var dy = 4;
	var ctx;
	var canvas
function init() {
	canvas=document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	return setInterval(draw, 10); //klic funkcije draw vsakih 10 ms; http://www.w3schools.com/jsref/met_win_setinterval.asp
}
function draw() {
	ctx.clearRect(0,0,300,300);
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
	x += dx;
	y += dy;
}
init();
}