class Rectangle
{
    _x;
    _y;
    _width;
    _height;

    constructor(x, y, w, h)
    {
        this._x = x;
        this._y = y;
        this._width = w;
        this._height = h;
    }

    get x()
    {
        return this._x;
    }

    get y()
    {
        return this._y;
    }

    get width()
    {
        return this._width;
    }

    get height()
    {
        return this._height;
    }

    setXY(x, y)
    {
        if (x != undefined)
            this._x = x;
        if (y != undefined)
            this._y = y;
    }
}

class Player extends Rectangle
{
    #alive;
    #yellowCard;
    #redCard;
    #gravitySpeed;
    #gravity;
    #speedX;
    #prevGS;

    constructor(x, y, w, h, sp, g, gs)
    {
        super(x, y, w, h);

        this.#alive = true;
        this.#yellowCard = 0;
        this.#redCard = 0;
        this.#speedX = sp;
        this.#gravity = g;
        this.#gravitySpeed = gs;
        this.#prevGS = gs;
    }

    get currentSpeed()
    {
        return this.#speedX + this.#gravitySpeed;
    }

    Kill()
    {
        this.#alive = false;
    }

    IsDead()
    {
        return !this.#alive;
    }

    clearGravity()
    {
        this.#gravitySpeed = this.#prevGS;
    }

    MovingLeft()
    {
        this.#gravitySpeed += this.#gravity;
        this._x -= this.#speedX + this.#gravitySpeed;
    }

    MovingRight()
    {
        this.#gravitySpeed += this.#gravity;
        this._x += this.#speedX + this.#gravitySpeed;
    }

    Moving(keyCode)
    {
        if (keyCode[37] == true)
            this.MovingLeft();

        if (keyCode[39] == true)
            this.MovingRight();
    }

    get redCard()
    {
        return this.#redCard;
    }

    get yellowCard()
    {
        return this.#yellowCard;
    }

    UpYellow()
    {
        this.#yellowCard++;
        if (this.yellowCard == 2) this.#alive = false;
    }

    UpRed()
    {
        this.#redCard++;
        if (this.#redCard == 1) this.#alive = false;
    }
}

class Referee extends Rectangle
{
    #Card;
    #colorCard;
    #nextCard;

    #lineShoot;
    #shoot;

    #percent;

    constructor(x, y, w, h, PlayerX, PlayerY)
    {
        super(x, y, w, h);

        this.#Card = new Rectangle(x + 5, y + 5, 20, 25);
        this.#nextCard = (Math.floor(Math.random() * 30) % 2 == 0) ? "red" : "yellow";
        
        this.#lineShoot = new QuadCurve(x + 10, y + 10, 250, 200, PlayerX, PlayerY);
        this.#shoot = false;

        this.#percent = 0;
    }

