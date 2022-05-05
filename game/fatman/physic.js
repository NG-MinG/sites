function distance (x1, y1, x2, y2) { return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2); };

function getBoundingRect(Ball)
{
    let ballHeight = Ball.r * 2;
    let ballWidth = Ball.r * 2;
    let x1 = Ball.x - Ball.r;
    let y1 = Ball.y - Ball.r;

    return {
        x: x1,
        y: y1,
        width: ballWidth,
        height: ballHeight        
    };
}   

function intersectRect(r1, r2, val = -1) {
    if (val == -1)
        return !(r2.x > r1.x + r1.width || 
            r2.x + r2.width < r1.x || 
            r2.y > r1.y + r1.height ||
            r2.y + r2.height < r1.y);
        
    return !(r2.x > r1.x + r1.width || 
            r2.x + r2.width < r1.x || 
            distance(r1.x, r1.y, r2.x, r2.y) > val);
}

function getQuadraticBezierXY(percent, x1, y1, x2, y2, x3, y3) {
    let x = Math.pow(1 - percent, 2) * x1 + 2 * (1 - percent) * percent * x2 + Math.pow(percent, 2) * x3;
    let y = Math.pow(1 - percent, 2) * y1 + 2 * (1 - percent) * percent * y2 + Math.pow(percent, 2) * y3;
    return ({
        x: x,
        y: y
    });
}