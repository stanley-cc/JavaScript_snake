const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method 會回傳一個 canvas 內的 drawing context，drawing context 可以用來在 canvas 內畫圖
const unit = 20;
const row = canvas.height / unit; //320 / 20 = 16
const column = canvas.width / unit // 320 / 20 = 16


// 把蛇的身體給搞出來
let snake = []; //array 中的每個元素，都是一個物件
function creatASnake(){
    // 物件的工作是儲存身體的 x,y 座標
    snake[0] = {
        x: 80,
        y: 0,
    };

    snake[1] = {
        x: 60,
        y: 0,
    };

    snake[2] = {
        x: 40,
        y: 0,
    };

    snake[3] = {
        x: 20,
        y: 0,
    };
}

class Fruit {
    constructor() {
        this.x = Math.floor(Math.random() * column) * unit;
        this.y = Math.floor(Math.random() * row) * unit;
    }

    drawFruit() {
        ctx.strokeStyle = "yellow";
        ctx.strokeRect(this.x, this.y, unit, unit);
    }

    pickALocation() {
        let overlapping = false;
        let new_x;
        let new_y;

        function checkOverlap(new_x, new_y) {
            // 出現的位置不能跟蛇的身體重疊 -> 用一個 for 迴圈檢查，如果重疊的話用 do-while loop 重新產生位置直到沒有重疊
            for (let i = 0; i < snake.length; i++) {
                if (new_x == snake[i].x && new_y == snake[i].y) {
                    overlapping = true;
                    return;
                } else {
                    overlapping = false;
                    // 如果沒有讓 overlapping = false 會發生的事：
                        //pickALocation 走一次 do 
                        //在 checkOverlap 時 return true 
                        //再走一次 do，有產生一個新的點，但因為 if 條件沒有滿足且沒有 else，所以 overlapping 還是 true 
                        //再走一次 do -> 無限迴圈...
                }
            }
        }

        // 如果 overlap = false 則還是會（只會）執行一次
        do {
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y);
        } while (overlapping);

        this.x = new_x;
        this.y = new_y;
    }
}

// 初始設定
creatASnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
    if (e.key == "ArrowRight" && d != "Left") {
        d = "Right";
    } else if (e.key == "ArrowDown" && d != "Up") {
        d = "Down";
    } else if (e.key == "ArrowLeft" && d != "Right") {
        d = "Left";
    } else if (e.key == "ArrowUp" && d != "Down") {
        d = "Up";
    } 

    // 每次按下上下左右鍵後，在下一幀被畫出來之前，不接受其他 keydown 事件。這樣可以防止連續案件導致蛇在邏輯上自殺
    window.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;

// setInterval 讓每 0.1 秒（或 0.5秒之類的）都跑一整個 draw()
function draw() {
    // 每次畫圖前確認有沒有咬到自己
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            clearInterval(myGame);
            alert("Game Over");
            return;
        }
    }

    // 把背景重新塗成黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myFruit.drawFruit();

    // 畫出一條原始蛇
    for (let i = 0; i < snake.length; i++) {
        if (i == 0){
            ctx.fillStyle = "lightgreen";
        } else {
            ctx.fillStyle = "lightblue";
        }
        ctx.strokeStyle = "white";

        // 每次要畫出蛇時檢查是否撞牆
        if (snake[i].x >= canvas.width) {
            snake[i].x = 0;
        }
        if (snake[i].x < 0) {
            snake[i].x = canvas.width - unit;
        }
        if (snake[i].y >= canvas.height) {
            snake[i].y = 0;
        }
        if (snake[i].y < 0) {
            snake[i].y = canvas.height - unit;
        }
    
        //.fillRect(x, y, width（向右、x軸方向）, height（向下、y軸方向）)
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    

    // 以目前 d 的變數方向，來決定蛇的下一幀要放在哪個座標
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (d == "Left") {
        snakeX -= unit;
    } else if (d == "Up") {
        snakeY -= unit;
    } else if (d == "Right") {
        snakeX += unit;
    } else if (d == "Down") {
        snakeY += unit;
    }

    let newHead = {
        x: snakeX,
        y: snakeY,
    };

    // 確認蛇是否有吃到果實
    if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
        myFruit.pickALocation();
        // myFruit.drawFruit(); 可以不寫，因為下一個 interval 會在 draw() 中重新執行
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
        document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
    } else {
        snake.pop(); // 所謂變長就是不要 pop
    }
    // console.log(snakeX,snakeY);
    snake.unshift(newHead);
    window.addEventListener("keydown", changeDirection);
}



let myGame = setInterval(draw, 150);

function loadHighestScore(){
    if (localStorage.getItem("highestScore") == null) {
        highestScore = 0;
    } else {
        highestScore = Number(localStorage.getItem("highestScore"));
    }
}

function setHighestScore(score) {
    if (score > highestScore) {
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}
