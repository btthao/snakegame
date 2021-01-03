let snake;
let bestScore = [];
const gameArea = document.getElementById('game-area');
const start = document.getElementById('start');
const score = document.getElementById('score');
let lastRender;
let direction;
let speed;
let row = 25;
let point = 0;
let lose = [254, 255, 256, 258, 259, 260, 262, 263, 264, 266, 267, 268, 270, 279, 281, 283, 285, 287, 289, 291, 295, 304, 306, 308, 310, 312, 313, 314, 316, 317, 318, 320, 329, 331, 333, 335, 337, 343, 354, 355, 356, 358, 359, 360, 362, 366, 367, 368, 370]



//storing and showing best score

function highestScore() {

    if (bestScore.length >= 2) {
        let check = 0;
        let checkScore = [];
        for (let i = bestScore.length - 2; i >= 0; i--) {
            if (bestScore[bestScore.length - 1] > bestScore[i]) {
                checkScore.push(1)
            } else {
                checkScore.push(0)
            }
        }
        for (let i = 0; i < checkScore.length; i++) {

            check += checkScore[i];
        }

        if (check == checkScore.length) {
            alert('highest score')
        }
        console.log(checkScore);
        console.log(check)
    }

}



//create divs/squares inside game area
for (let i = 0; i < (row * row); i++) {
    const square = document.createElement('div');
    // square.innerHTML = i;
    gameArea.appendChild(square);
}
const allSquares = document.querySelectorAll('#game-area div')


//generate apple
function apple() {
    allSquares.forEach(square =>
        square.classList.remove('apple')
    )
    let applePos = Math.floor(Math.random() * allSquares.length);
    allSquares[applePos].classList.add('apple');
}


//keyboard control 
function control(e) {
    // squares[currentIndex].classList.remove('snake')
    if (direction == 1 || direction == -1) {
        if (e.keyCode === 40) {
            direction = row;
        } else if (e.keyCode === 38) {
            direction = -row;
        }
    } else if (direction == row || direction == -row) {
        if (e.keyCode === 39) {
            direction = 1;
        } else if (e.keyCode === 37) {
            direction = -1;
        }
    }
}

//when the game ends

function end() {

    lose.forEach(function(item) {
        allSquares[item].classList.add('lose');
    })

    allSquares.forEach(function(square) {

        if (square.classList.contains('apple') && square.classList.contains('lose')) {
            square.classList.remove('apple')
        }
        if (square.classList.contains('snake') && square.classList.contains('lose')) {
            square.classList.remove('snake')
        }
        if (square.classList.contains('apple') || square.classList.contains('snake')) {
            square.style.opacity = '0.3'
        }
    })

    bestScore.push(point);


    highestScore()


}



window.addEventListener('keydown', control)

//start the game 
start.addEventListener('click', function() {
    start.disabled = true;
    setTimeout(function() { start.disabled = false }, 1000);
    allSquares.forEach(square =>
        square.classList.remove('lose'))
    allSquares.forEach(square =>
        square.style.opacity = '1')
    apple()
    snake = [37, 36, 35]
    lastRender = 0;
    direction = 1;
    speed = 200;
    score.innerHTML = '0'
    point = 0;



    function play(currentTime) {
        var game = window.requestAnimationFrame(play)
        const interval = (currentTime - lastRender);


        if (interval >= speed) {
            lastRender = currentTime;

            function snakeBody() {
                // check if snake hits the border or itself
                switch (direction) {
                    case 1:
                        if (snake[0] == row - 1 || snake[0] % row == (row - 1)) {
                            end();
                            return window.cancelAnimationFrame(game);

                        }
                        break
                    case -1:
                        if (snake[0] == 0 || snake[0] % row == 0) {
                            end();
                            return window.cancelAnimationFrame(game);

                        }
                        break
                    case row:
                        if (snake[0] >= (row * row) - row) {
                            end();
                            return window.cancelAnimationFrame(game);

                        }
                        break
                    case -row:
                        if (snake[0] < row) {
                            end();
                            return window.cancelAnimationFrame(game);

                        }
                        break
                }

                if (allSquares[snake[0] + direction].className.includes('snake')) {
                    end();
                    return window.cancelAnimationFrame(game);

                }

                allSquares.forEach(square =>
                    square.classList.remove('snake')
                )
                for (let i = snake.length - 1; i > 0; i--) {
                    snake[i] = snake[i - 1];
                }
                snake[0] = snake[0] + direction;

                snake.forEach(function(segment) {
                    allSquares[segment].classList.add('snake');
                })

                if (allSquares[snake[0]].className.includes('apple')) {
                    apple()
                    snake.push(snake[snake.length - 1]);
                    point++;
                    score.innerHTML = point;
                    speed = speed * 0.9;
                }

            }

            snakeBody()
        }
    }
    window.requestAnimationFrame(play)


})


//for touchscreen

window.addEventListener("touchstart", startTouch, { passive: false });
window.addEventListener("touchmove", moveTouch, { passive: false });


let initialX = null;
let initialY = null;

function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
};

function moveTouch(e) {
    if (initialX === null) {
        return;
    }

    if (initialY === null) {
        return;
    }

    let currentX = e.touches[0].clientX;
    let currentY = e.touches[0].clientY;

    let diffX = initialX - currentX;
    let diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY) && (direction == row || direction == -row)) {

        if (diffX > 0) {
            // swiped left
            direction = -1;
        } else {
            // swiped right
            direction = 1;
        }
    } else if (Math.abs(diffX) <= Math.abs(diffY) && (direction == 1 || direction == -1)) {

        if (diffY > 0) {
            // swiped up
            direction = -row;
        } else {
            // swiped down
            direction = row;
        }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
};