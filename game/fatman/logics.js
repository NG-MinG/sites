
class Game{
    #Graphic;
    #canvas;
    #row;
    #colors;

    #Player;
    #ShootingBall;
    #matrixBall;
    #nextBall;
    #newBall;
    #referee;

    #removeList;
    #removed;

    #leftLine;
    #rightLine;

    #goalLine;
    #createLine;
    
    keyCode;
    #lastkey;
    
    #fps;
    #then; 

    #progress;
    #load;

    #over;
    #point;
    #level;
    
    constructor(width, height, fps) 
    {
        this.#Graphic = new Graphic(width, height);
        this.#canvas = this.#Graphic.canvasElement();
        this.#row = 0;
        this.#colors = ['blue', 'green', 'yellow'];
        
        this.#removeList = [];
        this.#removed = [];
        
        this.#leftLine = new Line(180, 0, 180, this.#canvas.height);
        this.#rightLine = new Line(620, 0, 620, this.#canvas.height);
        
        this.#Player = new Player((width - 1 - 50) / 2, height - 50 - 1, 50, 50, 5, 0.05, 1);
        this.#ShootingBall = new ShootingBall(this.#Player.x + this.#Player.width + 20, this.#Player.y + this.#Player.height - 20, 20, 20, this.#colors[Math.floor(Math.random() * this.#colors.length)]);
        this.#newBall = new ShootingBall(this.#Player.x + this.#Player.width + 20, this.#Player.y + this.#Player.height - 20, 20, 20, this.#colors[Math.floor(Math.random() * this.#colors.length)]);
        this.#matrixBall = [];
        this.#nextBall = false;
        this.#referee = new Referee(65, 350, 50, 50, this.#Player.x, this.#Player.y);
        
        this.#goalLine = new Line(0, 0 - 2 * 2 * this.#ShootingBall.r, this.#canvas.width, 0 - 2 * 2 * this.#ShootingBall.r, 0.1);
        this.#createLine = new Line(0, 0 - 2 * 2 * this.#ShootingBall.r, this.#canvas.width, 0 - 2 * 2 * this.#ShootingBall.r, 0.1);
        
        this.keyCode = [];
        this.#lastkey = 39;
        
        this.#then = window.performance.now();
        this.#fps = fps;
        
        this.#progress = 0;
        this.#load = true;
        
        this.#over = false;
        this.#point = 0;
        this.#level = 1;
    }

    Keydown = (e) =>
    {
        switch (e.keyCode)
        {
            case 37:
                // go left
                myGame.keyCode[37] = true;
            break;
            case 39:
                // go right
                myGame.keyCode[39] = true;
            break;
        }
    }

    Keyup = (e) =>
    {
        switch (e.keyCode)
        {
            case 37:
                // go left
                myGame.keyCode[37] = false;
                this.#Player.clearGravity();
            break;
            case 39:
                // go right
                myGame.keyCode[39] = false;
                this.#Player.clearGravity();
            break;
        }
    }

    Keypress = (e) =>
    {
        switch (e.keyCode)
        {
            case 32:
                // space
                myGame.keyCode[32] = true;
            break;
        }
    }
    
    start = () => 
    {
        document.body.insertAdjacentElement('afterbegin', this.#canvas);
        this.loop();
    }

    Loading(value, hue, i)
    {
        let dot = ['.', '..', '...']
        this.#Graphic.Text({
            x: this.#canvas.width / 2 - 13 * 7,
            y: this.#canvas.height / 2,
            str: 'LOADING' + dot[i]
        }, new Pen('40px Segoe UI', 'gray'));

