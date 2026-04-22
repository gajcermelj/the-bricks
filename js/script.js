// 1. Read settings from LocalStorage
var mode = localStorage.getItem('gameMode');
var difficulty = localStorage.getItem('difficulty');

// 2. Set AI Speed based on difficulty
var hitrostAI = 0.9;
if (difficulty === 'easy') hitrostAI = 0.5;
if (difficulty === 'medium') hitrostAI = 0.9;
if (difficulty === 'hard') hitrostAI = 1.7;

function drawIt() {
    
    var x = 200;
    var y = 350;
    var dx = 0;
    var dy = 0; 
    var WIDTH;
    var HEIGHT;
    var r = 6;
    var ctx;
	var stranServisa="leva";
    
    var paddlex;      
    var paddlex2;     
    var paddleh = 10;
    var paddlew = 75;

    var rightDown = false;
    var leftDown = false;
    var paddleActive = false; 
    var spaceDown = false; 

    var p2RightDown = false;
    var p2LeftDown = false;
    var p2PaddleActive = false;
    var enterDown = false;

    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;

    var tockeIgralec = 0;
    var tockeAI = 0;
	var tennisRezultati=["0","15","40","IGRA"];
    
    var igraPoteka = false;
    var odstevanjeTekst = "";

    var sekunde = 0;
    var izpisTimer = "00:00";
    var start = true;
    var intervalId;

    function init() {
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        
        setInterval(timer, 1000);
        init_paddle();
        //init_bricks();
        resetZogice();
        intervalId = setInterval(draw, 10);
    }

    function resetZogice() {
        igraPoteka = false;
		if(stranServisa==="leva"){
			y=50;
			stranServisa="desna";
		}
		else if(stranServisa==="desna"){
			y=HEIGHT-50;
			stranServisa="leva";
		}
        x = WIDTH / 2;
        dx = 0;
        dy = 0;
        
        var odstevanje = 3;
        odstevanjeTekst = "3";

        var countInterval = setInterval(function() {
            odstevanje--;
            if (odstevanje > 0) {
                odstevanjeTekst = odstevanje.toString();
            } else if (odstevanje === 0) {
                odstevanjeTekst = "IGRAJ!";
            } else {
                clearInterval(countInterval);
                odstevanjeTekst = "";
                igraPoteka = true;
                dx = 1.1; 
                dy = 2.5;
            }
        }, 1000);
    }

    function timer() {
        if (start) {
            sekunde++;
            var s = (sekunde % 60 > 9) ? (sekunde % 60) : "0" + (sekunde % 60);
            var m = (Math.floor(sekunde / 60) > 9) ? Math.floor(sekunde / 60) : "0" + Math.floor(sekunde / 60);
            izpisTimer = m + ":" + s;
        }
    }

    function init_paddle() {
        paddlex = WIDTH / 2 - paddlew / 2;
        paddlex2 = WIDTH / 2 - paddlew / 2;
    }

    // KEYBOARD INPUTS
    $(document).keydown(function(evt) {
        // P1 (A=65, D=68, Space=32)
        if (evt.keyCode == 68) rightDown = true;
        else if (evt.keyCode == 65) leftDown = true;
        else if (evt.keyCode == 32 && !spaceDown) { 
            spaceDown = true;
            paddleActive = true;
            setTimeout(function() { paddleActive = false; }, 300); 
        }
        
        // P2 (Left=37, Right=39, Enter=13) - Only active if 1v1 mode
        if (mode === '2p') {
            if (evt.keyCode == 39) p2RightDown = true;
            else if (evt.keyCode == 37) p2LeftDown = true;
            else if (evt.keyCode == 13 && !enterDown) {
                enterDown = true;
                p2PaddleActive = true;
                setTimeout(function() { p2PaddleActive = false; }, 300);
            }
        }
    });

    $(document).keyup(function(evt) {
        if (evt.keyCode == 68) rightDown = false;
        else if (evt.keyCode == 65) leftDown = false;
        else if (evt.keyCode == 32) spaceDown = false; 

        if (mode === '2p') {
            if (evt.keyCode == 39) p2RightDown = false;
            else if (evt.keyCode == 37) p2LeftDown = false;
            else if (evt.keyCode == 13) enterDown = false;
        }
    });

    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fill();
    }

    function draw() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        
        document.getElementById("score1").innerText = tennisRezultati[tockeIgralec];
        document.getElementById("score2").innerText = tennisRezultati[tockeAI];
		
		document.getElementById("player1").innerText = "IGRALEC 1";
        document.getElementById("player2").innerText = mode === '2p' ? "IGRALEC 2" : "NASPROTNIK";

        ctx.fillStyle = "white";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "right";
        ctx.fillText(izpisTimer, WIDTH - 20, 180); 
        ctx.textAlign = "left";

        // Risanje žogice
        ctx.fillStyle = "#CCFF00";
        circle(x, y, r);

        // P1 Ploščica
        if (rightDown && (paddlex + paddlew) < WIDTH) paddlex += 5;
        else if (leftDown && paddlex > 0) paddlex -= 5;
        
        ctx.fillStyle = paddleActive ? "black" : "rgba(0, 0, 0, 0.3)"; 
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        ctx.fillStyle = "black"; 

        // P2 ali AI Ploščica zgoraj
        if (mode === '2p') {
            // Player 2 Movement
            if (p2RightDown && (paddlex2 + paddlew) < WIDTH) paddlex2 += 5;
            else if (p2LeftDown && paddlex2 > 0) paddlex2 -= 5;

            ctx.fillStyle = p2PaddleActive ? "black" : "rgba(0, 0, 0, 0.3)";
            rect(paddlex2, 0, paddlew, paddleh);
            ctx.fillStyle = "black";
        } else {
            // AI Movement
            var centerPloščice = paddlex2 + (paddlew / 2);
            if (centerPloščice < x && (paddlex2 + paddlew) < WIDTH) {
                paddlex2 += hitrostAI; 
            } else if (centerPloščice > x && paddlex2 > 0) {
                paddlex2 -= hitrostAI;
            }
            rect(paddlex2, 0, paddlew, paddleh);
        }

        // Risanje mreže
        var offsetZgoraj = 310; 
        /*
        for (let i = 0; i < NROWS; i++) {
            for (let j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    ctx.drawImage(brickSlika, j * (BRICKWIDTH + PADDING) + PADDING, i * (BRICKHEIGHT + PADDING) + offsetZgoraj, BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
        */

        if (x + dx > WIDTH - r || x + dx < r) dx = -dx;

        // ODBOJ ZGORAJ
        if (y + dy < r + paddleh) {
            if (x > paddlex2 && x < paddlex2 + paddlew) {
                if (mode === '2p') {
                    if (p2PaddleActive) {
                        dx = 8 * ((x - (paddlex2 + paddlew / 2)) / paddlew);
                        dy = -dy;
                    }
                } else {
                    // AI auto-hits
                    dy = -dy;
                }
            } else if (y + dy < 0) { 
                tockeIgralec++;
                
                if (tockeIgralec >= 4) {
                    clearInterval(intervalId); 
                    Swal.fire({
                        title: 'ZMAGA P1!',
                        text: 'Igralec 1 je dobil to igro!',
                        icon: 'success',
                        confirmButtonText: 'Igraj ponovno',
                        confirmButtonColor: '#28a745',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) { location.reload(); }
                    });
                } else {
                    resetZogice();
                }
            }
        }

        // ODBOJ SPODAJ
        if (y + dy > HEIGHT - (r + paddleh)) {
            if (x > paddlex && x < paddlex + paddlew && paddleActive) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
            } else if (y + dy > HEIGHT) { 
                tockeAI++;
                
                if (tockeAI >= 4) {
                    clearInterval(intervalId); 
                    Swal.fire({
                        title: mode === '2p' ? 'ZMAGA P2!' : 'IZGUBIL SI!',
                        text: mode === '2p' ? 'Igralec 2 je dobil igro.' : 'Nasprotnik je dobil igro.',
                        icon: mode === '2p' ? 'success' : 'error',
                        confirmButtonText: 'Poskusi znova',
                        confirmButtonColor: mode === '2p' ? '#28a745' : '#d33',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) { location.reload(); }
                    });
                } else {
                    resetZogice();
                }
            }
        }

        if (igraPoteka) {
            x += dx;
            y += dy;
        }

        if (odstevanjeTekst !== "") {
            ctx.fillStyle = "white";
            ctx.font = "bold 60px Arial";
            ctx.textAlign = "center";
            ctx.fillText(odstevanjeTekst, WIDTH / 2, HEIGHT / 2 + 60);
            ctx.textAlign = "left"; 
        }
    }

    init();
}