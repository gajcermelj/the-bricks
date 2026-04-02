function drawIt() {
    var x = 150;
    var y = 150;
    var dx = 2;
    var dy = 4;
    var WIDTH;
    var HEIGHT;
    var r = 10;
    var ctx;
    var paddlex;
    var paddleh;
    var paddlew;

    //tipke za premikanje ploščice
    var rightDown = false;
    var leftDown = false;

    //opeke
    var bricks;
    var NROWS;
    var NCOLS;
    var BRICKWIDTH;
    var BRICKHEIGHT;
    var PADDING;

    //timer
    var sekunde;
    var sekundeI;
    var minuteI;
    var intTimer;
    var izpisTimer;
    var start = true;



    function init() {
        tocke = 0;
        $("#tocke").html(tocke);
        sekunde = 0;
        izpisTimer = "00:00";
        intTimer = setInterval(timer, 1000);
        ctx = $('#canvas')[0].getContext("2d");
        WIDTH = $("#canvas").width();
        HEIGHT = $("#canvas").height();
        return setInterval(draw, 10);
    }

    //timer
    function timer() {
        if (start == true) {
            sekunde++;

            sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
            minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
            izpisTimer = minuteI + ":" + sekundeI;

            $("#cas").html(izpisTimer);
        }
        else {
            sekunde = 0;
            //izpisTimer = "00:00";
            $("#cas").html(izpisTimer);
        }
    }

    //nastavljanje leve in desne tipke
    function onKeyDown(evt) {
        if (evt.keyCode == 65)
            leftDown = true;
        else if (evt.keyCode == 68) rightDown = true;
    }

    function onKeyUp(evt) {
        if (evt.keyCode == 65)
            leftDown = false;
        else if (evt.keyCode == 68) rightDown = false;
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);

    function init_paddle() {
        paddlex = WIDTH / 2;
        paddleh = 10;
        paddlew = 75;
    }

    function initbricks() { //inicializacija opek - polnjenje v tabelo
        NROWS = 10;
        NCOLS = 10;
        BRICKWIDTH = (WIDTH / NCOLS) - 1;
        BRICKHEIGHT = 15;
        PADDING = 1;
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
				var x=Math.floor(Math.random()*2);
                bricks[i][j] = x;
            }
        }
    }


    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }

    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }
    //END LIBRARY CODE
    function draw() {
        clear();
        circle(x, y, 10);
        //premik ploščice levo in desno
        if (rightDown) {
            if ((paddlex + paddlew) < WIDTH) {
                paddlex += 5;
            } else {
                paddlex = WIDTH - paddlew;
            }
        }
        else if (leftDown) {
            if (paddlex > 0) {
                paddlex -= 5;
            } else {
                paddlex = 0;
            }
        }


        rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

        //riši opeke
        for (i = 0; i < NROWS; i++) {
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] == 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }


        rowheight = BRICKHEIGHT + PADDING + r / 2; //Smo zadeli opeko?
        colwidth = BRICKWIDTH + PADDING + r / 2;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
            // razdalja žogce do vodoravnih in navpičnih robov opeke
            var distX = Math.abs(x - (col * colwidth + BRICKWIDTH / 2));
            var distY = Math.abs(y - (row * rowheight + BRICKHEIGHT / 2));

            if (distX / BRICKWIDTH > distY / BRICKHEIGHT)
                dx = -dx; // zadetek z leve ali desne strani
            else
                dy = -dy; // zadetek z zgornje ali spodnje strani

            bricks[row][col] = 0;
            tocke += 1;
            $("#tocke").html(tocke);
        }

        //odboj od leve in desne stene
        if (x + dx > WIDTH - r || x + dx < 0 + r)
            dx = -dx;//ce bi zogca zadela steno ji obrni x smer

        //odboj od zgornje stene
        if (y + dy < 0 + r)
            dy = -dy;//ce bi zogca zadela steno ji obrni y smer

        //odboj od spodnje stene
        else if (y + dy > HEIGHT - (r + paddleh)) {
            start = false;
            //preveri ali je zadel ploščico
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);//ce bolj na sredino ploščice zadene, manjši odboj, če bolj na rob, večji odboj
                dy = -dy; //obbrni y smer
                start = true;
            }

            //ustavi interval draw
            else if (y + dy > HEIGHT - r)
                clearInterval(intervalId);
        }
        x += dx;
        y += dy;
    }

    init();
    init_paddle();
    initbricks();


}