        this.#Graphic.Rectangle({
            x: (this.#canvas.width - 730) / 2, 
            y: this.#canvas.height - (this.#canvas.height * 10 / 100),
            width: 730,
            height: 30
        }, new Pen('lightgray', 'lightgray'));

        this.#Graphic.Rectangle({
            x: (this.#canvas.width - 730) / 2, 
            y: this.#canvas.height - (this.#canvas.height * 10 / 100),
            width: value,
            height: 30
        }, new Pen('hsla(' + hue + ', 100%, 40%, 1)', 'hsla(' + hue + ', 100%, 40%, 1)'));

        this.#Graphic.Text({
            x: (this.#canvas.width - 730) / 2,
            y: this.#canvas.height - (this.#canvas.height * 10 / 100) - 6,
            str: String(Math.round(value / 7.3)) + '%'
        }, new Pen('14px Arial', 'green'));
    }

    drawBoard()
    {
        this.#Graphic.Line(this.#leftLine, new Pen(3, 'green'));
        this.#Graphic.Line(this.#rightLine, new Pen(3, 'green'));
    }

    drawPlayer()
    {
        this.#Graphic.Rectangle(this.#Player, new Pen('red', 'red'));
    }

    ControlsPlayer()
    {
        if (this.keyCode[37] == true && this.#Player.x - this.#ShootingBall.r * 2 - this.#Player.currentSpeed > this.#leftLine.startX)
        {
            this.#lastkey = 37;
            this.#Player.MovingLeft();
        }

        if (this.keyCode[39] == true && this.#Player.x + this.#Player.width + this.#ShootingBall.r * 2 + this.#Player.currentSpeed < this.#rightLine.startX) 
        {
            this.#lastkey = 39;
            this.#Player.MovingRight();
        }    

        this.#over = this.#Player.IsDead();
    }

    LoopPlayer()
    {
        this.drawPlayer();
        this.ControlsPlayer();
    }

    drawBall()
    {
        this.#Graphic.Circle(this.#ShootingBall, new Pen(this.#ShootingBall.color, this.#ShootingBall.color));
    }

    ControlsShootingBall()
    {
        if (this.keyCode[32] == true)
        {
            this.#ShootingBall.BeginShoot();
            this.keyCode[32] = false;
        }
        
        if (this.#ShootingBall.y + this.#ShootingBall.r > 0)
        {
            this.#ShootingBall.Shoot();
            if (this.#ShootingBall.IsShoot() == true)
            {
                let currentSpeed, speed;
                this.#matrixBall.forEach((ball) => {
                    let rect = getBoundingRect(ball);
                    let rect2 = getBoundingRect(this.#ShootingBall);
                    let dist = distance(rect.x, rect.y, rect2.x, rect2.y);

                    if (Math.abs(this.#ShootingBall.x - ball.x) <= rect.height && intersectRect(rect, rect2, ball.r + this.#ShootingBall.r))
                    {
                        this.#ShootingBall.EndShoot();
                        this.#ShootingBall.setXY(this.#ShootingBall.x, Math.round(this.#ShootingBall.y + (this.#ShootingBall.r + ball.r - dist)));
                        
                        currentSpeed = ball.currentSpeed;
                        speed = ball.speed;
                        
                        if (this.#nextBall == false)
                        {
                            this.#nextBall = this.#newBall;
                            this.#newBall = new ShootingBall(this.#Player.x + this.#Player.width + 20, this.#Player.y + this.#Player.height - 20, 20, 20, this.#colors[Math.floor(Math.random() * this.#colors.length)]);
                        }
                    }
                });
                // progress collision ball;
                if (this.#nextBall != false)
                {
                    this.#matrixBall.unshift(new PlayBall(this.#ShootingBall.x, this.#ShootingBall.y, this.#ShootingBall.r, speed, this.#ShootingBall.color, currentSpeed));
                    this.#removed[this.#matrixBall.length - 1] = false;
                    this.#ShootingBall = this.#nextBall;
                    this.#nextBall = false;

                    this.removeBall(this.#matrixBall[0]);

                    if (this.#removeList.length > 1)
                    {
                        this.#point += (10 * this.#removeList.length);
                        
                        this.#removeList.sort((a, b) => a - b);

                        for (let i = this.#removeList.length - 1; i >= 0; --i)
                        {
                            this.#removed[this.#removeList[i]] = false;
                            this.#matrixBall.splice(this.#removeList[i], 1);
                            this.#removeList.pop();
                        }
                    }
                    else if (this.#removeList.length == 1)
                    {
                        this.#removed[0] = false;
                        this.#removeList.pop();
                    }
                }
            }

            let mark = false;
            for (let j = 0; j < this.#matrixBall.length; ++j)
            {
                mark = false;
                if (this.#matrixBall[j].y <= this.#matrixBall[j].r || this.#matrixBall[j] == this.#ShootingBall) continue;
                for (let k = 0; k < this.#matrixBall.length; ++k)
                {
                    if (this.#matrixBall[k] == this.#ShootingBall) continue;
                    if (j != k)
                    {
                        if (this.#matrixBall[k].y < this.#matrixBall[j].y && distance(this.#matrixBall[k].x, this.#matrixBall[k].y, this.#matrixBall[j].x, this.#matrixBall[j].y) <= this.#matrixBall[j].r * 2 + 4)
                        {
                            mark = true;
                            break;
                        }
                    }
                }
                if (mark == false && this.#removeList.indexOf(j) < 0)
                {
                    this.#removeList.push(j);
                    for (let k = 0; k < this.#matrixBall.length; ++k)
                    {
                        if (j != k && this.#removeList.indexOf(k) < 0 && distance(this.#matrixBall[k].x, this.#matrixBall[k].y, this.#matrixBall[j].x, this.#matrixBall[j].y) <= this.#matrixBall[j].r * 2 + 4)
                            this.#removeList.push(k);
                    }
                }
            }

            this.#point += (10 * this.#removeList.length);

            this.#removeList.sort((a, b) => a - b);

            for (let j = this.#removeList.length - 1; j >= 0; --j)
            {
                this.#removed[this.#removeList[j]] = false;
                this.#matrixBall.splice(this.#removeList[j], 1);
                this.#removeList.pop();
            }
        }
        else
        {
            this.#ShootingBall.EndShoot();
            this.#ShootingBall = new ShootingBall(this.#Player.x + this.#Player.width + 20, this.#Player.y + this.#Player.height - 20, 20, 20, this.#colors[Math.floor(Math.random() * this.#colors.length)]);
        } 
        
        if (this.#lastkey == 37 && this.#ShootingBall.IsShoot() == false)
            this.#ShootingBall.setXY(this.#Player.x - this.#ShootingBall.r - 1);

        if (this.#lastkey == 39 && this.#ShootingBall.IsShoot() == false)
            this.#ShootingBall.setXY(this.#Player.x + this.#Player.width + 1 + this.#ShootingBall.r);
    }

    LoopBall()
    {
        this.drawBall();
        this.ControlsShootingBall();
    }

    createMatrixBall()
    {
        if (this.#load == true) 
            this.#progress++;

        if (distance(this.#goalLine.startX, this.#goalLine.startY, this.#createLine.startX, this.#createLine.startY) >= this.#ShootingBall.r * 2 - 4)
        {
            let maxball = 11, val = this.#ShootingBall.r;
            if (this.#row % 2 == 0)
            {
                maxball = 10;
                val = this.#ShootingBall.r * 2;
            }
            
            for (let i = 0; i < maxball; ++i)
            {
                this.#matrixBall.push(new PlayBall(this.#leftLine.startX + val + i * this.#ShootingBall.r * 2, this.#createLine.startY - this.#ShootingBall.r, this.#ShootingBall.r, 0.1, this.#colors[Math.floor(Math.random() * this.#colors.length)]));
                this.#removed[this.#matrixBall.length - 1] = false;

                for (let j = 1; j < this.#level; ++j)
                    this.#matrixBall[this.#matrixBall.length - 1].speedUp();
            }
                
            this.#row++;
            if (this.#row == 3) 
                this.#row = 1;

            this.#createLine.setXY(this.#createLine.startX, this.#goalLine.startY, this.#createLine.endX, this.#goalLine.endY);
        }
        
        this.#createLine.MovingBottom();
    }
    
    ControlsMatrixBall()
    {
        this.#matrixBall.forEach((element) => {
            this.#Graphic.Circle(element, new Pen(element.color, element.color));
            element.Moving();

            if (element.y + element.r >= this.#Player.y) 
                this.#over = true;
        });
    }

    LoopMatrixBall()
    {
        this.createMatrixBall();
        this.ControlsMatrixBall(); 
    }

    removeBall(Ball)
    {
        this.#matrixBall.forEach((ball, index) => {

            if (this.#removed[index] == false && ball.color == Ball.color && distance(ball.x, ball.y, Ball.x, Ball.y) <= ball.r + Ball.r + 4)
            {
                this.#removed[index] = true;
                this.removeBall(ball);
                this.#removeList.push(index);
            }
        });
    }

    updatePoint()
    {
        this.#Graphic.Text({
            x: this.#rightLine.startX + 15,
            y: this.#rightLine.startY + 50,
            str: 'POINT: ' + String(this.#point)
        }, new Pen('20px Segoe UI', 'gray'));
    }

    updateLevel()
    {
        if (this.#point >= 1000 * this.#level * this.#level && this.#level <= 3)
        {
            this.#level++;
            this.#matrixBall.forEach((ball) => {
                ball.speedUp();
            });
            this.#createLine.speedUp();
        }

        this.#Graphic.Text({
            x: this.#rightLine.startX + 15,
            y: this.#rightLine.startY + 80,
            str: 'LEVEL: ' + String(this.#level)
        }, new Pen('20px Segoe UI', 'gray'));
    }

    updateNextBall()
    {
        this.#Graphic.Text({
            x: this.#rightLine.startX + 15,
            y: this.#rightLine.startY + 80 + 50,
            str: 'NEXT: '
        }, new Pen('20px Segoe UI', 'gray'));

        this.#Graphic.Circle({
            x: this.#rightLine.startX + 15 + 20 * 4,
            y: this.#rightLine.startY + 80 + 44,
            r: this.#newBall.r
        }, new Pen(this.#newBall.color, this.#newBall.color));
    }

    loopReferee()
    {
        this.#Graphic.Rectangle(this.#referee, new Pen('black', 'black'));
        this.#referee.Shoot(this.#Player.x + this.#Player.width - 20, this.#Player.y + this.#Player.height, this.#Graphic);
        this.#referee.Punish(this.#Player);

        this.#referee.NextCard(this.#Graphic);

        this.#Graphic.Text({
            x: this.#rightLine.startX + 15,
            y: this.#rightLine.startY + 80 + 50 + 50,
            str: 'YELLOW: ' + this.#Player.yellowCard
        }, new Pen('20px Segoe UI', 'gray'));

        this.#Graphic.Text({
            x: this.#rightLine.startX + 15,
            y: this.#rightLine.startY + 80 + 50 + 50 + 30,
            str: 'RED: ' + this.#Player.redCard
        }, new Pen('20px Segoe UI', 'gray'));
    }

    loop = () => 
    {
        let x = requestAnimationFrame(this.loop);
        
        let now = window.performance.now();
        let elapsed = now - this.#then;
        let intervalFPS = (1000 / this.#fps);
        
        if (elapsed > intervalFPS && this.#over == false) {
            this.#then = now - (elapsed % intervalFPS);

            this.#Graphic.clear();

            this.LoopMatrixBall();

            if (this.#load == false)
            {
                this.drawBoard();
                this.updatePoint();
                this.updateLevel();
                this.updateNextBall();
                this.loopReferee();
                this.LoopPlayer();
                this.LoopBall();

                if (this.#over == true)
                {
                    cancelAnimationFrame(x);
                    this.GameOver();
                    return;
                }
            }
            else 
                this.Loading(this.#progress, this.#progress / 7.3, this.#progress % 3);

            if (this.#load == true && this.#row >= 2 && this.#progress / 7.3 >= 100)
            {
                this.#load = false;
                
                document.body.addEventListener('keydown', this.Keydown);
                document.body.addEventListener('keyup', this.Keyup);
                document.body.addEventListener('keypress', this.Keypress);
            }
        }
    }

    GameOver()
    {
        document.querySelector('.gameover').style.display = 'block';
    }
}