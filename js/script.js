var hitrostAI = 0.9;

var brickSlika = new Image();
brickSlika.src = 'Slike/net.jpg';
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

    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;

    // Teniško točkovanje
    var tockeIgralec = 0;
    var tockeAI = 0;
    var tennisRezultati = [0, 15, 30, 40, "IGRA"]; // Možni rezultati
    
    // Spremenljivke za premor in odštevanje
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
        //y = HEIGHT / 2;
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

    function init_bricks() {
        NROWS = 3; 
        NCOLS = 8;
        BRICKWIDTH = (WIDTH / NCOLS) - 2;
        BRICKHEIGHT = 15;
        PADDING = 2;
        bricks = new Array(NROWS);
        for (let i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (let j = 0; j < NCOLS; j++) {
                bricks[i][j] = 1;
            }
        }
    }

    $(document).keydown(function(evt) {
        if (evt.keyCode == 68) rightDown = true;
        else if (evt.keyCode == 65) leftDown = true;
        else if (evt.keyCode == 32 && !spaceDown) { 
            spaceDown = true;
            paddleActive = true;
            setTimeout(function() {
                paddleActive = false;
            }, 300); 
        }
    });

    $(document).keyup(function(evt) {
        if (evt.keyCode == 68) rightDown = false;
        else if (evt.keyCode == 65) leftDown = false;
        else if (evt.keyCode == 32) spaceDown = false; 
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
        
        // IZRIS REZULTATA IN ČASA NA DESNO STRAN
        ctx.fillStyle = "white";
        ctx.font = "bold 50px Arial";
        ctx.textAlign = "right";

        // Narišemo tekst na desno stran
        ctx.fillText("P2: " + tennisRezultati[tockeAI], WIDTH - 20, 60);
        ctx.fillText("P1: " + tennisRezultati[tockeIgralec], WIDTH - 20, 120);
        ctx.fillText(izpisTimer, WIDTH - 20, 180);

        ctx.textAlign = "left"; // Obvezno ponastavimo nazaj na levo

        // Risanje žogice
        ctx.fillStyle = "#CCFF00";
        circle(x, y, r);

        // Risanje in premik spodnje ploščice
        if (rightDown && (paddlex + paddlew) < WIDTH) paddlex += 5;
        else if (leftDown && paddlex > 0) paddlex -= 5;
        
        if (paddleActive) {
            ctx.fillStyle = "black"; 
        } else {
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; 
        }
        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
        ctx.fillStyle = "black"; 

        // Risanje in premik zgornje ploščice
        var centerPloščice = paddlex2 + (paddlew / 2);
        if (centerPloščice < x && (paddlex2 + paddlew) < WIDTH) {
            paddlex2 += hitrostAI; 
        } else if (centerPloščice > x && paddlex2 > 0) {
            paddlex2 -= hitrostAI;
        }
        rect(paddlex2, 0, paddlew, paddleh);

        var offsetZgoraj = 310; 
        for (let i = 0; i < NROWS; i++) {
            for (let j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    ctx.drawImage(
                        brickSlika, 
                        j * (BRICKWIDTH + PADDING) + PADDING, 
                        i * (BRICKHEIGHT + PADDING) + offsetZgoraj, 
                        BRICKWIDTH, 
                        BRICKHEIGHT
					);
                }
            }
        }

        // Odbijanje od opek
        var rowheight = BRICKHEIGHT + PADDING;
        var colwidth = BRICKWIDTH + PADDING;
        var row = Math.floor((y - offsetZgoraj) / rowheight);
        var col = Math.floor(x / colwidth);

        if (y > offsetZgoraj && row < NROWS && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            dy = -dy;
            bricks[row][col] = 0;
        }

        if (x + dx > WIDTH - r || x + dx < r) dx = -dx;

        // ODBOJ ZGORAJ
        if (y + dy < r + paddleh) {
            if (x > paddlex2 && x < paddlex2 + paddlew) {
                dy = -dy;
            } else if (y + dy < 0) { 
                tockeIgralec++;
                
                if (tockeIgralec >= 4) {
                    clearInterval(intervalId); 
                    Swal.fire({
                        title: 'ZMAGA!',
                        text: 'Dobil si to igro!',
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
                        title: 'IZGUBIL SI!',
                        text: 'Nasprotnik je dobil igro.',
                        icon: 'error',
                        confirmButtonText: 'Poskusi znova',
                        confirmButtonColor: '#d33',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) { location.reload(); }
                    });
                } else {
                    resetZogice();
                }
            }
        }

        // PREMIK ŽOGICE
        if (igraPoteka) {
            x += dx;
            y += dy;
        }

        // Tekst za odštevanje na sredini
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