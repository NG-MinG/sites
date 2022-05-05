class Pen
{
    stroke;
    color;
    img;
    constructor(stroke = 'black', color = 'black', image = null)
    {
        this.stroke = stroke;
        this.color = color;
        if (image != null)
        {
            this.img = new Image();
            this.img.src = image;
        }
    };
}

class Graphic
{
    #canvas;
    #context2D;
    constructor(width, height)
    {
        this.#canvas = document.createElement('canvas');
        this.#canvas.classList.add('fatman');
        this.#canvas.width = width;
        this.#canvas.height = height;

        this.#context2D = this.#canvas.getContext("2d");
    }
    
    canvasElement() 
    {
        return this.#canvas;
    }

    clear()
    {
        this.#context2D.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }

    Text(text, pen)
    {
        this.#context2D.beginPath();
        this.#context2D.font = pen.stroke;
        this.#context2D.strokeStyle = pen.color;
        this.#context2D.strokeText(text.str, text.x, text.y);
        this.#context2D.closePath();
    }
    
    Rectangle(rectangle, pen)
    {
        if (pen && pen.img == null)
        {
            this.#context2D.strokeStyle = pen.stroke;
            this.#context2D.fillStyle = pen.color;
        }
        
        if (pen && pen.img)
        this.#context2D.drawImage(pen.img, rectangle.x, rectangle.y);
        else 
        {
            this.#context2D.beginPath();
            this.#context2D.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
            this.#context2D.stroke();
            this.#context2D.fill();
            this.#context2D.closePath();
        }
    }
    
    Circle(circle, pen)
    {
        if (pen && pen.img == null)
        {
            this.#context2D.strokeStyle = pen.stroke;
            this.#context2D.fillStyle = pen.color;
        }
        
        if (pen && pen.img)
        {
            //this.#context2D.drawImage(pen.img, circle.x, circle.y);
            this.#context2D.save();
            this.#context2D.beginPath();
            this.#context2D.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
            this.#context2D.clip();
            this.#context2D.drawImage(pen.img, circle.x - circle.r, circle.y - circle.r, circle.r * 2, circle.r * 2);
            this.#context2D.restore();
        }
        else 
        {
            this.#context2D.beginPath();
            this.#context2D.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
            this.#context2D.stroke();
            this.#context2D.fill();
            this.#context2D.closePath();
        }   
    }
    
    Line(line, pen) 
    {
        this.#context2D.beginPath();
        this.#context2D.strokeStyle = pen.color;
        this.#context2D.lineWidth = pen.stroke;
        this.#context2D.moveTo(line.startX, line.startY);
        this.#context2D.lineTo(line.endX, line.endY);
        this.#context2D.stroke();
        this.#context2D.closePath();
    }
    
    QuadraticCurve() 
    {
        
    }
}