    Punish(Player)
    {
        if (intersectRect(Player, this.#Card))
        {
            if (this.#colorCard == 'yellow')
                Player.UpYellow();
            else if (this.#colorCard == 'red')
                Player.UpRed();
            
            this.#Card.setXY(this._x, this._y);
            
            this.#shoot = false;
            this.#percent = 0;
        }
    }

    Shoot(PlayerX, PlayerY, Graphics)
    {
        if (this.#shoot == true && this.#percent < 1)
        {
            let point = this.#lineShoot.toLineXY(this.#percent, PlayerX, PlayerY);
            this.#Card.setXY(point.x, point.y);
            Graphics.Rectangle(this.#Card, new Pen(this.#colorCard, this.#colorCard));
            this.#percent += 0.0075;
        }
        else 
        {
            this.#shoot = (Math.floor(Math.random() * 250) == 10);
            if (this.#shoot == 1)
            {
                this.#percent = 0;
                this.#colorCard = this.#nextCard;
                this.#nextCard = (Math.floor(Math.random() * 30) % 2 == 0) ? "red" : "yellow";
                
                this.#lineShoot.LockXY(PlayerX, PlayerY);
            }
        }
    }

    NextCard(Graphics)
    {
        Graphics.Rectangle({
            x : this._x + 5,
            y: this._y + 5,
            width: this.#Card.width,
            height: this.#Card.height
        }, new Pen(this.#nextCard, this.#nextCard));
    }
}

class QuadCurve
{
    #x1;
    #y1;
    
    #x2;
    #y2;

    #x3;
    #y3;

    constructor(x1, y1, x2, y2, x3, y3)
    {
        this.#x1 = x1;
        this.#y1 = y1;
        
        this.#x2 = x2;
        this.#y2 = y2;

        this.#x3 = x3;
        this.#y3 = y3;
    }

    toLineXY(percent)
    {   
        return getQuadraticBezierXY(percent, this.#x1, this.#y1, this.#x2, this.#y2, this.#x3, this.#y3);
    }

    LockXY(x3, y3)
    {
        this.#x3 = x3;
        this.#y3 = y3;
    }
}

class Ball
{
    _x;
    _y;
    _r;
    _color;

    constructor(x, y, r, color)
    {
        this._x = x;
        this._y = y;
        this._r = r;
        this._color = color;
    }

    get x()
    {
        return this._x;
    }

    get y()
    {
        return this._y;
    }

    get r()
    {
        return this._r;
    }

    get color()
    {
        return this._color;
    }

    setXY(x, y)
    {
        if (x != undefined) this._x = x;
        if (y != undefined) this._y = y;
    }
}

class ShootingBall extends Ball
{
    #speed;
    #shoot;

    constructor(x, y, r, s, c)
    {
        super(x, y, r, c);

        this.#speed = s;
        this.#shoot = false;
    }

    get speed()
    {
        return this.#speed;
    }

    IsShoot()
    {
        return this.#shoot;
    }

    BeginShoot()
    {
        if (!this.IsShoot())
            this.#shoot = true;
    }

    Shoot()
    {
        if (this.IsShoot())
            this._y -= this.#speed;
    }

    EndShoot()
    {
        if (this.IsShoot())
            this.#shoot = false;
    }
}

class PlayBall extends Ball
{
    #speed;
    #currentSpeed;

    constructor(x, y, r, s, c, cs)
    {
        super(x, y, r, c);

        this.#speed = s;
        this.#currentSpeed = (cs != undefined) ? cs : s;
    }

    Moving()
    {
        this._y += this.#currentSpeed;
    }

    get currentSpeed()
    {
        return this.#currentSpeed;
    }

    get speed()
    {
        return this.#speed;
    }

    speedUp()
    {
        this.#currentSpeed += this.#speed;
    }

    speedDown()
    {
        this.#currentSpeed -= this.speed;
    }
}

class Line
{
    #startX;
    #startY;

    #endX;
    #endY;

    #speed;
    #currentSpeed;

    constructor(sx, sy, ex, ey, s, cs)
    {
        this.#startX = sx;
        this.#startY = sy;

        this.#endX = ex;
        this.#endY = ey;

        this.#speed = s;
        this.#currentSpeed = (cs != undefined) ? cs : s;
    }

    get startX()
    {
        return this.#startX;
    }

    get startY()
    {
        return this.#startY;
    }

    get endX()
    {
        return this.#endX;
    }

    get endY()
    {
        return this.#endY;
    }

    setXY(x1, y1, x2, y2)
    {
        if (x1 != undefined) this.#startX = x1;
        if (y1 != undefined) this.#startY = y1;

        if (x2 != undefined) this.#endX = x2;
        if (y1 != undefined) this.#endY = y2;
    }

    MovingBottom()
    {
        this.#startY += this.#currentSpeed;
        this.#endY += this.#currentSpeed;
    }

    speedUp()
    {
        this.#currentSpeed += this.#speed;
    }

    speedDown()
    {
        this.#currentSpeed -= this.#speed;
    }
}